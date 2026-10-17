const User = require('../models/User');
const Job = require('../models/Job');
const FreelanceJob = require('../models/FreelanceJob');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const InterviewRequest = require('../models/InterviewRequest');
const Resume = require('../models/Resume');
const JobSource = require('../models/JobSource');
const EmailLog = require('../models/EmailLog');
const AuditLog = require('../models/AuditLog');
const path = require('path');
const fs = require('fs');
const { verifyManualUtr } = require('../services/paymentService');
const { scheduleInterviewByAdmin } = require('../services/interviewService');
const { generateAtsPdf } = require('../services/resumeService');
const { sendResumeDeliveryEmail } = require('../services/emailService');

/**
 * Admin Dashboard KPI Metrics and Charts
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeJobs,
      walkinJobs,
      freelanceJobs,
      totalApplications,
      interviewRequests,
      totalPayments,
      resumeOrders,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'active', isWalkin: true }),
      FreelanceJob.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      InterviewRequest.countDocuments(),
      Payment.countDocuments(),
      Resume.countDocuments(),
      Payment.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(6),
    ]);

    // Calculate revenue
    const revenueAgg = await Payment.aggregate([
      { $match: { status: { $in: ['PAID', 'VERIFIED'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Jobs by city
    const jobsByCity = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeJobs,
          walkinJobs,
          freelanceJobs,
          totalApplications,
          interviewRequests,
          totalPayments,
          totalRevenue,
          resumeOrders,
        },
        jobsByCity: jobsByCity.map((c) => ({ city: c._id || 'Other', count: c.count })),
        recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Management
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['candidate', 'admin', 'staff'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'USER_ROLE_UPDATED',
      targetModel: 'User',
      targetId: user._id.toString(),
      details: { updatedUserEmail: user.email, newRole: role },
    });

    return res.status(200).json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Job Management CRUD
 */
const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: [Number(req.body.longitude) || 76.7794, Number(req.body.latitude) || 30.7333],
      },
    };

    const job = await Job.create(jobData);

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'JOB_CREATED',
      targetModel: 'Job',
      targetId: job._id.toString(),
      details: { title: job.title, company: job.company },
    });

    return res.status(201).json({ success: true, message: 'Job posted successfully', data: job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.body.longitude && req.body.latitude) {
      updates.location = {
        type: 'Point',
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
      };
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'JOB_UPDATED',
      targetModel: 'Job',
      targetId: job._id.toString(),
      details: updates,
    });

    return res.status(200).json({ success: true, message: 'Job updated', data: job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'JOB_DELETED',
      targetModel: 'Job',
      targetId: req.params.id,
      details: { title: job.title, company: job.company },
    });

    return res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Payment Verification Actions
 */
const getPayments = async (req, res, next) => {
  try {
    const { status, serviceType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (serviceType && serviceType !== 'All') query.serviceType = serviceType;

    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('user', 'name email phone')
        .populate('job', 'title company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPaymentUtr = async (req, res, next) => {
  try {
    const { approved = true, adminNotes = '' } = req.body;
    const payment = await verifyManualUtr({
      paymentId: req.params.id,
      adminUser: req.user,
      approved,
      adminNotes,
    });

    return res.status(200).json({
      success: true,
      message: `Payment marked as ${payment.status}`,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Interview Assistance Scheduling
 */
const getInterviews = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [interviews, total] = await Promise.all([
      InterviewRequest.find(query)
        .populate('candidate', 'name email phone')
        .populate('job', 'title company city')
        .populate('payment')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InterviewRequest.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: interviews,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

const scheduleInterview = async (req, res, next) => {
  try {
    const updated = await scheduleInterviewByAdmin({
      requestId: req.params.id,
      adminUser: req.user,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      message: 'Interview scheduled and confirmation email dispatched to candidate.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resume Orders
 */
const getResumeOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Resume.find()
        .populate('user', 'name email')
        .populate('targetJob', 'title company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Resume.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

const verifyResumePayment = async (req, res, next) => {
  try {
    const { approved = true, adminNotes = '' } = req.body;
    const resume = await Resume.findById(req.params.id).populate('user');
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume order not found' });
    }

    if (approved) {
      resume.paymentStatus = 'verified';
      resume.isPaid = true;
      resume.adminNotes = adminNotes || 'Payment verified by administrator';
      resume.verifiedAt = new Date();
      resume.verifiedBy = req.user._id;

      // Update linked payment if any
      if (resume.payment) {
        await Payment.findByIdAndUpdate(resume.payment, {
          status: 'PAID',
          adminNotes: resume.adminNotes,
          verifiedAt: new Date(),
          verifiedBy: req.user._id,
        });
      }

      // Generate the tailored PDF
      const outputDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const pdfFilename = `ats_resume_${resume._id}.pdf`;
      const pdfPath = path.join(outputDir, pdfFilename);
      await generateAtsPdf(resume.customizedData || resume.extractedData, pdfPath, resume.jobDescription);
      resume.generatedPdfUrl = `/uploads/${pdfFilename}`;

      // Email dispatch
      try {
        await sendResumeDeliveryEmail(resume.user, resume, [
          {
            filename: `${(resume.customizedData?.name || 'Resume').replace(/\s+/g, '_')}_GrabJob_ATS.pdf`,
            path: pdfPath,
          },
        ]);
        resume.isEmailDelivered = true;
      } catch (err) {
        console.warn('[Admin Resume Delivery Email Failed]:', err.message);
      }

      await resume.save();

      await AuditLog.create({
        admin: req.user._id,
        adminEmail: req.user.email,
        action: 'RESUME_PAYMENT_VERIFIED',
        targetModel: 'Resume',
        targetId: resume._id.toString(),
        details: { candidateEmail: resume.user?.email, utrNumber: resume.utrNumber },
      });

      return res.status(200).json({
        success: true,
        message: 'Resume payment verified! ATS PDF generated and dispatched via email.',
        data: resume,
      });
    } else {
      resume.paymentStatus = 'rejected';
      resume.adminNotes = adminNotes || 'Payment verification rejected';
      if (resume.payment) {
        await Payment.findByIdAndUpdate(resume.payment, {
          status: 'REJECTED',
          adminNotes: resume.adminNotes,
        });
      }
      await resume.save();

      await AuditLog.create({
        admin: req.user._id,
        adminEmail: req.user.email,
        action: 'RESUME_PAYMENT_REJECTED',
        targetModel: 'Resume',
        targetId: resume._id.toString(),
        details: { candidateEmail: resume.user?.email, reason: adminNotes },
      });

      return res.status(200).json({
        success: true,
        message: 'Resume payment rejected.',
        data: resume,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Compliant Job Sources
 */
const getJobSources = async (req, res, next) => {
  try {
    const sources = await JobSource.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: sources });
  } catch (error) {
    next(error);
  }
};

const createJobSource = async (req, res, next) => {
  try {
    const source = await JobSource.create(req.body);
    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'JOB_SOURCE_CREATED',
      targetModel: 'JobSource',
      targetId: source._id.toString(),
      details: { name: source.name, type: source.type },
    });

    return res.status(201).json({ success: true, data: source });
  } catch (error) {
    next(error);
  }
};

/**
 * System Transparency & Compliance Logs
 */
const getEmailLogs = async (req, res, next) => {
  try {
    const logs = await EmailLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  createJob,
  updateJob,
  deleteJob,
  getPayments,
  verifyPaymentUtr,
  getInterviews,
  scheduleInterview,
  getResumeOrders,
  verifyResumePayment,
  getJobSources,
  createJobSource,
  getEmailLogs,
  getAuditLogs,
};

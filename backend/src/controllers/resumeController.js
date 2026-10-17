const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Payment = require('../models/Payment');
const {
  extractTextFromFile,
  parseResumeSections,
  calculateSelectionProbability,
  generateAtsPdf,
  generateAtsDocx,
} = require('../services/resumeService');
const { analyzeResume } = require('../services/aiService');
const { sendResumeDeliveryEmail } = require('../services/emailService');

/**
 * Step 1: Upload and extract text from old CV
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF or DOCX resume document (Max 5MB).',
      });
    }

    const filePath = req.file.path;
    const rawText = await extractTextFromFile(filePath);
    const parsedData = parseResumeSections(rawText);
    const initialProbability = calculateSelectionProbability(parsedData, '');

    // Safely assign user if authenticated
    const userId = req.user ? req.user._id : null;

    // Create draft resume record
    const resumeRecord = await Resume.create({
      user: userId,
      originalFileName: req.file.originalname,
      originalFileUrl: `/uploads/${path.basename(filePath)}`,
      extractedData: parsedData,
      customizedData: parsedData,
      aiAnalysis: initialProbability,
      selectionProbability: initialProbability.selectionProbability,
    });

    return res.status(200).json({
      success: true,
      message: 'Resume parsed and analyzed successfully.',
      data: {
        resumeId: resumeRecord._id,
        parsedData,
        analysis: initialProbability,
        originalFileName: req.file.originalname,
        originalFileUrl: resumeRecord.originalFileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 2: Match CV against Job Description (JD) and calculate selection probability %
 */
const matchResumeWithJd = async (req, res, next) => {
  try {
    const { resumeId, jobDescription = '', targetJobTitle = '' } = req.body;

    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      // Find latest resume of user
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    // Default mock data if no resume uploaded yet
    const resumeData = resume?.customizedData || resume?.extractedData || {
      name: req.user.name || 'Deepak Kumar',
      email: req.user.email || 'deepak@grabjob.in',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
      experience: [
        {
          title: 'Software Developer',
          company: 'Tech Solutions India',
          duration: '2022 - Present',
          description: 'Engineered web applications and REST APIs using modern JavaScript stacks.',
        },
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'Punjab Technical University',
          year: '2021',
        },
      ],
    };

    const evaluation = calculateSelectionProbability(resumeData, jobDescription);

    if (resume) {
      resume.jobDescription = jobDescription;
      if (targetJobTitle) resume.targetJobTitle = targetJobTitle;
      resume.selectionProbability = evaluation.selectionProbability;
      resume.aiAnalysis = {
        ...resume.aiAnalysis,
        ...evaluation,
      };
      await resume.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Selection probability computed successfully.',
      data: {
        resumeId: resume?._id,
        selectionProbability: evaluation.selectionProbability,
        matchingSkills: evaluation.matchingSkills,
        missingSkills: evaluation.missingSkills,
        scoreBreakdown: {
          formatting: evaluation.formattingScore,
          keywords: evaluation.keywordsScore,
          experience: evaluation.experienceScore,
          skills: evaluation.skillsScore,
          education: evaluation.educationScore,
        },
        recommendations: evaluation.recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Candidate submits ₹50 manual payment proof (UTR number & optional screenshot)
 */
const submitManualResumePayment = async (req, res, next) => {
  try {
    const { resumeId, utrNumber } = req.body;

    if (!utrNumber || utrNumber.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 12-digit UPI / UTR Transaction Reference Number.',
      });
    }

    let resume = null;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    } else {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    if (!resume) {
      // Create a resume record if none exists
      resume = await Resume.create({
        user: req.user._id,
        originalFileName: 'Uploaded_Resume.pdf',
        extractedData: parseResumeSections(''),
        customizedData: parseResumeSections(''),
      });
    }

    const screenshotUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : '';

    // Create linked Payment entry
    const payment = await Payment.create({
      user: req.user._id,
      serviceType: 'resume_builder',
      amount: 50,
      currency: 'INR',
      gateway: 'manual_utr',
      orderId: `ORD_RES_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      paymentId: `PAY_UTR_${utrNumber.trim()}`,
      utr: utrNumber.trim(),
      status: 'PROCESSING',
      adminNotes: 'Submitted via Candidate ATS Resume Builder',
    });

    resume.payment = payment._id;
    resume.utrNumber = utrNumber.trim();
    resume.paymentAmount = 50;
    resume.paymentStatus = 'pending_verification';
    if (screenshotUrl) resume.paymentScreenshot = screenshotUrl;
    await resume.save();

    return res.status(200).json({
      success: true,
      message: 'Payment details submitted! Verification is in progress.',
      data: {
        resumeId: resume._id,
        paymentStatus: resume.paymentStatus,
        utrNumber: resume.utrNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 4: Generate ATS-friendly PDF and DOCX
 */
const generateResume = async (req, res, next) => {
  try {
    const { resumeId, customizedData } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (customizedData) {
      resume.customizedData = customizedData;
    }

    const outputDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pdfFilename = `ats_resume_${resume._id}.pdf`;
    const docxFilename = `ats_resume_${resume._id}.docx`;
    const pdfPath = path.join(outputDir, pdfFilename);
    const docxPath = path.join(outputDir, docxFilename);

    await generateAtsPdf(resume.customizedData || resume.extractedData, pdfPath, resume.jobDescription);
    await generateAtsDocx(resume.customizedData || resume.extractedData, docxPath);

    resume.generatedPdfUrl = `/uploads/${pdfFilename}`;
    resume.generatedDocxUrl = `/uploads/${docxFilename}`;
    resume.isPaid = true;
    resume.paymentStatus = 'verified';
    await resume.save();

    // Send email with generated PDF attachment
    try {
      await sendResumeDeliveryEmail(req.user, resume, [
        {
          filename: `${(resume.customizedData?.name || 'Resume').replace(/\s+/g, '_')}_GrabJob_ATS.pdf`,
          path: pdfPath,
        },
      ]);
      resume.isEmailDelivered = true;
      await resume.save();
    } catch (emailErr) {
      console.warn('[Resume Email Delivery Warning]:', emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'ATS Resume successfully generated and emailed!',
      data: {
        resumeId: resume._id,
        pdfUrl: resume.generatedPdfUrl,
        docxUrl: resume.generatedDocxUrl,
        isEmailDelivered: resume.isEmailDelivered,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate's resumes
 */
const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate('targetJob')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get resume by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('targetJob');

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  matchResumeWithJd,
  submitManualResumePayment,
  generateResume,
  getMyResumes,
  getResumeById,
};

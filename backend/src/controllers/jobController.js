const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const Application = require('../models/Application');
const { sendJobApplicationEmail } = require('../services/emailService');

/**
 * Get all jobs with flexible filters, pagination & search
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      city,
      state,
      jobType,
      workMode,
      experience,
      minSalary,
      category,
      isWalkin,
      isVerified,
      datePosted, // 'today', 'week', 'month'
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = { status: 'active' };

    // Text search in title, company, skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isWalkin === 'true') {
      query.isWalkin = true;
    }

    if (isVerified === 'true') {
      query.isVerified = true;
    }

    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    if (datePosted) {
      const now = new Date();
      if (datePosted === 'today') {
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        query.createdAt = { $gte: todayStart };
      } else if (datePosted === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        query.createdAt = { $gte: weekAgo };
      } else if (datePosted === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        query.createdAt = { $gte: monthAgo };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single job details by ID
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or has been closed.',
      });
    }

    // Increment view count
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    // Check if current user saved or applied
    let isSaved = false;
    let hasApplied = false;

    if (req.user) {
      const saved = await SavedJob.findOne({ user: req.user._id, job: job._id });
      isSaved = !!saved;
      const applied = await Application.findOne({ candidate: req.user._id, job: job._id });
      hasApplied = !!applied;
    }

    return res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        isSaved,
        hasApplied,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Find nearby jobs using geospatial 2dsphere index
 */
const getNearbyJobs = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25, isWalkin } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and Longitude are required for nearby job search.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    const radiusMeters = radiusKm * 1000;

    const query = {
      status: 'active',
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusMeters,
        },
      },
    };

    if (isWalkin === 'true') {
      query.isWalkin = true;
    }

    const jobs = await Job.find(query).limit(50);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      radiusKm,
      data: jobs,
    });
  } catch (error) {
    // If geospatial index is initializing or fallback needed
    console.warn('[Geospatial Query fallback]:', error.message);
    const fallbackJobs = await Job.find({ status: 'active' }).limit(30);
    return res.status(200).json({
      success: true,
      count: fallbackJobs.length,
      data: fallbackJobs,
      note: 'Using standard radius filter fallback',
    });
  }
};

/**
 * Get walk-in interview jobs (Today, Tomorrow, This Week)
 */
const getWalkinJobs = async (req, res, next) => {
  try {
    const { timeframe, city, category } = req.query;

    const query = {
      status: 'active',
      isWalkin: true,
    };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrowStart);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    if (timeframe === 'today') {
      query.walkinDate = { $gte: todayStart, $lt: tomorrowStart };
    } else if (timeframe === 'tomorrow') {
      query.walkinDate = { $gte: tomorrowStart, $lt: dayAfterTomorrow };
    } else if (timeframe === 'week') {
      query.walkinDate = { $gte: todayStart, $lte: weekEnd };
    }

    let walkinJobs = await Job.find(query).sort({ walkinDate: 1, createdAt: -1 });

    // Fallback: If date filter is empty in demo mode, return available walkin jobs
    if (walkinJobs.length === 0 && timeframe) {
      walkinJobs = await Job.find({ status: 'active', isWalkin: true }).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: walkinJobs.length,
      data: walkinJobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply to a job (Internal GrabJob or link to verified external source)
 */
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check external application
    if (job.source !== 'employer' && job.sourceUrl) {
      return res.status(200).json({
        success: true,
        isExternal: true,
        externalUrl: job.sourceUrl,
        message: `Please complete your application directly on the official source website (${job.sourceName}).`,
      });
    }

    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job position.',
      });
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      resumeUrl: req.user.resumeUrl || '',
      coverLetter: req.body.coverLetter || '',
      status: 'Applied',
      statusTimeline: [
        {
          status: 'Applied',
          note: 'Application submitted successfully on GrabJob.',
        },
      ],
    });

    job.applicationsCount = (job.applicationsCount || 0) + 1;
    await job.save();

    // Send application confirmation email asynchronously
    sendJobApplicationEmail(req.user, job).catch((err) =>
      console.warn('[Application Email Error]:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save / Bookmark job
 */
const saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await SavedJob.findOneAndUpdate(
      { user: req.user._id, job: job._id },
      { user: req.user._id, job: job._id },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Job saved to your bookmarks.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsave / Remove bookmark
 */
const unsaveJob = async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: req.params.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Job removed from your bookmarks.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's saved jobs
 */
const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    const validJobs = saved.filter((s) => s.job != null).map((s) => s.job);

    return res.status(200).json({
      success: true,
      data: validJobs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  getNearbyJobs,
  getWalkinJobs,
  applyToJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
};

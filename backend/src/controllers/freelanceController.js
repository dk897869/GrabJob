const FreelanceJob = require('../models/FreelanceJob');

const getFreelanceJobs = async (req, res, next) => {
  try {
    const { category, search, isRemote, page = 1, limit = 20 } = req.query;

    const query = { status: 'active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isRemote === 'true') {
      query.isRemote = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      FreelanceJob.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      FreelanceJob.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: projects,
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

const getFreelanceJobById = async (req, res, next) => {
  try {
    const project = await FreelanceJob.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Freelance project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFreelanceJobs,
  getFreelanceJobById,
};

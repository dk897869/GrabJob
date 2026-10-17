const { chatCareerAssistant } = require('../services/aiService');
const Job = require('../models/Job');

const handleChat = async (req, res, next) => {
  try {
    const { messages, jobId } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required.',
      });
    }

    const userContext = req.user
      ? {
          name: req.user.name,
          city: req.user.city,
          skills: req.user.skills,
          currentRole: req.user.currentRole,
        }
      : {};

    if (jobId) {
      const job = await Job.findById(jobId).select('title company skills description');
      if (job) {
        userContext.currentJob = `${job.title} at ${job.company}. Required skills: ${job.skills.join(', ')}`;
      }
    }

    const aiResponse = await chatCareerAssistant(messages, userContext);

    return res.status(200).json({
      success: true,
      data: {
        reply: aiResponse.reply,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestedPrompts = (req, res) => {
  const prompts = [
    'Find jobs for me',
    'Improve my resume',
    'Prepare for interview',
    'What skills do I need?',
    'Explain this job',
    'Career advice',
  ];

  return res.status(200).json({
    success: true,
    data: prompts,
  });
};

module.exports = {
  handleChat,
  getSuggestedPrompts,
};

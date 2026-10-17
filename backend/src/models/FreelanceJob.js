const mongoose = require('mongoose');

const freelanceJobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Freelance project title is required'],
      trim: true,
      index: true,
    },
    client: {
      type: String,
      required: [true, 'Client or agency name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: [
        'Development',
        'Design',
        'Writing',
        'Marketing',
        'Data',
        'Video',
        'Customer Support',
        'Virtual Assistant',
        'Other',
      ],
      default: 'Development',
      index: true,
    },
    budget: {
      type: String,
      required: true, // e.g. "₹15,000 - ₹25,000" or "₹1,200 / hr"
    },
    budgetMin: {
      type: Number,
      default: 5000,
    },
    budgetMax: {
      type: Number,
      default: 50000,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    duration: {
      type: String,
      default: '2-4 Weeks',
    },
    deadline: {
      type: String,
      default: 'Flexible',
    },
    isRemote: {
      type: Boolean,
      default: true,
      index: true,
    },
    location: {
      type: String,
      default: 'Remote (India)',
    },
    source: {
      type: String,
      default: 'Direct Client',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
      index: true,
    },
    proposalsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FreelanceJob', freelanceJobSchema);

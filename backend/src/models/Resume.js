const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    targetJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    targetJobTitle: {
      type: String,
      default: '',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    selectionProbability: {
      type: Number,
      default: 75,
    },
    originalFileName: {
      type: String,
      default: '',
    },
    originalFileUrl: {
      type: String,
      default: '',
    },
    extractedData: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          technologies: String,
        },
      ],
      certifications: { type: [String], default: [] },
    },
    aiAnalysis: {
      matchScore: { type: Number, default: 78 },
      formattingScore: { type: Number, default: 85 },
      keywordsScore: { type: Number, default: 72 },
      experienceScore: { type: Number, default: 80 },
      skillsScore: { type: Number, default: 68 },
      educationScore: { type: Number, default: 90 },
      matchingSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      keywordSuggestions: { type: [String], default: [] },
      formattingIssues: { type: [String], default: [] },
      improvementTips: { type: [String], default: [] },
    },
    customizedData: {
      name: String,
      email: String,
      phone: String,
      summary: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          technologies: String,
        },
      ],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending_verification', 'verified', 'rejected'],
      default: 'unpaid',
      index: true,
    },
    paymentAmount: {
      type: Number,
      default: 50,
    },
    utrNumber: {
      type: String,
      default: '',
      index: true,
    },
    paymentScreenshot: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    generatedPdfUrl: {
      type: String,
      default: '',
    },
    generatedDocxUrl: {
      type: String,
      default: '',
    },
    isEmailDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);

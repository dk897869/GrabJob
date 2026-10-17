const mongoose = require('mongoose');

const jobSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['employer', 'official_api', 'partner_feed', 'licensed_feed', 'licensed_aggregator', 'manual_verified'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    apiUrl: {
      type: String,
      default: '',
    },
    isConfigured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncAt: {
      type: Date,
    },
    totalJobsImported: {
      type: Number,
      default: 0,
    },
    requiresCredentials: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: 'Compliant feed/API adapter only. No illegal scraping.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobSource', jobSourceSchema);

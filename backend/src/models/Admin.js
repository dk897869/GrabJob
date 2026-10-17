const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: 'Job Operations & Verification',
    },
    permissions: {
      type: [String],
      default: [
        'manage_users',
        'manage_jobs',
        'manage_walkins',
        'manage_freelance',
        'manage_payments',
        'manage_interviews',
        'manage_resumes',
        'manage_job_sources',
        'view_logs',
      ],
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);

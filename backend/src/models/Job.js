const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryDisplay: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '0-2 Years',
    },
    experienceMin: {
      type: Number,
      default: 0,
    },
    experienceMax: {
      type: Number,
      default: 10,
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full Time',
      index: true,
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'On-site',
      index: true,
    },
    category: {
      type: String,
      default: 'IT & Software',
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [76.7794, 30.7333], // Default Chandigarh [lng, lat]
      },
    },
    // Walk-in Interview specific attributes
    isWalkin: {
      type: Boolean,
      default: false,
      index: true,
    },
    walkinDate: {
      type: Date,
    },
    walkinDateDisplay: {
      type: String,
      default: '',
    },
    walkinStartTime: {
      type: String,
      default: '',
    },
    walkinEndTime: {
      type: String,
      default: '',
    },
    walkinVenue: {
      type: String,
      default: '',
    },
    walkinAddress: {
      type: String,
      default: '',
    },
    // Source & Provenance
    source: {
      type: String,
      enum: ['employer', 'official_api', 'licensed_feed', 'manual_verified', 'linkedin', 'indeed', 'naukri'],
      default: 'employer',
    },
    sourceName: {
      type: String,
      default: 'GrabJob Employer',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    sourceJobId: {
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
      enum: ['active', 'expired', 'draft', 'archived'],
      default: 'active',
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB 2dsphere index for geospatial queries
jobSchema.index({ location: '2dsphere' });
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);

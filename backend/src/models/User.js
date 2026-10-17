const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password hash by default
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['candidate', 'admin', 'staff'],
      default: 'candidate',
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    currentRole: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: 'Job Seeker & Professional at GrabJob',
    },
    bio: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    connectionsCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    education: {
      type: String,
      default: '',
    },
    educationList: [
      {
        degree: { type: String, default: '' },
        institution: { type: String, default: '' },
        year: { type: String, default: '' },
        field: { type: String, default: '' },
      },
    ],
    experienceList: [
      {
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    preferredJobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Any'],
      default: 'Any',
    },
    preferredSalary: {
      type: String,
      default: '',
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  let score = 20; // email + name
  if (this.phone) score += 15;
  if (this.city) score += 10;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.currentRole) score += 10;
  if (this.education) score += 10;
  if (this.resumeUrl) score += 15;
  return Math.min(score, 100);
};

module.exports = mongoose.model('User', userSchema);

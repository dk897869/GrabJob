const mongoose = require('mongoose');

const interviewRequestSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'VERIFIED', 'SCHEDULED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    scheduledDetails: {
      company: String,
      position: String,
      date: Date,
      dateDisplay: String,
      time: String,
      mode: {
        type: String,
        enum: ['Online (Google Meet/Zoom)', 'In-Person Venue', 'Telephonic'],
        default: 'Online (Google Meet/Zoom)',
      },
      address: String,
      meetingLink: String,
      instructions: String,
    },
    notes: {
      type: String,
      default: '',
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('InterviewRequest', interviewRequestSchema);

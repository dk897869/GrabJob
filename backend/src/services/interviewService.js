const InterviewRequest = require('../models/InterviewRequest');
const Job = require('../models/Job');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { sendInterviewScheduledEmail } = require('./emailService');

const requestInterviewAssistance = async ({ candidateId, jobId, paymentId, notes = '' }) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error('Target job not found or no longer available.');
  }

  // Create or retrieve existing request
  let request = await InterviewRequest.findOne({ candidate: candidateId, job: jobId });
  if (request) {
    request.payment = paymentId;
    request.status = 'PAID';
    request.notes = notes || request.notes;
    await request.save();
    return request;
  }

  request = await InterviewRequest.create({
    candidate: candidateId,
    job: jobId,
    payment: paymentId,
    status: 'PAID',
    notes,
  });

  return request;
};

const scheduleInterviewByAdmin = async ({
  requestId,
  adminUser,
  company,
  position,
  date,
  dateDisplay,
  time,
  mode,
  address,
  meetingLink,
  instructions,
}) => {
  const request = await InterviewRequest.findById(requestId)
    .populate('candidate')
    .populate('job');

  if (!request) {
    throw new Error('Interview request not found');
  }

  request.status = 'SCHEDULED';
  request.handledBy = adminUser._id;
  request.scheduledDetails = {
    company: company || request.job?.company,
    position: position || request.job?.title,
    date: date ? new Date(date) : new Date(),
    dateDisplay: dateDisplay || (date ? new Date(date).toLocaleDateString('en-IN') : 'Upcoming'),
    time: time || '11:00 AM IST',
    mode: mode || 'Online (Google Meet/Zoom)',
    address: address || '',
    meetingLink: meetingLink || 'https://meet.google.com/tvh-fkug-taj',
    instructions: instructions || 'Please join 5 minutes early with updated resume and relevant work portfolio.',
  };

  await request.save();

  // Audit log
  await AuditLog.create({
    admin: adminUser._id,
    adminEmail: adminUser.email,
    action: 'INTERVIEW_SCHEDULED',
    targetModel: 'InterviewRequest',
    targetId: request._id.toString(),
    details: {
      candidate: request.candidate?.email,
      job: request.job?.title,
      scheduledDetails: request.scheduledDetails,
    },
  });

  // Dispatch email to candidate
  if (request.candidate?.email) {
    await sendInterviewScheduledEmail(request.candidate, request.job, request.scheduledDetails);
  }

  return request;
};

module.exports = {
  requestInterviewAssistance,
  scheduleInterviewByAdmin,
};

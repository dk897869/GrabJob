const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const env = require('../config/env');
const EmailLog = require('../models/EmailLog');

// Initialize Resend client if API key is provided
let resendClient = null;
if (env.RESEND_API_KEY) {
  try {
    resendClient = new Resend(env.RESEND_API_KEY);
    console.log('[Email Service] Resend client initialized successfully.');
  } catch (err) {
    console.error('[Email Service] Resend init failed:', err.message);
  }
}

// Configure SMTP transporter (Primary: Gmail direct delivery, Brevo fallback)
let transporter = null;
if (env.SMTP_USER && env.SMTP_PASS) {
  const isGmail = env.SMTP_HOST?.includes('gmail') || env.SMTP_USER?.includes('gmail');
  transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: 'gmail',
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        }
  );
  console.log(`[Email Service] SMTP transporter configured for: ${env.SMTP_USER}`);
}

/**
 * Generate branded GrabJob HTML layout
 */
const wrapEmailTemplate = (title, contentHtml) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
      .header { background: #2563eb; padding: 28px 24px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
      .header p { color: #bfdbfe; margin: 6px 0 0; font-size: 13px; font-weight: 500; }
      .content { padding: 32px 24px; line-height: 1.7; font-size: 15px; color: #334155; }
      .button { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
      .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
      .footer p { margin: 4px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>GrabJob</h1>
        <p>India's Trusted Career & Job Discovery Platform</p>
      </div>
      <div class="content">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">${title}</h2>
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} GrabJob India. All rights reserved.</p>
        <p>This is an automated system notification. If you did not initiate this request, please contact support.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const mongoose = require('mongoose');

const safeLog = async (logData) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await EmailLog.create(logData);
    }
  } catch (err) {
    console.warn('[Email Log Warn]:', err.message);
  }
};

/**
 * Universal send email method supporting Resend with SMTP and simulated fallbacks
 */
const sendEmail = async ({ to, subject, template = 'general', html, attachments = [] }) => {
  const targetEmail = to;

  // 1. Try Primary SMTP Transporter (Gmail App Password - Direct Delivery to Any Email)
  if (transporter) {
    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: targetEmail,
        subject,
        html,
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Gmail/SMTP Sent Directly]: Message ID: ${info.messageId} to ${targetEmail}`);

      await safeLog({
        to: targetEmail,
        subject,
        template,
        status: 'SENT',
        metadata: { messageId: info.messageId, provider: 'smtp-gmail' },
      });

      return { success: true, messageId: info.messageId, provider: 'smtp-gmail' };
    } catch (smtpErr) {
      console.error(`[SMTP Error]: ${smtpErr.message} - falling back to Resend`);
    }
  }

  // 2. Try Resend Official API
  if (resendClient) {
    try {
      const formattedAttachments = attachments.map((att) => {
        if (att.content && Buffer.isBuffer(att.content)) {
          return {
            filename: att.filename,
            content: att.content.toString('base64'),
          };
        }
        return att;
      });

      const { data, error } = await resendClient.emails.send({
        from: env.RESEND_FROM || 'onboarding@resend.dev',
        to: Array.isArray(targetEmail) ? targetEmail : [targetEmail],
        subject,
        html,
        attachments: formattedAttachments.length > 0 ? formattedAttachments : undefined,
      });

      if (error) {
        console.warn(`[Resend API Warning]: ${error.message} - checking fallback`);
        // If Resend fails due to unverified domain to someone else, retry sending to owner's test email
        if (error.message && error.message.includes('can only send testing emails to your own email address') && env.ADMIN_NOTIFICATION_EMAIL) {
          const retryRes = await resendClient.emails.send({
            from: env.RESEND_FROM || 'onboarding@resend.dev',
            to: [env.ADMIN_NOTIFICATION_EMAIL],
            subject: `[Dev Forward: ${targetEmail}] ${subject}`,
            html: `<div style="background:#fef3c7;padding:10px;border-radius:6px;margin-bottom:15px;font-size:12px;color:#92400e;"><strong>Resend Test Mode:</strong> Originally intended for <em>${targetEmail}</em></div>` + html,
          });
          if (!retryRes.error) {
            console.log(`[Resend Sent to Admin Test Email]: ID ${retryRes.data?.id}`);
            await safeLog({
              to: targetEmail,
              subject,
              template,
              status: 'SENT',
              metadata: { messageId: retryRes.data?.id, provider: 'resend-admin-redirect' },
            });
            return { success: true, messageId: retryRes.data?.id, provider: 'resend' };
          }
        }
        throw new Error(error.message);
      }

      console.log(`[Resend Sent Successfully]: ID ${data?.id} to ${targetEmail}`);
      await safeLog({
        to: targetEmail,
        subject,
        template,
        status: 'SENT',
        metadata: { messageId: data?.id, provider: 'resend' },
      });

      return { success: true, messageId: data?.id, provider: 'resend' };
    } catch (resendErr) {
      console.error(`[Resend Error]: ${resendErr.message}`);
    }
  }

  // 3. Fallback: Simulation mode in DB
  console.log(`[Email Service - Simulated] To: ${targetEmail} | Subject: ${subject} | Template: ${template}`);
  await safeLog({
    to: targetEmail,
    subject,
    template,
    status: 'SIMULATED',
    metadata: { note: 'Live email provider unavailable, logged to DB' },
  });

  return { success: true, simulated: true };
};

// Email templates
const sendWelcomeEmail = async (user) => {
  const content = `
    <p>Namaste <strong>${user.name}</strong>,</p>
    <p style="font-size: 16px; color: #16a34a; font-weight: 700;">
      Aapne GrabJob platform pe successfully register kar liya hai!
    </p>
    <p>Aapka candidate account ab active hai. GrabJob ke sath aap India bhar ke verified jobs, live walk-in drives, aur accessible career tools ka fayda utha sakte hain:</p>
    
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 18px 0;">
      <ul style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.8;">
        <li><strong>Verified Jobs:</strong> Direct employer feeds across Tier 1, 2, and 3 cities.</li>
        <li><strong>Live Walk-ins:</strong> Nearby physical hiring drives with verified venue addresses.</li>
        <li><strong>ATS Resume Builder (₹50):</strong> AI keyword match and instant PDF download.</li>
        <li><strong>Mock Interview Practice (₹100):</strong> 1-on-1 session with Google Meet link.</li>
      </ul>
    </div>

    <p>Apna complete profile (experience, education, profile pic) update karein taki hiring recruiters aapko aasani se discover kar sakein.</p>
    <div style="margin: 24px 0;">
      <a class="button" href="${env.CLIENT_URL}/profile/edit">Complete Your Profile</a>
      <a class="button" style="background-color: #0f172a; margin-left: 10px;" href="${env.CLIENT_URL}/jobs">Explore Jobs</a>
    </div>
  `;
  return sendEmail({
    to: user.email,
    subject: 'Welcome to GrabJob India - Registration Successful!',
    template: 'welcome',
    html: wrapEmailTemplate('Registration Successful!', content),
  });
};

const sendJobApplicationEmail = async (user, job) => {
  const content = `
    <p>Namaste <strong>${user.name}</strong>,</p>
    <p>Aapki job application successfully submit ho gayi hai!</p>
    
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 18px 0;">
      <h3 style="margin-top: 0; color: #2563eb; font-size: 16px;">Application Details:</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Position:</strong></td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${job.title}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Company:</strong></td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${job.company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Location:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${job.city}${job.state ? ', ' + job.state : ''}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Applied On:</strong></td>
          <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        </tr>
      </table>
    </div>

    <p>Recruiter aapke resume ka review karenge. Aap apni application status apne GrabJob dashboard par track kar sakte hain.</p>
    <div style="margin: 20px 0;">
      <a class="button" href="${env.CLIENT_URL}/applications">Track Application Status</a>
    </div>
  `;
  return sendEmail({
    to: user.email,
    subject: `Application Submitted: ${job.title} at ${job.company}`,
    template: 'job_application',
    html: wrapEmailTemplate('Application Submitted', content),
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;
  const content = `
    <p>Hello ${user.name},</p>
    <p>You requested a password reset for your GrabJob account. Click the button below to set a new password:</p>
    <a class="button" href="${resetUrl}">Reset My Password</a>
    <p>This link is valid for 1 hour. If you did not request this, you can safely ignore this email.</p>
  `;
  return sendEmail({
    to: user.email,
    subject: 'GrabJob - Password Reset Request',
    template: 'password_reset',
    html: wrapEmailTemplate('Reset Your Password', content),
  });
};

const sendPaymentConfirmation = async (user, payment) => {
  const serviceName =
    payment.serviceType === 'interview_assistance'
      ? 'Interview Assistance (₹100)'
      : 'ATS Resume Builder (₹50)';

  const content = `
    <p>Dear ${user.name},</p>
    <p>We have successfully received your payment of <strong>₹${payment.amount}</strong> for <strong>${serviceName}</strong>.</p>
    <p><strong>Order ID:</strong> ${payment.orderId}</p>
    <p><strong>Transaction Status:</strong> ${payment.status}</p>
    <p>Our team is processing your request. You can check the status on your dashboard at any time.</p>
    <a class="button" href="${env.CLIENT_URL}/dashboard">View Dashboard</a>
  `;
  return sendEmail({
    to: user.email,
    subject: `Payment Confirmed: ${serviceName}`,
    template: 'payment_confirmed',
    html: wrapEmailTemplate('Payment Confirmation', content),
  });
};

const sendInterviewScheduledEmail = async (candidate, job, scheduleDetails) => {
  const content = `
    <p>Dear ${candidate.name},</p>
    <p>Your interview for the position of <strong>${scheduleDetails.position || job.title}</strong> at <strong>${scheduleDetails.company || job.company}</strong> has been scheduled.</p>
    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Date:</strong> ${scheduleDetails.dateDisplay || new Date(scheduleDetails.date).toLocaleDateString('en-IN')}</p>
      <p style="margin: 4px 0;"><strong>Time:</strong> ${scheduleDetails.time}</p>
      <p style="margin: 4px 0;"><strong>Mode:</strong> ${scheduleDetails.mode}</p>
      <p style="margin: 4px 0;"><strong>Google Meet:</strong> <a href="${scheduleDetails.meetingLink || 'https://meet.google.com/tvh-fkug-taj'}" style="color: #2563eb; font-weight: 600;">${scheduleDetails.meetingLink || 'https://meet.google.com/tvh-fkug-taj'}</a></p>
      ${scheduleDetails.address ? `<p style="margin: 4px 0;"><strong>Venue:</strong> ${scheduleDetails.address}</p>` : ''}
      ${scheduleDetails.instructions ? `<p style="margin: 4px 0;"><strong>Instructions:</strong> ${scheduleDetails.instructions}</p>` : ''}
    </div>
    <div style="margin: 20px 0;">
      <a class="button" href="${scheduleDetails.meetingLink || 'https://meet.google.com/tvh-fkug-taj'}" target="_blank">Join Google Meet Now</a>
    </div>
    <p><em>GrabJob coordinates interview scheduling for eligible jobs. We wish you the best for your interview!</em></p>
  `;
  return sendEmail({
    to: candidate.email,
    subject: `Interview Scheduled: ${job?.company || 'GrabJob'} - ${job?.title || 'Candidate'}`,
    template: 'interview_scheduled',
    html: wrapEmailTemplate('Interview Confirmed', content),
  });
};

const sendMockInterviewConfirmationEmail = async ({
  candidateName = 'Candidate',
  candidateEmail,
  domain = 'IT',
  role = 'Software Engineer',
  date = 'Tomorrow',
  timeSlot = '11:00 AM - 11:45 AM',
  meetLink = 'https://meet.google.com/tvh-fkug-taj',
  bookingId,
  utrNumber,
}) => {
  const content = `
    <p>Namaste <strong>${candidateName}</strong>,</p>
    <p>Aapka <strong>GrabJob Mock Interview Practice Session (₹100)</strong> successfully schedule ho gaya hai!</p>
    
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2563eb; font-size: 17px; font-weight: 700;">Mock Interview Schedule Details:</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
        <tr>
          <td style="padding: 7px 0; color: #64748b; width: 140px;"><strong>Session:</strong></td>
          <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">1-on-1 Practice Mock Interview</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #64748b;"><strong>Domain & Role:</strong></td>
          <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">${domain} — ${role}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #64748b;"><strong>Date:</strong></td>
          <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #64748b;"><strong>Interview Time:</strong></td>
          <td style="padding: 7px 0; color: #16a34a; font-weight: 800; font-size: 16px;">${timeSlot}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #64748b;"><strong>Booking ID:</strong></td>
          <td style="padding: 7px 0; color: #0f172a; font-family: monospace; font-weight: 600;">${bookingId || 'GJ-PRAC-' + Date.now().toString().slice(-6)}</td>
        </tr>
        ${utrNumber ? `
        <tr>
          <td style="padding: 7px 0; color: #64748b;"><strong>Payment Reference:</strong></td>
          <td style="padding: 7px 0; color: #0f172a;">${utrNumber}</td>
        </tr>` : ''}
      </table>

      <div style="margin-top: 22px; padding-top: 18px; border-top: 1px dashed #cbd5e1; text-align: center;">
        <p style="margin: 0 0 12px; font-weight: 700; color: #0f172a; font-size: 15px;">Google Meet Joining Link:</p>
        <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
          Join Google Meet Now
        </a>
        <p style="margin: 12px 0 0; font-size: 13px; color: #64748b;">
          Direct Link: <a href="${meetLink}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: underline;">${meetLink}</a>
        </p>
      </div>
    </div>

    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h4 style="margin: 0 0 8px; color: #1e40af; font-size: 14px; font-weight: 700;">Important Guidelines:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.7;">
        <li>Session start hone se <strong>5 minute pehle</strong> Google Meet link open karein.</li>
        <li>Apna microphone aur camera check kar lein.</li>
        <li>Apna updated CV/resume screen share karne ke liye ready rakhein.</li>
        <li>Interview ke baad mentor aapko domain-specific feedback aur improvement tips share karenge.</li>
      </ul>
    </div>

    <p style="font-size: 13px; color: #64748b;">Koi help chahiye to reply to this email or connect on GrabJob platform support.</p>
  `;

  return sendEmail({
    to: candidateEmail,
    subject: `Mock Interview Scheduled (${date} at ${timeSlot}) - Google Meet Link Inside`,
    template: 'mock_interview_confirmation',
    html: wrapEmailTemplate('Mock Interview Confirmed', content),
  });
};

const sendResumeDeliveryEmail = async (user, resume, attachments = []) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>Your ATS-friendly resume is ready! Our AI engine has optimized your formatting and keywords based on your target role.</p>
    <p>We have attached your generated resume in PDF/Word format with this email.</p>
    <a class="button" href="${env.CLIENT_URL}/resume-builder/result?id=${resume._id}">View & Download on GrabJob</a>
  `;
  return sendEmail({
    to: user.email,
    subject: 'Your ATS-Friendly Resume from GrabJob',
    template: 'resume_delivery',
    html: wrapEmailTemplate('Your ATS Resume Is Ready', content),
    attachments,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendJobApplicationEmail,
  sendPasswordResetEmail,
  sendPaymentConfirmation,
  sendInterviewScheduledEmail,
  sendMockInterviewConfirmationEmail,
  sendResumeDeliveryEmail,
};

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://traj37753_db_user:pUyEC9hcR1GrNXZU@cluster0.ambv7vo.mongodb.net/grabjob?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'grabjob_super_secure_jwt_secret_2025_ind!',
  CLIENT_URL: process.env.CLIENT_URL || 'https://grabjob.onrender.com',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'https://grabjob.onrender.com/api/auth/google/callback',

  // Resend API
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM: process.env.RESEND_FROM || 'onboarding@resend.dev',
  ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || 'dk9974796@gmail.com',

  // SMTP / Brevo Fallback
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '"GrabJob India" <support@grabjob.in>',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ''
};

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const freelanceRoutes = require('./routes/freelanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const syncRoutes = require('./routes/syncRoutes');

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - Support Localhost, Custom Domain, Vercel & Netlify
const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.includes('grabjob')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for production deployment
      }
    },
    credentials: true,
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root endpoint & Render health ping
app.all('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GrabJob API Server is live and healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GrabJob API is running',
  });
});

// Favicon handler to avoid 404 logs on cloud platforms
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/freelance', freelanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sync', syncRoutes);

// 404 and Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

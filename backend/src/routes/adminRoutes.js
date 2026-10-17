const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  createJob,
  updateJob,
  deleteJob,
  getPayments,
  verifyPaymentUtr,
  getInterviews,
  scheduleInterview,
  getResumeOrders,
  verifyResumePayment,
  getJobSources,
  createJobSource,
  getEmailLogs,
  getAuditLogs,
} = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin, requireStaffOrAdmin } = require('../middleware/adminMiddleware');

// Protect all admin routes with authentication + role check
router.use(requireAuth);
router.use(requireStaffOrAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/role', requireAdmin, updateUserRole);

// Job Management
router.post('/jobs', createJob);
router.patch('/jobs/:id', updateJob);
router.delete('/jobs/:id', requireAdmin, deleteJob);

// Payments & UTR verification
router.get('/payments', getPayments);
router.patch('/payments/:id/verify', verifyPaymentUtr);
router.patch('/payments/:id/reject', verifyPaymentUtr);

// Interview Requests
router.get('/interviews', getInterviews);
router.post('/interviews/:id/schedule', scheduleInterview);

// Resumes
router.get('/resumes', getResumeOrders);
router.patch('/resumes/:id/verify-payment', verifyResumePayment);

// Job Sources
router.get('/job-sources', getJobSources);
router.post('/job-sources', requireAdmin, createJobSource);

// Logs
router.get('/email-logs', getEmailLogs);
router.get('/audit-logs', getAuditLogs);

module.exports = router;

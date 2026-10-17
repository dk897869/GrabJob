const express = require('express');
const router = express.Router();
const {
  uploadResume,
  matchResumeWithJd,
  submitManualResumePayment,
  generateResume,
  getMyResumes,
  getResumeById,
} = require('../controllers/resumeController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { uploadResume: uploadMiddleware } = require('../middleware/uploadMiddleware');

router.post('/upload', optionalAuth, uploadMiddleware.single('resume'), uploadResume);
router.post('/match-jd', optionalAuth, matchResumeWithJd);
router.post('/submit-manual-payment', requireAuth, uploadMiddleware.single('screenshot'), submitManualResumePayment);
router.post('/generate', requireAuth, generateResume);
router.get('/my', requireAuth, getMyResumes);
router.get('/:id', optionalAuth, getResumeById);

module.exports = router;

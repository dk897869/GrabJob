const express = require('express');
const router = express.Router();
const {
  requestInterview,
  getMyInterviews,
  getInterviewById,
  schedulePracticeInterview,
  getDomainQuestions,
} = require('../controllers/interviewController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

router.get('/questions', getDomainQuestions);
router.post('/schedule-practice', optionalAuth, schedulePracticeInterview);

router.use(requireAuth);

router.post('/request', requestInterview);
router.get('/my', getMyInterviews);
router.get('/:id', getInterviewById);

module.exports = router;


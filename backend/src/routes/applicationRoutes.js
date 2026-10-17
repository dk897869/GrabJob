const express = require('express');
const router = express.Router();
const { getMyApplications, getApplicationById } = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/my', getMyApplications);
router.get('/:id', getApplicationById);

module.exports = router;

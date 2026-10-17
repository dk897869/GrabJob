const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getNearbyJobs,
  getWalkinJobs,
  applyToJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require('../controllers/jobController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getJobs);
router.get('/nearby', getNearbyJobs);
router.get('/walkin', getWalkinJobs);
router.get('/saved', requireAuth, getSavedJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/:id/apply', requireAuth, applyToJob);
router.post('/:id/save', requireAuth, saveJob);
router.delete('/:id/save', requireAuth, unsaveJob);

module.exports = router;

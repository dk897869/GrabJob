const express = require('express');
const router = express.Router();
const { getSyncStatus, syncAllJobFeeds } = require('../services/cronSyncService');

// GET sync status
router.get('/status', (req, res) => {
  return res.status(200).json({
    success: true,
    data: getSyncStatus(),
  });
});

// POST trigger manual sync immediately
router.post('/trigger', async (req, res, next) => {
  try {
    const stats = await syncAllJobFeeds();
    return res.status(200).json({
      success: true,
      message: 'Job feeds synchronization completed successfully.',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

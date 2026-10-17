const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  blockUser,
  unblockUser,
  getMyConnections,
  getPendingRequests,
  getSuggestedConnections,
  getConnectionStatusWithUser,
} = require('../controllers/connectionController');

// All connection routes require authentication
router.use(requireAuth);

router.get('/', getMyConnections);
router.get('/pending', getPendingRequests);
router.get('/suggestions', getSuggestedConnections);
router.get('/status/:userId', getConnectionStatusWithUser);
router.post('/request/:recipientId', sendConnectionRequest);
router.post('/accept/:connectionId', acceptConnectionRequest);
router.post('/decline/:connectionId', declineConnectionRequest);
router.delete('/:connectionId', removeConnection);
router.post('/block/:userId', blockUser);
router.post('/unblock/:userId', unblockUser);

module.exports = router;

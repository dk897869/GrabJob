const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadChatFile } = require('../middleware/uploadMiddleware');
const {
  getConversations,
  getMessages,
  sendMessage,
  uploadAttachment,
  getOrCreateConversation,
} = require('../controllers/directChatController');

// All direct messaging routes require authentication
router.use(requireAuth);

router.get('/conversations', getConversations);
router.get('/conversations/user/:targetUserId', getOrCreateConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/send', sendMessage);
router.post('/upload', uploadChatFile.single('file'), uploadAttachment);

module.exports = router;

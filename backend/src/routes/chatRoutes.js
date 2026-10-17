const express = require('express');
const router = express.Router();
const { handleChat, getSuggestedPrompts } = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, handleChat);
router.get('/prompts', getSuggestedPrompts);

module.exports = router;

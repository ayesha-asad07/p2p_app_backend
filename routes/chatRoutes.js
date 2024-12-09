const express = require('express');
const { sendMessage, getMessages, deleteMessage } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Send a message
router.post('/send', authMiddleware, sendMessage);

// Get messages for a conversation
router.get('/:peerId', authMiddleware, getMessages);

// Delete a message
router.delete('/:messageId', authMiddleware, deleteMessage);

module.exports = router;

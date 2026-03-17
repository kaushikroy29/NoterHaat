const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name avatar')
    .populate('listingId', 'serialNumber denomination images')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('senderId', 'name avatar')
      .populate('offerId')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Send a message
// @route   POST /api/messages/:conversationId
// @access  Private
router.post('/:conversationId', protect, async (req, res) => {
  try {
    const { text, messageType, offerId } = req.body;

    const newMessage = new Message({
      conversationId: req.params.conversationId,
      senderId: req.user.id,
      text,
      messageType: messageType || 'text',
      offerId
    });

    const savedMessage = await newMessage.save();

    // Update conversation lastMessage top-level reference
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: savedMessage._id
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

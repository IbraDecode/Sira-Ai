const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../utils/auth');

// Di Buat Oleh Ibra Decode

const router = express.Router();

// Send message
router.post('/send', auth, async (req, res) => {
  try {
    const { receiver, content, type } = req.body;
    const message = new Message({ sender: req.user.id, receiver, content, type });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages
router.get('/messages/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pin chat
router.post('/pin/:userId', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { pinnedChats: req.params.userId } });
    res.json({ message: 'Chat pinned' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Archive chat
router.post('/archive/:userId', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { archivedChats: req.params.userId } });
    res.json({ message: 'Chat archived' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
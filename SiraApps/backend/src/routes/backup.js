const express = require('express');
const Message = require('../models/Message');
const auth = require('../utils/auth');

// Di Buat Oleh Ibra Decode

const router = express.Router();

// Backup messages
router.get('/backup', auth, async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] });
    res.json({ backup: messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore messages
router.post('/restore', auth, async (req, res) => {
  try {
    const { backup } = req.body;
    await Message.insertMany(backup);
    res.json({ message: 'Restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
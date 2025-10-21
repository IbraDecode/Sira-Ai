const express = require('express');
const Status = require('../models/Status');
const auth = require('../utils/auth');

// Di Buat Oleh Ibra Decode

const router = express.Router();

// Post status
router.post('/post', auth, async (req, res) => {
  try {
    const { content, type, mediaUrl } = req.body;
    const status = new Status({ user: req.user.id, content, type, mediaUrl });
    await status.save();
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statuses
router.get('/', auth, async (req, res) => {
  try {
    const statuses = await Status.find({ expiresAt: { $gt: new Date() } }).populate('user');
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
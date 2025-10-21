const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const User = require('../models/User');

// Di Buat Oleh Ibra Decode

const router = express.Router();
// OTP via Firebase, skip Twilio

// Send OTP (via Firebase, backend skip)
router.post('/send-otp', (req, res) => {
  res.json({ message: 'OTP handled by Firebase' });
});

// Register (OTP via Firebase)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, name, phone });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
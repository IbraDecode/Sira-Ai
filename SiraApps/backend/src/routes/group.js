const express = require('express');
const Group = require('../models/Group');
const auth = require('../utils/auth');

// Di Buat Oleh Ibra Decode

const router = express.Router();

// Create group
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = new Group({ name, description, admin: req.user.id, members: [{ user: req.user.id, role: 'admin' }] });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join group
router.post('/join/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group.members.some(m => m.user.toString() === req.user.id)) {
      group.members.push({ user: req.user.id });
      await group.save();
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user.id });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
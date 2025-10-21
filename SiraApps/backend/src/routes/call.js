const express = require('express');
const auth = require('../utils/auth');

// Di Buat Oleh Ibra Decode

const router = express.Router();

// Signaling for WebRTC
let offers = {};

router.post('/offer', auth, (req, res) => {
  const { to, offer } = req.body;
  offers[to] = { from: req.user.id, offer };
  res.json({ message: 'Offer sent' });
});

router.get('/offer/:to', auth, (req, res) => {
  const offer = offers[req.params.to];
  if (offer) res.json(offer);
  else res.status(404).json({ error: 'No offer' });
});

module.exports = router;
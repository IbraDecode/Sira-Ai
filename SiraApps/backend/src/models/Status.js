const mongoose = require('mongoose');

// Di Buat Oleh Ibra Decode

const statusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String }, // Text or media URL
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  mediaUrl: { type: String },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24h
  views: [{ user: mongoose.Schema.Types.ObjectId, viewedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Status', statusSchema);
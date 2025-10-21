const mongoose = require('mongoose');

// Di Buat Oleh Ibra Decode

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For 1-on-1
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // For group
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'audio', 'file', 'emoji'], default: 'text' },
  mediaUrl: { type: String },
  reactions: [{ user: mongoose.Schema.Types.ObjectId, emoji: String }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  forwarded: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  readBy: [{ user: mongoose.Schema.Types.ObjectId, readAt: Date }],
  deliveredAt: { type: Date },
  sentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } // For temporary messages
});

module.exports = mongoose.model('Message', messageSchema);
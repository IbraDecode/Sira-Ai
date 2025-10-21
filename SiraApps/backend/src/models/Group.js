const mongoose = require('mongoose');

// Di Buat Oleh Ibra Decode

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ user: mongoose.Schema.Types.ObjectId, role: { type: String, enum: ['admin', 'member'], default: 'member' }, joinedAt: Date }],
  permissions: {
    sendMessages: { type: Boolean, default: true },
    addMembers: { type: Boolean, default: true },
    changeSettings: { type: Boolean, default: false }
  },
  isPrivate: { type: Boolean, default: false },
  inviteLink: { type: String },
  pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);
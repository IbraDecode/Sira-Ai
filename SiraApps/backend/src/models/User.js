const mongoose = require('mongoose');

// Di Buat Oleh Ibra Decode

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  status: { type: String, default: 'Available' },
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  twoFA: { type: Boolean, default: false },
  linkedAccounts: [{ provider: String, id: String }],
  deviceTokens: [{ type: String }],
  pinnedChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  archivedChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
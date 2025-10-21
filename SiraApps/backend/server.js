require('dotenv').config();
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketService = require('./src/services/socket');
const authRoutes = require('./src/routes/auth');
const chatRoutes = require('./src/routes/chat');
const mediaRoutes = require('./src/routes/media');
const callRoutes = require('./src/routes/call');
const groupRoutes = require('./src/routes/group');
const statusRoutes = require('./src/routes/status');
const backupRoutes = require('./src/routes/backup');

// Di Buat Oleh Ibra Decode

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/siraapps', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/media', mediaRoutes);
app.use('/call', callRoutes);
app.use('/group', groupRoutes);
app.use('/status', statusRoutes);
app.use('/backup', backupRoutes);

// Initialize Socket.IO
socketService(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`SiraApps backend running on port ${PORT}`);
});
const io = require('socket.io');

// Di Buat Oleh Ibra Decode

module.exports = (server) => {
  const socketIo = io(server);

  socketIo.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('sendMessage', (data) => {
      // Encrypt message if needed
      console.log('Message received:', data);
      // Broadcast to all clients
      socketIo.emit('newMessage', data);
    });

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return socketIo;
};
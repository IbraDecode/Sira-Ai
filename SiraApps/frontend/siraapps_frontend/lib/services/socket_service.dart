import 'package:socket_io_client/socket_io_client.dart' as IO;

// Di Buat Oleh Ibra Decode

class SocketService {
  late IO.Socket socket;

  void connect() {
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    socket.connect();
    socket.on('connect', (_) => print('Connected'));
    socket.on('newMessage', (data) => print('New message: $data'));
  }

  void sendMessage(String message) {
    socket.emit('sendMessage', message);
  }

  void disconnect() {
    socket.disconnect();
  }
}
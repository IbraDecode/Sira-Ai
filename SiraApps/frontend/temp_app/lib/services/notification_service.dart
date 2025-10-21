import 'package:firebase_messaging/firebase_messaging.dart';

// Di Buat Oleh Ibra Decode

class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  static Future<void> initialize() async {
    await _firebaseMessaging.requestPermission();
    String? token = await _firebaseMessaging.getToken();
    print('FCM Token: $token'); // Kirim ke backend

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');
    });
  }
}
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/call_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/group_screen.dart';
import 'screens/status_screen.dart';
import 'screens/home_screen.dart';
import 'services/notification_service.dart';
import 'providers/theme_provider.dart';
import 'firebase_options.dart';

// Di Buat Oleh Ibra Decode

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await NotificationService.initialize();
  runApp(
    ChangeNotifierProvider(
      create: (context) => ThemeProvider(),
      child: const SiraApps(),
    ),
  );
}

class SiraApps extends StatelessWidget {
  const SiraApps({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SiraApps',
      theme: Provider.of<ThemeProvider>(context).themeData,
      home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return CircularProgressIndicator();
          } else if (snapshot.hasData) {
            return HomeScreen();
          } else {
            return LoginScreen();
          }
        },
      ),
      routes: {
        '/home': (context) => HomeScreen(),
        '/chat': (context) => ChatScreen(),
        '/call': (context) => CallScreen(),
        '/settings': (context) => SettingsScreen(),
        '/groups': (context) => GroupScreen(),
        '/status': (context) => StatusScreen(),
      },
    );
  }
}
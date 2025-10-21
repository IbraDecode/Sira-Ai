import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCGPABkYNUN7y8cN3ieCYKQ-zkHvTx4ALY',
    appId: '1:880543676469:web:placeholder', // Placeholder for web
    messagingSenderId: '880543676469',
    projectId: 'sira-apps-0708',
    authDomain: 'sira-apps-0708.firebaseapp.com',
    storageBucket: 'sira-apps-0708.firebasestorage.app',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCGPABkYNUN7y8cN3ieCYKQ-zkHvTx4ALY',
    appId: '1:880543676469:android:c17cae8424384094a9d97c',
    messagingSenderId: '880543676469',
    projectId: 'sira-apps-0708',
    storageBucket: 'sira-apps-0708.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyCGPABkYNUN7y8cN3ieCYKQ-zkHvTx4ALY',
    appId: '1:880543676469:ios:c17cae8424384094a9d97c', // Placeholder
    messagingSenderId: '880543676469',
    projectId: 'sira-apps-0708',
    storageBucket: 'sira-apps-0708.firebasestorage.app',
  );
}
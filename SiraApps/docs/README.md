# SiraApps

Aplikasi chat mobile dengan >500 fitur, mirip WhatsApp + Telegram. Frontend Flutter, backend Node.js/Socket.IO.

## Fitur Utama
- Autentikasi (register/login, OTP, 2FA)
- Chat 1-on-1 & grup dengan emoji iOS lengkap
- Media sharing, voice/video call
- Keamanan E2E encryption
- UI/UX premium

## Setup
### Backend
1. Install Node.js, MongoDB.
2. cd backend && npm install
3. npm start

### Frontend
1. Install Flutter.
2. cd frontend/siraapps_frontend && flutter pub get
3. flutter run

## Deploy
### Backend to Heroku
1. heroku create siraapps-backend
2. heroku config:set MONGO_URI=your_mongo_uri JWT_SECRET=IBRADECODE070811 FIREBASE_PROJECT_ID=sira-apps-0708 FIREBASE_API_KEY=AIzaSyCGPABkYNUN7y8cN3ieCYKQ-zkHvTx4ALY
3. git add . && git commit -m "Deploy"
4. npm run deploy

### Frontend to Play Store
1. flutter pub get
2. flutter build apk --release --split-per-abi
3. Sign APK dengan key: keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
4. jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key.jks build/app/outputs/flutter-apk/app-release.apk key
5. zipalign -v 4 build/app/outputs/flutter-apk/app-release.apk app-release-signed.apk
6. Upload app-release-signed.apk ke Google Play Console

### Test E2E
- Run backend: npm start
- Run frontend: flutter run
- Test auth: Login dengan HP, OTP Firebase
- Test chat: Kirim pesan, Socket.IO real-time
- Test media: Upload file
- Test call: WebRTC video

## API Keys
Butuh: MongoDB URI, JWT secret, Firebase key, Twilio SID, dll. Kasih tau jika perlu data.

Di Buat Oleh Ibra Decode
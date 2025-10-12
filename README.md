# SIRA AI - Multi-Agent Chat System

**By Ibra Decode**

Platform AI chat workspace yang powerful dan modular, menggabungkan kemampuan ChatGPT, Perplexity, dan Notion AI dengan Gemini API dan Firebase.

## 🚀 Features

### MVP (Completed)
✅ **Firebase Authentication** - Email, Google, dan GitHub OAuth  
✅ **Dual Firebase Projects** - Project A (Auth/Firestore) + Project B (Storage)  
✅ **Gemini AI Integration** - Support Gemini 2.0 & 2.5 Flash  
✅ **Multi-Workspace System** - Create, rename, delete, switch workspaces  
✅ **Real-time Chat** - Firestore sync untuk messaging  
✅ **Model Switching** - Toggle antara Gemini models  
✅ **Custom Personalities** - 4 personality presets (Default, Creative, Code Expert, Tutor)  
✅ **Markdown Rendering** - Syntax highlighting untuk code blocks  
✅ **File Upload** - Support PDF, DOCX, TXT, CSV, JSON, Images  
✅ **Plugin System** - Web Search, Document Summary, Code Execution  
✅ **Dark Theme UI** - Responsive design dengan Tailwind CSS  

### Coming Soon
🔜 Advanced memory system  
🔜 Plugin SDK untuk custom plugins  
🔜 Multi-agent mention system (@Sira, @Code, @Tutor)  
🔜 Public workspace sharing  
🔜 Usage dashboard  
🔜 Admin panel  
🔜 Voice mode  

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (2.0 Flash, 2.5 Flash)
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore (Project A)
- **Storage**: Firebase Storage (Project B)
- **File Parsing**: pdf-parse, mammoth
- **Markdown**: react-markdown, react-syntax-highlighter

## 🔧 Setup Instructions

### 1. Clone dan Install Dependencies

```bash
npm install
```

### 2. Setup Firebase Projects

Anda perlu membuat **2 Firebase Projects**:

#### **Project A** (Auth + Firestore)
1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication**:
   - Email/Password
   - Google OAuth
   - GitHub OAuth (optional)
3. Create **Firestore Database** (Start in production mode)
4. Copy config dari Project Settings → General

#### **Project B** (Storage)
1. Buat project baru lagi
2. Enable **Storage**
3. Copy config dari Project Settings → General

### 3. Setup Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Isi dengan credentials Firebase Anda:

```env
# Firebase Project A (Auth + Firestore)
NEXT_PUBLIC_FIREBASE_A_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_A_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_A_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_A_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_A_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_A_APP_ID=your_app_id

# Firebase Project B (Storage)
NEXT_PUBLIC_FIREBASE_B_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_B_AUTH_DOMAIN=your_project_b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_B_PROJECT_ID=your_project_b_id
NEXT_PUBLIC_FIREBASE_B_STORAGE_BUCKET=your_project_b.appspot.com
NEXT_PUBLIC_FIREBASE_B_MESSAGING_SENDER_ID=your_sender_id_b
NEXT_PUBLIC_FIREBASE_B_APP_ID=your_app_id_b

# Firebase Admin (Project A)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project_id.iam.gserviceaccount.com

# Gemini API (Server-side only - DO NOT expose to client)
GEMINI_API_KEY=your_gemini_api_key

# Encryption (generate random string)
ENCRYPTION_KEY=your-secure-random-key-here-min-32-chars

# Optional: Serper API for Web Search
SERPER_API_KEY=your_serper_key
```

### 4. Get Gemini API Key

1. Pergi ke [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy API key ke `.env`

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── auth/          # Auth endpoints
│   │   ├── chat/          # Chat & file parsing endpoints
│   │   └── user/          # User management
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── register/      # Register page
│   ├── dashboard/         # Main workspace
│   └── page.tsx           # Landing page
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── WorkspaceSettings.tsx
│   │   └── FileUpload.tsx
│   └── workspace/
│       └── WorkspaceSidebar.tsx
├── lib/
│   ├── firebase/
│   │   ├── client.ts      # Firebase client config
│   │   ├── admin.ts       # Firebase Admin SDK
│   │   └── config.ts
│   ├── gemini/
│   │   └── client.ts      # Gemini API client
│   ├── encryption.ts      # API key encryption
│   ├── file-parser.ts     # File parsing utilities
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts           # TypeScript types
└── public/
```

## 🔐 Security

### Implemented Security Features
✅ **Firebase ID Token Verification** - Semua API routes memverifikasi token authentication  
✅ **Session Cookie Management** - Secure httpOnly cookies dengan Firebase Admin SDK  
✅ **Workspace Ownership Check** - User hanya bisa access workspace milik sendiri  
✅ **API Key Encryption** - User's custom API keys disimpan dengan AES-256-GCM encryption  
✅ **Server-side Only Gemini Key** - Gemini API key tidak exposed ke client  
✅ **SSRF Protection** - File parsing dibatasi ke Firebase Storage URLs saja  
✅ **Bearer Token Auth** - Semua API calls menggunakan Authorization header  

### Required Security Setup
- Configure Firebase Security Rules di Firebase Console (lihat contoh di bawah)
- Set ENCRYPTION_KEY di environment variables (min 32 characters random string)
- Keep Firebase Admin private key secure (never commit to git)
- Use HTTPS untuk production deployment

## 🚢 Deployment

### Deploy ke Vercel

```bash
npm run build
```

Push ke GitHub dan connect dengan Vercel. Jangan lupa set environment variables di Vercel dashboard.

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📖 Usage

### 1. Register / Login
- Buat akun dengan email atau OAuth (Google/GitHub)

### 2. Create Workspace
- Click "Workspace Baru" di sidebar
- Rename sesuai kebutuhan

### 3. Chat dengan AI
- Ketik pesan di chat box
- Click settings icon untuk ubah model & personality
- Gunakan paperclip icon untuk upload file

### 4. Switch Models
- Buka settings
- Pilih antara Gemini 2.0 atau 2.5 Flash
- Pilih personality: Default, Creative, Code Expert, atau Tutor

### 5. Enable Plugins
- Buka settings
- Toggle plugins: Web Search, Document Summary, Code Execution

## 🐛 Troubleshooting

**Server tidak start:**
```bash
rm -rf .next
npm install
npm run dev
```

**Firebase error:**
- Pastikan kedua Firebase projects sudah dikonfigurasi
- Check apakah API keys valid di `.env`
- Verify authentication methods enabled di Firebase Console

**Gemini API error:**
- Pastikan API key valid
- Check quota di Google AI Studio
- Pastikan model name benar: `gemini-2.0-flash-exp` atau `gemini-2.5-flash`

## 📝 License

ISC License - Free to use

## 👨‍💻 Author

**Ibra Decode**

---

**SIRA AI** - The Next-Gen Full Stack AI Workspace System

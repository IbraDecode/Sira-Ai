# SIRA AI - Multi-Agent Chat System

**By Ibra Decode**

## Overview
SIRA AI adalah platform AI chat workspace yang powerful dan modular, menggabungkan kemampuan ChatGPT, Perplexity, dan Notion AI dalam satu sistem terpadu.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **AI**: Google Gemini API (2.0 Flash, 2.5 Flash)
- **Database**: Firebase Project A (Auth + Firestore)
- **Storage**: Firebase Project B (File Storage)
- **Language**: TypeScript

## Project Structure
```
/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat endpoints
│   │   └── user/          # User management
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main chat workspace
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/              # Chat components
│   ├── workspace/         # Workspace components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── firebase/          # Firebase configuration
│   ├── gemini/            # Gemini API client
│   ├── utils.ts
│   ├── encryption.ts
│   └── constants.ts
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/                # Static assets
```

## Features (MVP)
✅ Firebase Authentication (Email, Google, GitHub OAuth)
✅ Dual Firebase Projects (A: Auth/Firestore, B: Storage)
✅ Gemini 2.0 & 2.5 Flash integration
✅ Multi-workspace system
✅ Real-time chat with Firestore sync
✅ Model switching UI
✅ Custom personality profiles
✅ Markdown rendering with syntax highlighting
✅ Responsive dark theme UI

## Setup Instructions

### 1. Firebase Configuration
Anda perlu membuat 2 Firebase projects:

**Project A** (Auth & Firestore):
- Enable Authentication (Email/Password, Google, GitHub)
- Create Firestore Database
- Get config dari Project Settings

**Project B** (Storage):
- Enable Storage
- Get config dari Project Settings

### 2. Environment Variables
Copy `.env.example` ke `.env` dan isi dengan credentials Firebase Anda:

```env
# Firebase Project A
NEXT_PUBLIC_FIREBASE_A_API_KEY=...
NEXT_PUBLIC_FIREBASE_A_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_A_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_A_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_A_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_A_APP_ID=...

# Firebase Project B
NEXT_PUBLIC_FIREBASE_B_API_KEY=...
NEXT_PUBLIC_FIREBASE_B_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_B_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_B_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_B_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_B_APP_ID=...

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_PRIVATE_KEY=...
FIREBASE_ADMIN_CLIENT_EMAIL=...

# Gemini API
GEMINI_API_KEY=...
NEXT_PUBLIC_GLOBAL_GEMINI_KEY=...

# Encryption Key (generate random string)
ENCRYPTION_KEY=your-secure-random-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

## Recent Changes
- **2025-10-12 (Security Hardening)**: Critical security fixes
  - Implemented Firebase ID token verification for all API routes
  - Added session cookie management with Firebase Admin SDK
  - Removed public Gemini API key exposure (server-side only now)
  - Added workspace ownership verification before AI operations
  - Restricted file parsing to Firebase Storage URLs only (SSRF protection)
  - Implemented Bearer token authentication for API calls
  
- **2025-10-12 (Initial Setup)**: MVP implementation
  - Created Next.js 15 project structure with TypeScript
  - Setup dual Firebase configuration (Project A & B)
  - Implemented authentication pages with Email, Google, GitHub OAuth
  - Created chat interface with Gemini 2.0 & 2.5 integration
  - Added multi-workspace management system
  - Implemented file upload, markdown rendering with syntax highlighting
  - Added model switching and personality profiles
  - Created plugin system framework

## Next Phase Features
- Advanced memory system
- Plugin SDK for custom plugins
- Multi-agent mention system (@Sira, @Code, @Tutor)
- Public workspace sharing
- Usage dashboard
- Admin panel
- Voice mode integration
- Advanced security features

## Architecture Notes
- Dual Firebase setup: Project A handles auth/data, Project B handles file storage
- API keys dapat disimpan encrypted per-user atau menggunakan global key
- Workspace-based chat organization
- Real-time sync menggunakan Firestore listeners
- Modular plugin system untuk extensibility

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
- Default Theme: Dark
- Default Model: Gemini 2.0 Flash

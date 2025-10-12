# Firebase Security Rules - SIRA AI

## Firestore Security Rules (Project A)

Paste these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.workspaceId != null;
      allow update: if false;
      allow delete: if request.auth != null;
    }
    
    match /personalities/{personalityId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Storage Security Rules (Project B)

Paste these rules in Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    match /uploads/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 10 * 1024 * 1024;
    }
    
    match /uploads/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

## Security Best Practices

### 1. API Keys
- ✅ Gemini API key is server-side only (not exposed to client)
- ✅ User's custom API keys are encrypted with AES-256-GCM
- ✅ Encryption key stored in environment variables
- ⚠️ Generate strong ENCRYPTION_KEY: `openssl rand -base64 32`

### 2. Authentication
- ✅ Firebase ID tokens verified on every API call
- ✅ Session cookies are httpOnly and secure in production
- ✅ Refresh tokens revoked when logging out
- ✅ 14-day session expiry

### 3. Authorization
- ✅ Workspace ownership checked before AI operations
- ✅ Users can only access their own data
- ✅ File parsing restricted to Firebase Storage URLs
- ✅ Firestore rules enforce user ownership

### 4. File Upload
- ✅ 10MB file size limit
- ✅ File type validation on client and server
- ✅ Files stored in user-specific folders
- ✅ URL validation prevents SSRF attacks

### 5. Production Checklist
- [ ] Deploy Firebase Security Rules (Firestore + Storage)
- [ ] Set all environment variables in production
- [ ] Enable HTTPS only
- [ ] Set NODE_ENV=production
- [ ] Review Firebase Admin private key security
- [ ] Setup rate limiting (optional, dapat menggunakan Vercel atau Firebase Extensions)
- [ ] Monitor API usage dan set quotas
- [ ] Enable Firebase App Check (recommended)

## Common Security Issues to Avoid

### ❌ DON'T
- Expose Gemini API key to client
- Trust client-supplied user IDs without verification
- Allow arbitrary URL parsing (SSRF risk)
- Store sensitive data unencrypted
- Skip workspace ownership checks

### ✅ DO
- Verify Firebase ID tokens on all API routes
- Check resource ownership before operations
- Validate and sanitize all inputs
- Use server-side API keys only
- Implement proper error handling
- Log security events for monitoring

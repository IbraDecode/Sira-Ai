import * as admin from "firebase-admin";

let firebaseAdmin: admin.app.App;

export function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  } else {
    firebaseAdmin = admin.apps[0]!;
  }

  return firebaseAdmin;
}

export function getFirebaseAdmin() {
  if (!firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return firebaseAdmin;
}

export { admin };

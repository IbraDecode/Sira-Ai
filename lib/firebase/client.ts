import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfigA, firebaseConfigB } from "./config";

let firebaseAppA: FirebaseApp;
let firebaseAppB: FirebaseApp;
let auth: Auth;
let firestoreDb: Firestore;
let storageB: FirebaseStorage;

export function initializeFirebase() {
  if (!getApps().length) {
    firebaseAppA = initializeApp(firebaseConfigA, "projectA");
    firebaseAppB = initializeApp(firebaseConfigB, "projectB");
  } else {
    firebaseAppA = getApps().find((app) => app.name === "projectA")!;
    firebaseAppB = getApps().find((app) => app.name === "projectB")!;
  }

  auth = getAuth(firebaseAppA);
  firestoreDb = getFirestore(firebaseAppA);
  storageB = getStorage(firebaseAppB);

  return { auth, db: firestoreDb, storage: storageB };
}

export { auth, firestoreDb as db, storageB as storage };
export { firebaseAppA, firebaseAppB };

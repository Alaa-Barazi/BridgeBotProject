/**
 * Firebase initialization and shared service exports
 *
 * This file initializes the Firebase app using environment variables
 * and exports configured instances for use across the application.
 *
 * Exported services:
 * - auth    → Firebase Authentication (login, register, roles)
 * - rtdb    → Realtime Database (weeks, quiz, dictionary, forum, notes)
 * - db      → Firestore (legacy / specific collections only)
 * - storage → Firebase Storage (file uploads)
 *
 * IMPORTANT:
 * - Most dynamic and collaborative data is stored in RTDB
 * - Firestore is used only where explicitly required
 * - Storage is used only for large binary files
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

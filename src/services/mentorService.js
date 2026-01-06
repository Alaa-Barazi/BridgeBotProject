// src/services/mentorService.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* =========================
   Mentor Services
   ========================= */

/**
 * Get all teams (mentor only – controlled by Firestore Rules)
 */
export async function getAllTeams() {
  const snap = await getDocs(collection(db, "teams"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Get all users (mentor only – controlled by Firestore Rules)
 */
export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

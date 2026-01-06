// src/services/authService.js
import { auth, db } from "../firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

import {
  normalizeEmail,
  assertAllowedDomain,
  assertStrongPassword,
  assertPasswordsMatch,
  assertValidTeamNumber,
} from "./validators";

/* =========================
   Helpers
   ========================= */
function formatJoinedOn(ts) {
  try {
    if (!ts) return "";
    if (typeof ts.toDate === "function") {
      return ts.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    if (ts instanceof Date) {
      return ts.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "";
  } catch {
    return "";
  }
}

/* =========================
   LOGIN (basic)
   ========================= */
export async function loginUser(email, password) {
  const normalized = normalizeEmail(email);
  assertAllowedDomain(normalized);

  const cred = await signInWithEmailAndPassword(auth, normalized, password);
  return cred.user;
}

/* =========================
   LOGIN (with role + teamId)
   ========================= */
export async function loginWithEmail(email, password) {
  const user = await loginUser(email, password);
  const uid = user.uid;

  // Mentor?
  try {
    const mentorSnap = await getDoc(doc(db, "mentors", uid));
    if (mentorSnap.exists()) {
      localStorage.removeItem("teamId");
      return { user, role: "mentor", teamId: null };
    }
  } catch (err) {
    console.warn("MENTOR CHECK WARNING:", err?.code, err?.message);
  }

  // Student -> users/{uid}
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) {
    throw new Error("User profile missing in Firestore (users/{uid}).");
  }

  const teamId = String(userSnap.data().teamId || "").trim();
  if (!teamId) throw new Error("teamId missing in users/{uid}.");

  localStorage.setItem("teamId", teamId);
  return { user, role: "student", teamId };
}

/* =========================
   REGISTER
   ========================= */
export async function registerUser(formData) {
  const email = normalizeEmail(formData.email);
  assertAllowedDomain(email);

  assertStrongPassword(formData.password);
  assertPasswordsMatch(formData.password, formData.confirmPassword);

  const teamNumber = assertValidTeamNumber(formData.teamNumber);

  let createdUser = null;

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      formData.password
    );

    createdUser = cred.user;
    const uid = createdUser.uid;

    await updateProfile(createdUser, {
      displayName: String(formData.userName || "").trim(),
    });

    const teamRef = doc(db, "teams", teamNumber);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
      await setDoc(teamRef, {
        teamId: teamNumber,
        teamNumber,
        teamName: `Team ${teamNumber}`,
        role: "team",
        memberUids: [uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(teamRef, {
        memberUids: arrayUnion(uid),
        updatedAt: serverTimestamp(),
      });
    }

    await setDoc(doc(db, "users", uid), {
      uid,
      userName: String(formData.userName || "").trim(),
      email,
      teamId: teamNumber,
      teamNumber,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    localStorage.setItem("teamId", teamNumber);
    return true;
  } catch (err) {
    if (createdUser) {
      try {
        await deleteUser(createdUser);
      } catch (_) {}
    }
    throw err;
  }
}

/* =========================
   RESET PASSWORD
   ========================= */
export async function sendResetPasswordLink(email) {
  const normalized = normalizeEmail(email);
  assertAllowedDomain(normalized);

  await sendPasswordResetEmail(auth, normalized);
  return true;
}

/* =========================
   LOAD STUDENT PROFILE (ready for UI)
   ========================= */
export async function loadStudentProfile(uid) {
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) throw new Error("User profile not found (users/{uid}).");

  const userData = userSnap.data();
  const teamId = String(userData.teamId || "").trim();
  if (!teamId) throw new Error("teamId missing in users/{uid}.");

  const teamSnap = await getDoc(doc(db, "teams", teamId));
  if (!teamSnap.exists()) throw new Error("Team not found (teams/{teamId}).");

  const teamData = teamSnap.data();

  const joinedOn =
    teamData.createdAt?.toDate?.().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) || "";

  return {
    teamId,
    teamInfo: {
      teamName: teamData.teamName || `Team ${teamId}`,
      teamNumber: teamData.teamNumber || teamId,
      email: userData.email || "",
      joinedOn,
    },
    user: userData,
    team: teamData,
  };
}

/* =========================
   UPDATE TEAM NAME
   ========================= */
export async function updateTeamName(teamId, teamName) {
  const tid = String(teamId || "").trim();
  const name = String(teamName || "").trim();

  if (!tid) throw new Error("Missing teamId.");
  if (!name) throw new Error("Team name is required.");

  await updateDoc(doc(db, "teams", tid), {
    teamName: name,
    updatedAt: serverTimestamp(),
  });

  return true;
}

/* =========================
   LOGOUT
   ========================= */
export async function logout() {
  await signOut(auth);
  localStorage.removeItem("teamId");
  return true;
}

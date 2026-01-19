// src/services/authService.js
import { auth, rtdb } from "../firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
} from "firebase/auth";

import {
  ref,
  get,
  set,
  update,
  serverTimestamp,
  runTransaction,
} from "firebase/database";

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
function formatDateFromMillis(ms) {
  try {
    if (!ms) return "";
    const d = new Date(Number(ms));
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* =========================
   MENTOR CONFIG (BY EMAIL)
   ========================= */
const MENTOR_EMAILS = new Set([
  "mentor@e.braude.ac.il", // ✅ תוסיפי פה עוד מיילים אם צריך
]);

function isMentorEmail(email) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  return MENTOR_EMAILS.has(e);
}
async function ensureMentorProfile(user) {
  const uid = user?.uid;
  const email = String(user?.email || "")
    .trim()
    .toLowerCase();
  if (!uid) throw new Error("Missing uid.");

  if (!isMentorEmail(email)) return false;

  const mentorRef = ref(rtdb, `mentors/${uid}`);
  const mentorSnap = await get(mentorRef);

  if (!mentorSnap.exists()) {
    await set(mentorRef, {
      uid,
      email,
      name: user?.displayName || "BridgeBot mentor",
      role: "mentor",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await update(mentorRef, { updatedAt: serverTimestamp() });
  }

  return true;
}

// async function ensureMentorProfile(user) {
//   const uid = user?.uid;
//   const email = String(user?.email || "")
//     .trim()
//     .toLowerCase();
//   if (!uid) throw new Error("Missing uid.");

//   // not mentor -> do nothing
//   if (!isMentorEmail(email)) return false;

//   // create mentors/{uid} if missing
//   const mentorRef = ref(rtdb, `mentors/${uid}`);
//   const mentorSnap = await get(mentorRef);

//   if (!mentorSnap.exists()) {
//     await set(mentorRef, {
//       uid,
//       email,
//       name: user?.displayName || "BridgeBot mentor",
//       role: "mentor",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//   } else {
//     // touch updatedAt
//     await update(mentorRef, { updatedAt: serverTimestamp() });
//   }

//   // OPTIONAL: create users/{uid} too (role=mentor) so UI won't complain about missing profile
//   const userRef = ref(rtdb, `users/${uid}`);
//   const userSnap = await get(userRef);

//   if (!userSnap.exists()) {
//     await set(userRef, {
//       uid,
//       email,
//       userName: user?.displayName || "BridgeBot mentor",
//       role: "mentor",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//   } else {
//     await update(userRef, { role: "mentor", updatedAt: serverTimestamp() });
//   }

//   return true;
// }

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

  // ✅ Mentor path (NO teamId)
  const mentorOk = await ensureMentorProfile(user);
  if (mentorOk) {
    localStorage.removeItem("teamId");
    return { user, role: "mentor", teamId: null };
  }

  // Student -> users/{uid}
  const userSnap = await get(ref(rtdb, `users/${uid}`));
  if (!userSnap.exists()) {
    throw new Error("User profile missing in RTDB (users/{uid}).");
  }

  const userData = userSnap.val();
  const teamId = String(userData?.teamId || "").trim();
  if (!teamId) throw new Error("teamId missing in users/{uid}.");

  localStorage.setItem("teamId", teamId);
  return { user, role: "student", teamId };
}

/* =========================
   REGISTER
   - writes to:
     teams/{teamNumber}
     users/{uid}
   ========================= */
export async function registerUser(formData) {
  const email = normalizeEmail(formData.email);
  assertAllowedDomain(email);

  assertStrongPassword(formData.password);
  assertPasswordsMatch(formData.password, formData.confirmPassword);

  const teamNumber = assertValidTeamNumber(formData.teamNumber);
  const userName = String(formData.userName || "").trim();
  if (!userName) throw new Error("User name is required.");

  let createdUser = null;

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      formData.password
    );
    createdUser = cred.user;
    const uid = createdUser.uid;

    await updateProfile(createdUser, { displayName: userName });

    // 1) Ensure team exists + add memberUids/{uid} = true
    const teamPath = `teams/${teamNumber}`;

    await runTransaction(ref(rtdb, teamPath), (current) => {
      if (current == null) {
        return {
          teamId: teamNumber,
          teamNumber,
          teamName: `Team ${teamNumber}`,
          role: "team",
          memberUids: { [uid]: true }, // ✅ MAP
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
      }

      const next = { ...current };
      if (!next.memberUids || typeof next.memberUids !== "object")
        next.memberUids = {};
      next.memberUids[uid] = true;
      next.updatedAt = serverTimestamp();
      return next;
    });

    // 2) Create users/{uid}
    await set(ref(rtdb, `users/${uid}`), {
      uid,
      userName,
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
   LOAD STUDENT PROFILE
   ========================= */
export async function loadStudentProfile(uid) {
  if (!uid) throw new Error("Missing uid.");

  const userSnap = await get(ref(rtdb, `users/${uid}`));
  if (!userSnap.exists())
    throw new Error("User profile not found (users/{uid}).");

  const userData = userSnap.val();
  const teamId = String(userData?.teamId || "").trim();
  if (!teamId) throw new Error("teamId missing in users/{uid}.");

  const teamSnap = await get(ref(rtdb, `teams/${teamId}`));
  if (!teamSnap.exists()) throw new Error("Team not found (teams/{teamId}).");

  const teamData = teamSnap.val();
  const joinedOn = formatDateFromMillis(teamData?.createdAt);

  return {
    teamId,
    teamInfo: {
      teamName: teamData?.teamName || `Team ${teamId}`,
      teamNumber: teamData?.teamNumber || teamId,
      email: userData?.email || "",
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

  await update(ref(rtdb, `teams/${tid}`), {
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

/* =========================
  Fetch All Users 
  ========================= */
//Fetch user and projects
export async function fetchUsersMap() {
  const snapshot = await get(ref(rtdb, "users"));

  if (!snapshot.exists()) return {};

  const data = snapshot.val();
  const usersMap = {};

  Object.keys(data).forEach((userId) => {
    usersMap[userId] = data[userId].userName;
  });

  return usersMap;
}

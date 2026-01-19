// src/services/forumService.js (RTDB - answers inside questions)

import { rtdb, auth } from "../firebase";
import {
  ref,
  get,
  set,
  update,
  push,
  serverTimestamp,
  onValue,
  query,
  orderByChild,
  limitToLast,
  runTransaction,
} from "firebase/database";

/* =========================
   Helpers
   ========================= */
const toStr = (v) => String(v ?? "").trim();

function requireStr(name, value) {
  const s = toStr(value);
  if (!s) throw new Error(`Missing ${name}.`);
  return s;
}

function getUserOrThrow() {
  const user = auth?.currentUser;
  if (!user) throw new Error("You must be logged in.");
  return user;
}

/* =========================
   QUESTIONS
   ========================= */

export async function createQuestion({ title, body }) {
  const user = getUserOrThrow();

  const payload = {
    title: requireStr("title", title),
    body: requireStr("body", body),

    userUid: user.uid,
    userName: toStr(user.displayName) || toStr(user.email) || "User",

    answersCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const newRef = push(ref(rtdb, "questions"));
  await set(newRef, payload);

  return { id: newRef.key, ...payload };
}

export function subscribeQuestions({ onData, onError, max = 50 } = {}) {
  const qy = query(
    ref(rtdb, "questions"),
    orderByChild("createdAt"),
    limitToLast(max)
  );

  const unsub = onValue(
    qy,
    (snap) => {
      const obj = snap.val() || {};
      const rows = Object.entries(obj).map(([id, data]) => ({
        id,
        ...(data || {}),
      }));

      rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      if (typeof onData === "function") onData(rows);
    },
    (err) => {
      if (typeof onError === "function") onError(err);
    }
  );

  return unsub;
}

/* =========================
   ANSWERS INSIDE QUESTION
   /questions/{qid}/answers/{aid}
   ========================= */

export function subscribeAnswers(questionId, { onData, onError } = {}) {
  const qid = requireStr("questionId", questionId);

  const aRef = ref(rtdb, `questions/${qid}/answers`);

  const unsub = onValue(
    aRef,
    (snap) => {
      const obj = snap.val() || {};
      const rows = Object.entries(obj).map(([id, data]) => ({
        id,
        ...(data || {}),
      }));

      rows.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      if (typeof onData === "function") onData(rows);
    },
    (err) => {
      if (typeof onError === "function") onError(err);
    }
  );

  return unsub;
}
export async function addAnswer(questionId, { body }) {
  const user = getUserOrThrow();
  const qid = requireStr("questionId", questionId);

  const isMentor =
    String(user?.email || "").toLowerCase() === "mentor@e.braude.ac.il";

  // ✅ load mentor name from /mentors (NOT /users)
  let mentorName = "";
  try {
    if (isMentor) {
      const snap = await get(ref(rtdb, `mentors/${user.uid}/displayName`));
      mentorName = snap.exists() ? String(snap.val() || "").trim() : "";
    }
  } catch (e) {
    console.warn("Failed to load mentor name:", e);
  }

  // ✅ normal users: displayName -> email -> "User"
  const userDisplay = toStr(user.displayName) || toStr(user.email) || "User";

  const answerObj = {
    body: requireStr("body", body),
    userUid: user.uid,

    // ✅ mentor: DB name -> auth displayName -> constant label
    userName: isMentor
      ? mentorName || toStr(user.displayName) || "BridgeBot Mentor"
      : userDisplay,

    role: isMentor ? "mentor" : "user",
    createdAt: serverTimestamp(),
  };

  const aRef = push(ref(rtdb, `questions/${qid}/answers`));
  await set(aRef, answerObj);

  await runTransaction(ref(rtdb, `questions/${qid}/answersCount`), (n) => {
    return Number(n || 0) + 1;
  });

  await update(ref(rtdb, `questions/${qid}`), {
    updatedAt: serverTimestamp(),
  });

  return { id: aRef.key, ...answerObj };
}

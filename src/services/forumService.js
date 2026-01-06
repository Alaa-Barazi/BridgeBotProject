// src/services/forumService.js
import { db, auth } from "../firebase";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  limit,
  updateDoc,
  increment,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

const QUESTIONS_COL = "questions";

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

    // ✅ "user" fields
    userUid: user.uid,
    userName: toStr(user.displayName) || toStr(user.email) || "User",

    // ✅ store answers INSIDE the question doc
    answers: [],
    answersCount: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, QUESTIONS_COL), payload);
  return { id: ref.id, ...payload };
}

export async function getQuestionById(questionId) {
  const qid = requireStr("questionId", questionId);

  const snap = await getDoc(doc(db, QUESTIONS_COL, qid));
  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

export function subscribeQuestions({ onData, onError, max = 50 } = {}) {
  const qRef = collection(db, QUESTIONS_COL);
  const qy = query(qRef, orderBy("createdAt", "desc"), limit(max));

  const unsub = onSnapshot(
    qy,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (typeof onData === "function") onData(rows);
    },
    (err) => {
      if (typeof onError === "function") onError(err);
    }
  );

  return unsub;
}

/* =========================
   ANSWERS (INSIDE QUESTION FIELD)
   stored in: questions/{questionId}.answers[]
   ========================= */

export async function addAnswer(questionId, { body }) {
  const user = getUserOrThrow();
  const qid = requireStr("questionId", questionId);

  const answerObj = {
    body: requireStr("body", body),
    userUid: user.uid,
    userName: toStr(user.displayName) || toStr(user.email) || "User",
    // ✅ Use Timestamp.now() inside array objects (better than serverTimestamp here)
    createdAt: Timestamp.now(),
  };

  // ✅ push new answer into answers[] field
  await updateDoc(doc(db, QUESTIONS_COL, qid), {
    answers: arrayUnion(answerObj),
    answersCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  return answerObj;
}

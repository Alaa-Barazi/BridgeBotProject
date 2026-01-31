/**
 * quizService (RTDB)
 *
 * Manages weekly quizzes generated from uploaded course documents.
 * Uses Gemini AI to generate and edit quiz questions, and stores them in RTDB.
 *
 * Responsibilities:
 * - Generate a quiz for a given week based on extracted document text
 * - Persist quiz questions under the weekly structure in RTDB
 * - Fetch existing quiz questions for display
 * - Apply AI-driven edits to individual questions
 *
 * Data model (RTDB):
 * /weeks/week_{n}/quiz/{questionId}
 *   - question: string
 *   - difficulty: string
 *   - createdAt: serverTimestamp
 *   - updatedAt: serverTimestamp
 *
 * Notes:
 * - Requires authenticated user
 * - Quiz generation depends on documents uploaded for the same week
 * - Gemini responses are treated as source of truth for question text
 */

import { rtdb, auth } from "../firebase";
import {
  ref,
  get,
  set,
  push,
  update,
  serverTimestamp,
} from "firebase/database";

import { generateQuizWithGemini, editTextWithGemini } from "./geminiService";
import { getWeekSourceText } from "./documentService";

/* =========================
   Helpers
   ========================= */
const toStr = (v) => String(v ?? "").trim();

function requireStr(name, value) {
  const s = toStr(value);
  if (!s) throw new Error(`Missing ${name}.`);
  return s;
}

function requireAuth() {
  const u = auth?.currentUser;
  if (!u) throw new Error("You must be logged in to perform this action.");
  return u;
}

function weekIdFromNumber(week) {
  const w = Number(week);
  if (!Number.isFinite(w) || w <= 0) throw new Error("Invalid week value.");
  return `week_${w}`;
}

function quizPath(week) {
  return `weeks/${weekIdFromNumber(week)}/quiz`;
}

/* =========================
   Generate Week Quiz (RTDB)
   Writes: /weeks/week_{n}/quiz/{qid}
   ========================= */
export async function generateWeekQuiz(week) {
  requireAuth();

  // support sync/async getWeekSourceText
  const maybeText = getWeekSourceText(week);
  const sourceText = toStr(await Promise.resolve(maybeText));

  if (!sourceText.trim()) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateQuizWithGemini({ week, sourceText });

  const baseRef = ref(rtdb, quizPath(week));

  for (const item of generated) {
    const question = toStr(item?.question);
    if (!question) continue;

    const qRef = push(baseRef);
    await set(qRef, {
      question,
      difficulty: "medium",
      createdAt: serverTimestamp(), // ✅ RTDB server time
      updatedAt: serverTimestamp(),
    });
  }

  return true;
}

/* =========================
   List Week Quiz (RTDB)
   Reads: /weeks/week_{n}/quiz
   ========================= */
export async function listWeekQuiz(week) {
  const snapshot = await get(ref(rtdb, quizPath(week)));
  if (!snapshot.exists()) return [];

  const obj = snapshot.val() || {};
  return Object.entries(obj).map(([id, data]) => ({
    id,
    ...(data || {}),
  }));
}

/* =========================
   Apply Quiz Edit (RTDB)
   Updates: /weeks/week_{n}/quiz/{qid}
   ========================= */
export async function applyQuizEdit(questionId, instruction, week) {
  requireAuth();

  const qid = requireStr("questionId", questionId);

  const originalText = toStr(instruction?.originalText);
  const instructionText = toStr(instruction?.text);
  if (!instructionText) throw new Error("Missing edit instruction text.");

  const updated = await editTextWithGemini({
    originalText,
    instruction: instructionText,
    mode: "quiz",
  });

  const qRef = ref(rtdb, `${quizPath(week)}/${qid}`);
  await update(qRef, {
    question: toStr(updated),
    updatedAt: serverTimestamp(),
  });

  return updated;
}

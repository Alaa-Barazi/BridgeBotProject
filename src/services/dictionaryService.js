/**
 * dictionaryService (RTDB)
 *
 * Manages weekly dictionary generation and editing.
 * Integrates AI-powered term extraction and definition refinement
 * using Gemini, and persists results in Firebase Realtime Database.
 *
 * Responsibilities:
 * - Generate dictionary entries from weekly course documents
 * - Store and retrieve dictionary entries per week
 * - Apply AI-assisted edits to definitions
 * - Enforce authentication and consistent week-based paths
 *
 * Data structure:
 * /weeks/week_{n}/dictionary/{entryId}
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

import {
  generateDictionaryWithGemini,
  editTextWithGemini,
} from "./geminiService";
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

//  keep weekId consistent everywhere: week_1, week_2 ...
function weekIdFromNumber(week) {
  const w = Number(week);
  if (!Number.isFinite(w) || w <= 0) throw new Error("Invalid week value.");
  return `week_${w}`;
}

function dictPath(week) {
  return `weeks/${weekIdFromNumber(week)}/dictionary`;
}

/* =========================
   Generate Week Dictionary (RTDB)
   Writes: /weeks/week_{n}/dictionary/{entryId}
   ========================= */
export async function generateWeekDictionary(week) {
  const user = requireAuth();

  // ✅ getWeekSourceText might be async -> handle both
  const maybeText = getWeekSourceText(week);
  const sourceText = toStr(await Promise.resolve(maybeText));

  if (!sourceText) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateDictionaryWithGemini({ week, sourceText });

  const baseRef = ref(rtdb, dictPath(week));

  for (const item of generated) {
    const term = toStr(item?.term);
    const definition = toStr(item?.definition);
    if (!term || !definition) continue;

    const category = toStr(item?.category) || "IoT";
    const level = toStr(item?.level) || "basic";

    const entryRef = push(baseRef);
    await set(entryRef, {
      term,
      definition,
      category,
      level,
      createdAt: serverTimestamp(), // ✅ RTDB server time
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
    });
  }

  return true;
}

/* =========================
   List Week Dictionary (RTDB)
   ========================= */
export async function listWeekDictionary(week) {
  const snapshot = await get(ref(rtdb, dictPath(week)));
  if (!snapshot.exists()) return [];

  const obj = snapshot.val() || {};
  return Object.entries(obj).map(([id, data]) => ({
    id,
    ...(data || {}),
  }));
}

/* =========================
   Apply Definition Edit (RTDB)
   Updates: /weeks/week_{n}/dictionary/{entryId}
   ========================= */
export async function applyDefinitionEdit(entryId, instruction, week) {
  const user = requireAuth();

  const id = requireStr("entryId", entryId);
  const w = requireStr("week", week);

  const instructionText = toStr(instruction?.text);
  if (!instructionText) throw new Error("Missing edit instruction text.");

  // ✅ If originalText not provided, fetch current definition from RTDB
  let originalText = toStr(instruction?.originalText);
  const entryRef = ref(rtdb, `weeks/${weekIdFromNumber(w)}/dictionary/${id}`);

  if (!originalText) {
    const snap = await get(entryRef);
    originalText = toStr(snap.val()?.definition);
  }

  const updated = await editTextWithGemini({
    originalText,
    instruction: instructionText,
    mode: "dictionary",
  });

  await update(entryRef, {
    definition: toStr(updated),
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  });

  return updated;
}

/**
 * notesService
 *
 * RTDB service layer for mentor notes attached to projects.
 *
 * Responsibilities:
 * - Subscribe to project notes for teams with unread tracking
 * - Subscribe to project notes for mentors (full visibility)
 * - Create mentor notes linked to projects and documents
 * - Mark project notes as read per team
 *
 * Data model:
 * /projects/{projectId}/notes/{noteId}
 * - body
 * - mentorUid
 * - aboutDocId (optional)
 * - aboutDocTitle (optional)
 * - createdAt (number)
 * - readByTeams: { [teamId]: true }
 *
 * Notes:
 * - Uses Firebase Realtime Database listeners
 * - Unread count is computed per team using readByTeams
 * - Optimized to update only unread notes
 */

import { rtdb, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, update, onValue, push, set } from "firebase/database";

/* =========================
   Helpers
   ========================= */
const toStr = (v) => String(v ?? "").trim();

function requireStr(name, value) {
  const s = toStr(value);
  if (!s) throw new Error(`Missing ${name}.`);
  return s;
}

/* =========================================================
   TEAM VIEW (uses readByTeams + unread count)
   ========================================================= */
export function subscribeProjectNotes(projectId, teamId, { onState } = {}) {
  const pid = requireStr("projectId", projectId);
  const tid = requireStr("teamId", teamId);

  const emit = (patch) => typeof onState === "function" && onState(patch);

  emit({ loading: true, error: "", notes: [], unreadCount: 0 });

  const notesRef = ref(rtdb, `projects/${pid}/notes`);

  let detachValueListener = null;

  const detach = () => {
    if (typeof detachValueListener === "function") {
      detachValueListener();
      detachValueListener = null;
    }
  };

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    // whenever auth changes - detach previous listener
    detach();

    if (!user) {
      emit({
        loading: false,
        error: "You must be logged in.",
        notes: [],
        unreadCount: 0,
      });
      return;
    }

    // attach notes listener
    detachValueListener = onValue(
      notesRef,
      (snap) => {
        const obj = snap.exists() ? snap.val() : {};
        const arr = Object.entries(obj || {}).map(([id, val]) => ({
          id,
          ...(val || {}),
        }));

        arr.sort(
          (a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0),
        );

        const unreadCount = arr.reduce((acc, n) => {
          const isRead = n?.readByTeams?.[tid] === true;
          return acc + (isRead ? 0 : 1);
        }, 0);

        emit({ loading: false, error: "", notes: arr, unreadCount });
      },
      (err) => {
        console.error("NOTES SUBSCRIBE ERROR:", err);
        emit({
          loading: false,
          error: String(err?.message || "Failed to load notes."),
          notes: [],
          unreadCount: 0,
        });
      },
    );
  });

  // proper cleanup
  return () => {
    detach();
    if (typeof unsubAuth === "function") unsubAuth();
  };
}

/* =========================================================
   MENTOR VIEW (no teamId needed)
   ========================================================= */
export function subscribeProjectNotesMentor(projectId, { onState } = {}) {
  const pid = requireStr("projectId", projectId);

  const emit = (patch) => typeof onState === "function" && onState(patch);
  emit({ loading: true, error: "", notes: [] });

  const notesRef = ref(rtdb, `projects/${pid}/notes`);

  let detachValueListener = null;

  const detach = () => {
    if (typeof detachValueListener === "function") {
      detachValueListener();
      detachValueListener = null;
    }
  };

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    detach();

    if (!user) {
      emit({ loading: false, error: "You must be logged in.", notes: [] });
      return;
    }

    detachValueListener = onValue(
      notesRef,
      (snap) => {
        const obj = snap.exists() ? snap.val() : {};
        const arr = Object.entries(obj || {}).map(([id, val]) => ({
          id,
          ...(val || {}),
        }));
        arr.sort(
          (a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0),
        );
        emit({ loading: false, error: "", notes: arr });
      },
      (err) => {
        console.error("MENTOR NOTES SUBSCRIBE ERROR:", err);
        emit({
          loading: false,
          error: String(err?.message || "Failed to load notes."),
          notes: [],
        });
      },
    );
  });

  return () => {
    detach();
    if (typeof unsubAuth === "function") unsubAuth();
  };
}

/* =========================================================
   CREATE NOTE (mentor writes)
   ========================================================= */
export async function createProjectNote(
  projectId,
  { body, aboutDocId = null, aboutDocTitle = null } = {},
) {
  const pid = requireStr("projectId", projectId);
  const text = toStr(body);
  if (!text) throw new Error("Missing body.");

  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in.");

  const notesRef = ref(rtdb, `projects/${pid}/notes`);
  const newRef = push(notesRef);

  const payload = {
    body: text,
    mentorUid: user.uid,
    aboutDocId: aboutDocId ? String(aboutDocId) : null,
    aboutDocTitle: aboutDocTitle ? String(aboutDocTitle) : null,
    createdAt: Date.now(),
    readByTeams: {}, // ✅ teams will mark read here
  };

  await set(newRef, payload);

  return { id: newRef.key, ...payload };
}

/* =========================================================
   TEAM: mark only UNREAD as read (efficient)
   - Pass notes list if you already have it (avoids extra get)
   ========================================================= */
export async function markUnreadProjectNotesRead(
  projectId,
  teamId,
  notesList = null,
) {
  const pid = requireStr("projectId", projectId);
  const tid = requireStr("teamId", teamId);

  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in.");

  // Use provided list if available
  let notes = Array.isArray(notesList) ? notesList : null;

  if (!notes) {
    const snap = await get(ref(rtdb, `projects/${pid}/notes`));
    if (!snap.exists()) return true;

    const obj = snap.val() || {};
    notes = Object.entries(obj).map(([id, val]) => ({ id, ...(val || {}) }));
  }

  const updates = {};
  for (const n of notes) {
    const noteId = String(n?.id || "").trim();
    if (!noteId) continue;

    const isRead = n?.readByTeams?.[tid] === true;
    if (isRead) continue;

    updates[`projects/${pid}/notes/${noteId}/readByTeams/${tid}`] = true;
  }

  if (Object.keys(updates).length === 0) return true;

  await update(ref(rtdb), updates);
  return true;
}

/* =========================================================
   Backward-compatible name (if you already import this)
   ========================================================= */
export async function markAllProjectNotesRead(projectId, teamId) {
  // keep old API but make it efficient:
  return markUnreadProjectNotesRead(projectId, teamId, null);
}

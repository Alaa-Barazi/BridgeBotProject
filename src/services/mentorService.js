/**
 * mentorService
 *
 * RTDB service layer for mentor-specific data access and actions.
 *
 * Responsibilities:
 * - Fetch teams, users, and projects for mentor views
 * - Subscribe to mentor-visible projects in real time
 * - Retrieve project details and documents
 * - Create mentor notes attached to projects
 *
 * Notes:
 * - Requires authenticated user
 * - Assumes mentor-level access is handled by routing and rules
 * - Uses Firebase Realtime Database listeners for live updates
 */

import { rtdb, auth } from "../firebase";
import { ref, get, onValue, push, set } from "firebase/database";

/* =========================
   Helpers
   ========================= */
const toStr = (v) => String(v ?? "").trim();

function requireAuth() {
  const user = auth?.currentUser;
  if (!user) throw new Error("You must be logged in.");
  return user;
}

function requireStr(name, value) {
  const s = toStr(value);
  if (!s) throw new Error(`Missing ${name}.`);
  return s;
}

function isMentorUser() {
  const u = auth?.currentUser;
  return !!u;
}

/* =========================
   Mentor: teams/users/projects
   ========================= */

export async function getAllTeams() {
  requireAuth();
  const snap = await get(ref(rtdb, "teams"));
  if (!snap.exists()) return [];
  const obj = snap.val() || {};
  return Object.entries(obj).map(([id, val]) => ({
    id,
    teamId: val?.teamId ?? id,
    ...val,
  }));
}

export async function getAllUsers() {
  requireAuth();
  const snap = await get(ref(rtdb, "users"));
  if (!snap.exists()) return [];

  const obj = snap.val() || {};

  return Object.entries(obj)
    .map(([id, val]) => ({
      id,
      uid: val?.uid ?? id,
      ...val,
    }))
    .filter((u) => {
      const email = String(u?.email || "").toLowerCase();
      const role = String(u?.role || "").toLowerCase();
      const isMentor = u?.isMentor === true;

      return !isMentor && role !== "mentor" && !email.startsWith("mentor@");
    });
}

export function subscribeMentorProjects({ onState } = {}) {
  const emit = (patch) => typeof onState === "function" && onState(patch);
  emit({ loading: true, error: "", projects: [] });

  let unsubValue = null;

  const unsubAuth = auth.onAuthStateChanged((user) => {
    if (typeof unsubValue === "function") unsubValue();
    unsubValue = null;

    if (!user) {
      emit({ loading: false, error: "You must be logged in.", projects: [] });
      return;
    }

    unsubValue = onValue(
      ref(rtdb, "projects"),
      (snap) => {
        const obj = snap.exists() ? snap.val() : {};
        const arr = Object.entries(obj || {}).map(([id, val]) => ({
          id,
          ...(val || {}),
        }));

        // sort optional
        arr.sort((a, b) => {
          const A = Number(a?.updatedAt || a?.createdAt || 0);
          const B = Number(b?.updatedAt || b?.createdAt || 0);
          return B - A;
        });

        emit({ loading: false, error: "", projects: arr });
      },
      (err) => {
        console.error("SUBSCRIBE PROJECTS ERROR:", err);
        emit({
          loading: false,
          error: String(err?.message || "Failed to load projects."),
          projects: [],
        });
      },
    );

    emit({ loading: false });
  });

  return () => {
    if (typeof unsubValue === "function") unsubValue();
    if (typeof unsubAuth === "function") unsubAuth();
  };
}

export async function getProjectByIdForMentor(projectId) {
  requireAuth();
  const pid = requireStr("projectId", projectId);

  const snap = await get(ref(rtdb, `projects/${pid}`));
  if (!snap.exists()) return null;
  return { id: pid, ...snap.val() };
}

export async function getProjectDocumentsForMentor(projectId) {
  requireAuth();
  const pid = requireStr("projectId", projectId);

  const snap = await get(ref(rtdb, `projects/${pid}/documents`));
  if (!snap.exists()) return [];

  const obj = snap.val() || {};
  return Object.entries(obj).map(([id, val]) => ({ id, ...(val || {}) }));
}

/* =========================
   ✅ Mentor: create project note (writes to RTDB)
   Path: /projects/{projectId}/notes/{noteId}
   ========================= */
export async function createProjectNoteForMentor(projectId, payload) {
  const user = requireAuth();
  if (!isMentorUser()) throw new Error("Not allowed.");

  const pid = requireStr("projectId", projectId);

  const body = toStr(payload?.body);
  if (!body) throw new Error("Missing note body.");

  const aboutDocId = toStr(payload?.aboutDocId) || null;
  const aboutDocTitle = toStr(payload?.aboutDocTitle) || null;

  const base = ref(rtdb, `projects/${pid}/notes`);
  const newRef = push(base);

  // חשוב: createdAt מספרי כדי למיין
  const data = {
    body,
    mentorUid: user.uid,
    aboutDocId,
    aboutDocTitle,
    createdAt: Date.now(),
    // לקריאה של צוותים:
    readByTeams: {},
  };

  await set(newRef, data);

  return { id: newRef.key, ...data };
}

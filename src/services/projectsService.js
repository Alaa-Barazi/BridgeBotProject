/**
 * projectsService (RTDB)
 *
 * Central service for:
 * - Team -> Project creation and ownership resolution
 * - Project workspace loading and authorization
 * - Project architecture configuration
 * - Project progress and status updates
 * - Team-side project notes subscription and read tracking
 *
 * Data model (RTDB):
 *
 * /users/{uid}
 *   - teamId
 *
 * /teams/{teamId}
 *   - memberUids: { [uid]: true }
 *
 * /projects/{projectId}
 *   - ownerteamid
 *   - projectName
 *   - description
 *   - category
 *   - teamLeader
 *   - progress
 *   - status
 *   - architectureConfig
 *   - createdAt / updatedAt
 *
 * /projects/{projectId}/notes/{noteId}
 *   - body
 *   - mentorUid
 *   - aboutDocId (optional)
 *   - aboutDocTitle (optional)
 *   - createdAt (number)
 *   - readByTeams: { [teamId]: true }
 *
 * Notes:
 * - Ownership is enforced via ownerteamid
 * - Notes unread state is computed per team using readByTeams
 * - This file contains TEAM-facing logic
 * - Mentor-facing note creation lives in mentorService / notesService
 */

import { rtdb, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  ref,
  get,
  set,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  serverTimestamp,
  onValue,
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

function getCurrentUserOrThrow() {
  const user = auth?.currentUser;
  if (!user) throw new Error("You must be logged in to perform this action.");
  return user;
}

/**
 * ✅ Ensures teams/{teamId} exists AND includes current user in memberUids (MAP).
 */
async function ensureTeamNode(teamId) {
  const user = getCurrentUserOrThrow();
  const tid = requireStr("teamId", teamId);

  const teamRef = ref(rtdb, `teams/${tid}`);
  const snap = await get(teamRef);

  if (!snap.exists()) {
    await set(teamRef, {
      teamId: tid,
      teamNumber: tid,
      teamName: `Team ${tid}`,
      role: "team",
      memberUids: { [user.uid]: true },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  }

  await update(teamRef, {
    [`memberUids/${user.uid}`]: true,
    updatedAt: serverTimestamp(),
  });

  return true;
}

export function assertProjectOwnership(projectData, teamId) {
  const tid = requireStr("teamId", teamId);
  const owner = toStr(projectData?.ownerteamid);

  if (!owner) throw new Error("Project is missing ownerteamid field.");
  if (owner !== tid)
    throw new Error("You don't have permission to view this project.");
  return true;
}

/* =========================
   USERS -> TEAMID  (RTDB)
   ========================= */
export async function getTeamIdByUserUid(uid, options = {}) {
  const userUid = requireStr("uid", uid);

  const userRef = ref(rtdb, `users/${userUid}`);
  const snap = await get(userRef);

  if (!snap.exists()) throw new Error("User profile not found (users/{uid}).");

  const teamId = toStr(snap.val()?.teamId);
  if (!teamId) throw new Error("teamId missing in users/{uid}.");

  if (options.syncLocalStorage) localStorage.setItem("teamId", teamId);
  return teamId;
}

/* =========================
   PROJECTS
   ========================= */
export async function getProjectById(projectId) {
  const pid = toStr(projectId);
  if (!pid) return null;

  const pRef = ref(rtdb, `projects/${pid}`);
  const snap = await get(pRef);

  if (!snap.exists()) return null;
  return { id: pid, ...snap.val() };
}

export async function getTeamProjectByOwnerTeamId(teamId) {
  const tid = toStr(teamId);
  if (!tid) return null;

  const q = query(
    ref(rtdb, "projects"),
    orderByChild("ownerteamid"),
    equalTo(tid),
    limitToFirst(1),
  );

  const snap = await get(q);
  if (!snap.exists()) return null;

  const obj = snap.val();
  const firstKey = Object.keys(obj)[0];
  if (!firstKey) return null;

  return { id: firstKey, ...obj[firstKey] };
}

export async function createProjectForTeam(data, options = {}) {
  const { preventDuplicate = true, syncLocalStorage = true } = options;

  const teamId = requireStr("teamId", data?.teamId);
  await ensureTeamNode(teamId);

  if (preventDuplicate) {
    const existing = await getTeamProjectByOwnerTeamId(teamId);
    if (existing) {
      if (syncLocalStorage) localStorage.setItem("projectId", existing.id);
      return existing;
    }
  }

  const projectName = requireStr("projectName", data?.projectName);
  const description = toStr(data?.description);
  const category = toStr(data?.category) || "IoT";
  const teamLeader = requireStr("teamLeader", data?.teamLeader);

  const payload = {
    ownerteamid: teamId,
    projectName,
    description,
    category,
    teamLeader,
    mentorUid: data?.mentorUid ? toStr(data.mentorUid) : null,
    progress: Number(data?.progress ?? 0) || 0,
    status: toStr(data?.status) || "On track",

    architectureConfig: {},
    architectureUpdatedAt: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const newRef = push(ref(rtdb, "projects"));
  await set(newRef, payload);

  const created = { id: newRef.key, ...payload };
  if (syncLocalStorage) localStorage.setItem("projectId", created.id);
  return created;
}

/* =========================
   ✅ SETUP: subscribe + create
   ========================= */
export function subscribeTeamProjectSetup({ onState } = {}) {
  const emit = (patch) => {
    if (typeof onState === "function") onState(patch);
  };

  emit({ loading: true, error: "", teamId: "" });

  const unsub = onAuthStateChanged(auth, async (user) => {
    emit({ loading: true, error: "", teamId: "" });

    try {
      if (!user) {
        emit({ loading: false, redirectTo: "/login" });
        return;
      }

      const tid = await getTeamIdByUserUid(user.uid, {
        syncLocalStorage: true,
      });
      emit({ loading: false, teamId: tid, error: "" });
    } catch (err) {
      console.error("SETUP SUBSCRIBE ERROR:", err);
      emit({
        loading: false,
        error: String(err?.message || "Failed to load team info."),
        teamId: "",
      });
    }
  });

  return unsub;
}

export async function createProjectFromSetup(form) {
  const user = getCurrentUserOrThrow();
  const teamId = await getTeamIdByUserUid(user.uid, { syncLocalStorage: true });

  const projectName = requireStr("projectName", form?.projectName);
  const teamLeader = requireStr("teamLeader", form?.teamLeader);

  const created = await createProjectForTeam(
    {
      teamId,
      projectName: toStr(projectName),
      category: toStr(form?.category),
      description: toStr(form?.description),
      teamLeader: toStr(teamLeader),
      status: "On track",
      progress: 0,
    },
    { preventDuplicate: true, syncLocalStorage: true },
  );

  return { projectId: created.id, teamId };
}

/* =========================
   ARCHITECTURE CONFIG
   ========================= */
export async function saveProjectArchitectureConfig(projectId, config) {
  const pid = requireStr("projectId", projectId);
  if (!config || typeof config !== "object")
    throw new Error("Invalid architecture config.");

  const pRef = ref(rtdb, `projects/${pid}`);
  await update(pRef, {
    architectureConfig: config,
    architectureUpdatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return true;
}

export async function getProjectArchitectureConfig(projectId) {
  const p = await getProjectById(projectId);
  return p?.architectureConfig || null;
}

/* =========================
   ✅ NOTES (User side)
   /projects/{projectId}/notes/{noteId}
   readByTeams/{teamId} = true
   ========================= */
export function subscribeProjectNotes(projectId, teamId, { onState } = {}) {
  const emit = (patch) => {
    if (typeof onState === "function") onState(patch);
  };

  const pid = requireStr("projectId", projectId);
  const tid = requireStr("teamId", teamId);

  const notesRef = ref(rtdb, `projects/${pid}/notes`);

  const unsub = onValue(
    notesRef,
    (snap) => {
      if (!snap.exists()) {
        emit({ notes: [], unreadCount: 0 });
        return;
      }

      const obj = snap.val() || {};
      const notesArr = Object.entries(obj).map(([id, v]) => ({
        id,
        ...(v || {}),
      }));

      notesArr.sort(
        (a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0),
      );

      const unreadCount = notesArr.filter(
        (n) => n?.readByTeams?.[tid] !== true,
      ).length;

      emit({ notes: notesArr, unreadCount });
    },
    (err) => {
      console.error("NOTES SUBSCRIBE ERROR:", err);
      emit({ error: String(err?.message || "Failed to load notes.") });
    },
  );

  return unsub;
}

export async function markAllProjectNotesRead(projectId, teamId) {
  const pid = requireStr("projectId", projectId);
  const tid = requireStr("teamId", teamId);

  const notesRef = ref(rtdb, `projects/${pid}/notes`);
  const snap = await get(notesRef);
  if (!snap.exists()) return true;

  const obj = snap.val() || {};
  const updates = {};

  Object.keys(obj).forEach((noteId) => {
    updates[`projects/${pid}/notes/${noteId}/readByTeams/${tid}`] = true;
  });

  if (Object.keys(updates).length > 0) {
    await update(ref(rtdb), updates);
  }

  return true;
}

/* =========================
   WORKSPACE SUBSCRIPTION
   ========================= */
export function subscribeTeamProjectWorkspace(projectId, { onState } = {}) {
  const emit = (patch) => {
    if (typeof onState === "function") onState(patch);
  };

  emit({ loading: true, error: "", project: null, documents: [] });

  const unsubAuth = onAuthStateChanged(auth, async (user) => {
    emit({ loading: true, error: "", project: null, documents: [] });

    try {
      if (!user) {
        emit({
          loading: false,
          error: "You must be logged in to view this page.",
          project: null,
          documents: [],
        });
        return;
      }

      const teamId = await getTeamIdByUserUid(user.uid);

      if (!toStr(projectId)) {
        const ownedProject = await getTeamProjectByOwnerTeamId(teamId);
        if (!ownedProject) {
          emit({
            loading: false,
            error: "No project found for this team.",
            project: null,
            documents: [],
          });
          return;
        }
        emit({ redirectTo: `/project/${ownedProject.id}` });
        return;
      }

      const p = await getProjectById(projectId);
      if (!p) {
        emit({
          loading: false,
          error: "Project not found.",
          project: null,
          documents: [],
        });
        return;
      }

      assertProjectOwnership(p, teamId);

      // ✅ documents load moved to documentService (project docs)
      emit({
        loading: false,
        error: "",
        project: p,
        documents: [],
      });
    } catch (err) {
      console.error("WORKSPACE LOAD ERROR:", err);
      emit({
        loading: false,
        error: String(err?.message || "Failed to load project."),
        project: null,
        documents: [],
      });
    }
  });

  return () => {
    if (typeof unsubAuth === "function") unsubAuth();
  };
}

export async function updateProjectProgress(projectId, progress) {
  const pid = String(projectId || "").trim();
  if (!pid) throw new Error("Missing projectId.");

  const p = Number(progress ?? 0);
  const safe = Number.isFinite(p) ? Math.max(0, Math.min(100, p)) : 0;

  await update(ref(rtdb, `projects/${pid}`), {
    progress: safe,
    updatedAt: Date.now(),
  });

  return safe;
}

export function getStatusFromProgress(progress) {
  const p = Number(progress ?? 0);

  if (p < 30) return "At risk";
  if (p < 70) return "Minor issues";
  return "On track";
}

/* =========================
Fetch all projects - Fix here!!!!
========================= */
// export async function fetchProjectsMap() {
//   const snapshot = await getDocs(collection(db, "projects"));
//   const projectsMap = {};

//   snapshot.forEach((doc) => {
//     projectsMap[doc.id] = doc.data().projectName;
//   });

//   return projectsMap;
// }
export async function fetchProjectsMap() {
  const snapshot = await get(ref(rtdb, "projects"));

  if (!snapshot.exists()) return {};

  const data = snapshot.val();
  const projectsMap = {};

  Object.keys(data).forEach((projectId) => {
    projectsMap[projectId] = data[projectId].projectName;
  });

  return projectsMap;
}

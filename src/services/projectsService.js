// src/services/projectsService.js
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";

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
 * ✅ Ensures teams/{teamId} exists AND includes current user in memberUids.
 * Required because Firestore Rules check membership via teams/{teamId}.
 */
async function ensureTeamDoc(teamId) {
  const user = getCurrentUserOrThrow();
  const tid = requireStr("teamId", teamId);

  const teamRef = doc(db, "teams", tid);
  const snap = await getDoc(teamRef);

  if (!snap.exists()) {
    await setDoc(teamRef, {
      teamId: tid,
      memberUids: [user.uid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  }

  await updateDoc(teamRef, {
    memberUids: arrayUnion(user.uid),
    updatedAt: serverTimestamp(),
  });

  return true;
}

/**
 * ✅ Throws if the project doesn't belong to this team.
 */
export function assertProjectOwnership(projectData, teamId) {
  const tid = requireStr("teamId", teamId);
  const owner = toStr(projectData?.ownerteamid);

  if (!owner) throw new Error("Project is missing ownerteamid field.");
  if (owner !== tid)
    throw new Error("You don't have permission to view this project.");

  return true;
}

/* =========================
   USERS -> TEAMID
   ========================= */
export async function getTeamIdByUserUid(uid, options = {}) {
  const userUid = requireStr("uid", uid);

  const userSnap = await getDoc(doc(db, "users", userUid));
  if (!userSnap.exists())
    throw new Error("User profile not found (users/{uid}).");

  const teamId = toStr(userSnap.data()?.teamId);
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

  const snap = await getDoc(doc(db, "projects", pid));
  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

export async function getTeamProjectByOwnerTeamId(teamId) {
  const tid = toStr(teamId);
  if (!tid) return null;

  const q = query(
    collection(db, "projects"),
    where("ownerteamid", "==", tid),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createProjectForTeam(data, options = {}) {
  const { preventDuplicate = true, syncLocalStorage = true } = options;

  const teamId = requireStr("teamId", data?.teamId);

  // ✅ ensure teams/{teamId} exists + includes me (for Firestore rules)
  await ensureTeamDoc(teamId);

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

    // ✅ Architecture defaults
    architectureConfig: {},
    architectureUpdatedAt: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "projects"), payload);

  const created = { id: ref.id, ...payload };
  if (syncLocalStorage) localStorage.setItem("projectId", created.id);

  return created;
}

/**
 * ✅ create project for Setup page
 */
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
    { preventDuplicate: true, syncLocalStorage: true }
  );

  return { projectId: created.id, teamId };
}

/* =========================
   ✅ ARCHITECTURE CONFIG
   ========================= */
export async function saveProjectArchitectureConfig(projectId, config) {
  const pid = requireStr("projectId", projectId);
  if (!config || typeof config !== "object")
    throw new Error("Invalid architecture config.");

  const ref = doc(db, "projects", pid);

  await updateDoc(ref, {
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
   PROJECT DOCUMENTS (Firestore)
   ========================= */
export async function getProjectDocuments(projectId, options = {}) {
  const pid = toStr(projectId);
  if (!pid) return [];

  const { orderByField = "createdAt", orderDir = "desc", max = null } = options;

  const colRef = collection(db, "projects", pid, "documents");

  const parts = [orderBy(orderByField, orderDir)];
  if (typeof max === "number" && max > 0) parts.push(limit(max));

  const q = query(colRef, ...parts);

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* =========================
   ✅ SETUP SUBSCRIPTION
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

/* =========================
   ✅ WORKSPACE SUBSCRIPTION
   ========================= */
export function subscribeTeamProjectWorkspace(projectId, { onState } = {}) {
  const emit = (patch) => {
    if (typeof onState === "function") onState(patch);
  };

  emit({ loading: true, error: "", project: null, documents: [] });

  const unsub = onAuthStateChanged(auth, async (user) => {
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

      const projectData = await getProjectById(projectId);
      if (!projectData) {
        emit({
          loading: false,
          error: "Project not found.",
          project: null,
          documents: [],
        });
        return;
      }

      assertProjectOwnership(projectData, teamId);

      const docs = await getProjectDocuments(projectId);

      emit({
        loading: false,
        error: "",
        project: projectData,
        documents: Array.isArray(docs) ? docs : [],
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

  return unsub;
}

/* =========================
   ✅ PROJECT PAGE SUBSCRIPTION (TeamProjectPage.jsx)
   ========================= */
export function subscribeTeamProjectPage(projectId, { onState } = {}) {
  const emit = (patch) => {
    if (typeof onState === "function") onState(patch);
  };

  emit({ loading: true, error: "", project: null });

  const unsub = onAuthStateChanged(auth, async (user) => {
    emit({ loading: true, error: "", project: null });

    try {
      if (!user) {
        emit({ loading: false, redirectTo: "/login" });
        return;
      }

      let teamId = toStr(localStorage.getItem("teamId"));
      if (!teamId) {
        teamId = await getTeamIdByUserUid(user.uid, { syncLocalStorage: true });
      }

      const pid = toStr(projectId);
      if (!pid) {
        emit({ loading: false, error: "Missing project id.", project: null });
        return;
      }

      const p = await getProjectById(pid);
      if (!p) {
        localStorage.removeItem("projectId");
        emit({ loading: false, redirectTo: "/project" });
        return;
      }

      assertProjectOwnership(p, teamId);

      emit({ loading: false, error: "", project: p });
    } catch (err) {
      console.error("TEAM PROJECT PAGE SUBSCRIBE ERROR:", err);
      emit({
        loading: false,
        error: String(err?.message || "Failed to load project data."),
        project: null,
      });
    }
  });

  return unsub;
}

/* =========================
Fetch all projects
========================= */
export async function fetchProjectsMap() {
  const snapshot = await getDocs(collection(db, "projects"));
  const projectsMap = {};

  snapshot.forEach((doc) => {
    projectsMap[doc.id] = doc.data().projectName;
  });

  return projectsMap;
}

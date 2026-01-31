/**
 * documentService (RTDB)
 *
 * Handles document management for both weekly course materials
 * and project-level documents using Firebase Realtime Database.
 *
 * Features:
 * - Upload, list, subscribe, and delete weekly documents
 * - Extract and store text content for AI processing (Gemini)
 * - Store original files as Base64 dataUrls for download/view
 * - Manage project documents under projects/{projectId}
 *
 * Design notes:
 * - Files are stored as Base64 (size-limited) directly in RTDB
 * - Intended only for small documents (not large binaries)
 * - Week paths are normalized as: weeks/week_{n}/materials
 *
 * Data structures:
 * - /weeks/week_{n}/materials/{docId}
 * - /projects/{projectId}/documents/{docId}
 */

import { rtdb, auth } from "../firebase";
import {
  ref,
  get,
  set,
  push,
  remove,
  update,
  serverTimestamp,
  onValue,
} from "firebase/database";
import { extractTextFromFile } from "../utils/textExtraction";

/* =========================
   Helpers
   ========================= */
const toStr = (v) => String(v ?? "").trim();

function requireAuth() {
  const u = auth?.currentUser;
  if (!u) throw new Error("You must be logged in.");
  return u;
}

function weekIdFromNumber(week) {
  const w = Number(week);
  if (!Number.isFinite(w) || w <= 0) throw new Error("Invalid week value.");
  return `week_${w}`;
}

function materialsPath(week) {
  return `weeks/${weekIdFromNumber(week)}/materials`;
}

// ✅ RTDB-safe timestamp (number)
const now = () => Date.now();

/* =========================
   ✅ Base64 helper
   ========================= */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

// ✅ keep small (RTDB is NOT for large files)
const MAX_FILE_BYTES = 200 * 1024; // 200KB

/* =========================
   ✅ WEEK MATERIALS
   ========================= */

/**
 * Upload week documents:
 * - extract text (for Gemini)
 * - save ALSO the original file as dataUrl (for download/open)
 */
export async function uploadWeekDocuments(week, files) {
  const user = requireAuth();
  if (!files || files.length === 0) return true;

  const baseRef = ref(rtdb, materialsPath(week));

  for (const file of files) {
    const fileName = toStr(file?.name);
    const mimeType = toStr(file?.type) || "application/octet-stream";
    const size = Number(file?.size || 0);

    if (!fileName) throw new Error("Invalid file name.");
    if (size <= 0) throw new Error("Invalid file.");
    if (size > MAX_FILE_BYTES) {
      throw new Error(
        `File too large. Max allowed is ${Math.round(MAX_FILE_BYTES / 1024)}KB.`,
      );
    }

    // Extract text from file (pdf/docx/pptx/txt)
    const text = toStr(await extractTextFromFile(file));
    const safeText = text.slice(0, 350000);

    // ✅ Save file itself for download
    const dataUrl = await fileToDataUrl(file);

    const docRef = push(baseRef);
    await set(docRef, {
      fileName,
      mimeType,
      size,
      dataUrl, // ✅ for download
      text: safeText, // ✅ for Gemini
      uploadedAt: now(),
      uploadedBy: user.uid,
    });
  }

  return true;
}

export async function listWeekDocuments(week) {
  requireAuth();

  const snap = await get(ref(rtdb, materialsPath(week)));
  if (!snap.exists()) return [];

  const obj = snap.val() || {};
  const arr = Object.entries(obj).map(([id, data]) => ({
    id,
    ...(data || {}),
  }));

  // sort by uploadedAt desc
  arr.sort((a, b) => Number(b.uploadedAt || 0) - Number(a.uploadedAt || 0));
  return arr;
}

export function subscribeWeekDocuments(week, { onState } = {}) {
  requireAuth();

  const docsRef = ref(rtdb, materialsPath(week));

  const unsub = onValue(
    docsRef,
    (snap) => {
      if (!snap.exists()) {
        onState?.({ documents: [] });
        return;
      }

      const obj = snap.val() || {};
      const arr = Object.entries(obj).map(([id, data]) => ({
        id,
        ...(data || {}),
      }));

      arr.sort((a, b) => Number(b.uploadedAt || 0) - Number(a.uploadedAt || 0));
      onState?.({ documents: arr });
    },
    (err) => {
      console.error("WEEK DOCS SUBSCRIBE ERROR:", err);
      onState?.({
        error: String(err?.message || "Failed to load week documents."),
      });
    },
  );

  return unsub;
}

export async function deleteWeekDocument(week, documentId) {
  requireAuth();
  const id = toStr(documentId);
  if (!id) throw new Error("Missing documentId");

  await remove(ref(rtdb, `${materialsPath(week)}/${id}`));
  return true;
}

export async function getWeekSourceText(week) {
  requireAuth();

  const docs = await listWeekDocuments(week);
  return docs
    .map((d) => `Source: ${toStr(d.fileName)}\n${toStr(d.text)}`)
    .join("\n\n");
}

/* ============================================================
   ✅ PROJECT DOCUMENTS (Base64 inside RTDB)
   /projects/{projectId}/documents/{docId}
   ============================================================ */

export async function getProjectDocuments(projectId) {
  const pid = toStr(projectId);
  if (!pid) return [];

  const docsRef = ref(rtdb, `projects/${pid}/documents`);
  const snap = await get(docsRef);

  if (!snap.exists()) return [];
  const obj = snap.val() || {};
  return Object.entries(obj).map(([id, val]) => ({ id, ...(val || {}) }));
}

export function subscribeProjectDocuments(projectId, { onState } = {}) {
  requireAuth();
  const pid = toStr(projectId);
  if (!pid) throw new Error("Missing projectId");

  const docsRef = ref(rtdb, `projects/${pid}/documents`);

  const unsub = onValue(
    docsRef,
    (snap) => {
      if (!snap.exists()) {
        onState?.({ documents: [] });
        return;
      }

      const obj = snap.val() || {};
      const arr = Object.entries(obj).map(([id, v]) => ({ id, ...(v || {}) }));

      // newest first (createdAt/uploadedAt/updatedAt)
      arr.sort(
        (a, b) =>
          Number(b?.createdAt || b?.uploadedAt || b?.updatedAt || 0) -
          Number(a?.createdAt || a?.uploadedAt || a?.updatedAt || 0),
      );

      onState?.({ documents: arr });
    },
    (err) => {
      console.error("PROJECT DOCS SUBSCRIBE ERROR:", err);
      onState?.({
        error: String(err?.message || "Failed to load project documents."),
      });
    },
  );

  return unsub;
}

export async function uploadProjectDocumentBase64(projectId, file) {
  const user = requireAuth();
  const pid = toStr(projectId);
  if (!pid) throw new Error("Missing projectId");
  if (!file) throw new Error("No file selected.");

  const size = Number(file.size || 0);
  if (size <= 0) throw new Error("Invalid file.");
  if (size > MAX_FILE_BYTES) {
    throw new Error(
      `File too large. Max allowed is ${Math.round(MAX_FILE_BYTES / 1024)}KB.`,
    );
  }

  const safeName = String(file.name || "file").trim();
  const contentType = String(file.type || "");

  const docsBaseRef = ref(rtdb, `projects/${pid}/documents`);
  const docRef = push(docsBaseRef);
  const docId = docRef.key;

  const dataUrl = await fileToDataUrl(file);

  const payload = {
    title: safeName,
    fileName: safeName,
    contentType,
    size,
    dataUrl,
    uploadedBy: user.uid,
    createdAt: serverTimestamp(),
  };

  await set(docRef, payload);
  await update(ref(rtdb, `projects/${pid}`), { updatedAt: serverTimestamp() });

  return { id: docId, ...payload };
}

export async function deleteProjectDocument(projectId, docId) {
  requireAuth();
  const pid = toStr(projectId);
  const did = toStr(docId);
  if (!pid) throw new Error("Missing projectId");
  if (!did) throw new Error("Missing docId");

  await remove(ref(rtdb, `projects/${pid}/documents/${did}`));
  await update(ref(rtdb, `projects/${pid}`), { updatedAt: serverTimestamp() });

  return true;
}

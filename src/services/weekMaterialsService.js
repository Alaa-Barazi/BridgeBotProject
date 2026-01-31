/**
 * weekMaterialsService (Firestore)
 *
 * Service layer for managing weekly learning materials stored in Firestore.
 * Each week has its own subcollection under:
 *   /weeks/{weekId}/materials
 *
 * Responsibilities:
 * - List materials for a given week, ordered by creation time
 * - Create a new material document (metadata only)
 * - Update material metadata (title, storage path, download URL, etc.)
 * - Delete a material document
 *
 * Notes:
 * - This service handles Firestore documents only
 * - File upload and deletion are handled separately (e.g. via Storage services)
 * - Timestamps are managed using Firestore serverTimestamp
 */

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export async function listWeekMaterials(weekId) {
  const q = query(
    collection(db, "weeks", String(weekId), "materials"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createMaterialDoc(weekId, data) {
  const ref = await addDoc(
    collection(db, "weeks", String(weekId), "materials"),
    {
      weekId: String(weekId),
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
  return ref.id;
}

export async function updateMaterialDoc(weekId, materialId, data) {
  await updateDoc(doc(db, "weeks", String(weekId), "materials", materialId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMaterialDoc(weekId, materialId) {
  await deleteDoc(doc(db, "weeks", String(weekId), "materials", materialId));
}

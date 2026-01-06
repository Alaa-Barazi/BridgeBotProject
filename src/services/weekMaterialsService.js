import { db } from "../firebase";
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
    orderBy("createdAt", "desc")
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
    }
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

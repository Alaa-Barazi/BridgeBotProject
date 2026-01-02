import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  generateDictionaryWithGemini,
  editTextWithGemini,
} from "./geminiService";
import { getWeekSourceText } from "./documentService";

export async function generateWeekDictionary(week) {
  const sourceText = getWeekSourceText(week);
  if (!sourceText.trim()) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateDictionaryWithGemini({
    week,
    sourceText,
  });

  const dictRef = collection(db, "weeks", `week_${week}`, "dictionary");

  for (const item of generated) {
    const entryRef = doc(dictRef);
    await setDoc(entryRef, {
      term: item.term,
      definition: item.definition,
      category: item.category || "IoT",
      createdAt: serverTimestamp(),
    });
  }
}

export async function listWeekDictionary(week) {
  const dictRef = collection(db, "weeks", `week_${week}`, "dictionary");
  const snapshot = await getDocs(dictRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function applyDefinitionEdit(entryId, instruction, week) {
  const entryRef = doc(db, "weeks", `week_${week}`, "dictionary", entryId);

  const updated = await editTextWithGemini({
    originalText: instruction.originalText,
    instruction: instruction.text,
    mode: "dictionary",
  });

  await setDoc(entryRef, { definition: updated }, { merge: true });

  return updated;
}

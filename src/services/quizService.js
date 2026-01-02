import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { generateQuizWithGemini, editTextWithGemini } from "./geminiService";
import { getWeekSourceText } from "./documentService";

export async function generateWeekQuiz(week) {
  const sourceText = getWeekSourceText(week);
  if (!sourceText.trim()) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateQuizWithGemini({
    week,
    sourceText,
  });

  const quizRef = collection(db, "weeks", `week_${week}`, "quiz");

  for (const item of generated) {
    const qRef = doc(quizRef);
    await setDoc(qRef, {
      question: item.question,
      difficulty: "medium",
      createdAt: serverTimestamp(),
    });
  }
}

export async function listWeekQuiz(week) {
  const quizRef = collection(db, "weeks", `week_${week}`, "quiz");
  const snapshot = await getDocs(quizRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function applyQuizEdit(questionId, instruction, week) {
  const qRef = doc(db, "weeks", `week_${week}`, "quiz", questionId);

  const updated = await editTextWithGemini({
    originalText: instruction.originalText,
    instruction: instruction.text,
    mode: "quiz",
  });

  await setDoc(qRef, { question: updated }, { merge: true });

  return updated;
}

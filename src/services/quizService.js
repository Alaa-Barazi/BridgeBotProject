import { getWeekSourceText } from "./documentService";
import { generateQuizWithGemini, editTextWithGemini } from "./geminiService";

let quizzesByWeek = {};
let questionIdCounter = 1;

function delay(result, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function generateWeekQuiz(week) {
  const sourceText = getWeekSourceText(week);

  if (!sourceText.trim()) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateQuizWithGemini({
    week,
    sourceText,
  });

  quizzesByWeek[week] = generated.map((item) => ({
    id: String(questionIdCounter++),
    week,
    question: item.question,
    difficulty: "medium",
    createdAt: new Date().toISOString(),
  }));

  return delay({ success: true });
}

export async function listWeekQuiz(week) {
  return delay(quizzesByWeek[week] || []);
}

export async function applyQuizEdit(questionId, instruction) {
  for (const week in quizzesByWeek) {
    const idx = quizzesByWeek[week].findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      const original = quizzesByWeek[week][idx].question;

      const updated = await editTextWithGemini({
        originalText: original,
        instruction,
        mode: "quiz",
      });

      quizzesByWeek[week][idx].question = updated;
      return quizzesByWeek[week][idx];
    }
  }

  throw new Error("Question not found");
}

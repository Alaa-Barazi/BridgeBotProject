import { getWeekSourceText } from "./documentService";
import {
  generateDictionaryWithGemini,
  editTextWithGemini,
} from "./geminiService";

let dictionaryByWeek = {};
let entryIdCounter = 1;

function delay(result, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function generateWeekDictionary(week) {
  const sourceText = getWeekSourceText(week);

  if (!sourceText.trim()) {
    throw new Error("No documents uploaded for this week");
  }

  const generated = await generateDictionaryWithGemini({
    week,
    sourceText,
  });

  dictionaryByWeek[week] = generated.map((item) => ({
    id: String(entryIdCounter++),
    week,
    term: item.term,
    definition: item.definition,
    createdAt: new Date().toISOString(),
  }));

  return delay({ success: true });
}

export async function listWeekDictionary(week) {
  return delay(dictionaryByWeek[week] || []);
}

export async function applyDefinitionEdit(entryId, instruction) {
  for (const week in dictionaryByWeek) {
    const idx = dictionaryByWeek[week].findIndex((e) => e.id === entryId);
    if (idx !== -1) {
      const original = dictionaryByWeek[week][idx].definition;

      const updated = await editTextWithGemini({
        originalText: original,
        instruction,
        mode: "dictionary",
      });

      dictionaryByWeek[week][idx].definition = updated;
      return dictionaryByWeek[week][idx];
    }
  }

  throw new Error("Definition not found");
}

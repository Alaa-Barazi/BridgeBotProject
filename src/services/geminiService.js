import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function editTextWithGemini({
  originalText,
  instruction,
  mode, // "quiz" | "dictionary"
}) {
  const systemPrompt =
    mode === "quiz"
      ? `You are an academic quiz editor.
You will receive an existing question and an instruction.
Rewrite the question accordingly.
Return ONLY the updated question text.`
      : `You are an academic dictionary editor.
You will receive an existing definition and an instruction.
Rewrite the definition accordingly.
Return ONLY the updated definition text.`;

  const prompt = `
${systemPrompt}

ORIGINAL:
"${originalText}"

INSTRUCTION:
"${instruction}"
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateQuizWithGemini({ week, sourceText }) {
  const prompt = `
You are an academic quiz generator.

TASK:
Generate exactly 10 quiz questions for Week ${week}.
Questions should be clear, concise, and suitable for engineering students.

RULES:
- Return ONLY a JSON array
- Each item must be an object: { "question": "text" }
- No explanations
- No markdown

SOURCE MATERIAL:
"""
${sourceText}
"""
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  return JSON.parse(text);
}

export async function generateDictionaryWithGemini({ week, sourceText }) {
  const prompt = `
You are an academic dictionary generator.

TASK:
Generate a technical dictionary for Week ${week}.

RULES:
- Return ONLY a JSON array
- Each item must be: { "term": "...", "definition": "..." }
- Definitions should be short and student friendly
- No markdown
- No explanations

SOURCE MATERIAL:
"""
${sourceText}
"""
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  return JSON.parse(text);
}

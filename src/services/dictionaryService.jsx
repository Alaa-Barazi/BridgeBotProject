import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const DICTIONARY_PROMPT = `
You are BridgeBot, an IoT course assistant for Mechanical Engineering students.

TASK:
Generate a dictionary (glossary) of important IoT terms for students.

REQUIREMENTS:
- Audience: Mechanical Engineering students
- Course: Introduction to IoT
- Focus on practical understanding
- Keep definitions short and clear (1-2 sentences)
- Avoid unnecessary jargon

OUTPUT RULES:
- Generate 18-24 terms
- Each term must include:
  - term
  - definition
  - category (Sensors | Communication | Controllers | Cloud | Data | Software | Hardware)
  - level (basic | intermediate | advanced)

OUTPUT FORMAT:
Return ONLY valid JSON array in this exact structure:

[
  {
    "term": "string",
    "definition": "string",
    "category": "string",
    "level": "basic | intermediate | advanced"
  }
]
`;

const safeJsonParse = (text) => {
  const cleaned = String(text)
    .replace(/```json|```/g, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array found");
  return JSON.parse(cleaned.slice(start, end + 1));
};

export async function generateDictionaryTerms() {
  if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(DICTIONARY_PROMPT);
  const raw = result.response.text();

  const terms = safeJsonParse(raw);

  // Minimal cleanup + safety
  return terms
    .filter((t) => t?.term && t?.definition)
    .map((t) => ({
      term: String(t.term).trim(),
      definition: String(t.definition).trim(),
      category: String(t.category || "Other").trim(),
      level: String(t.level || "basic").trim(),
    }));
}

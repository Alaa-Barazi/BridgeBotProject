import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, PROJECT_CONTEXT } from "../prompts/bridgebotPrompt";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

export async function sendMessage(userMessage) {
  try {
    const prompt = `
${SYSTEM_PROMPT}

${PROJECT_CONTEXT}

User question:
${userMessage}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();

  } catch (err) {
    console.error("Gemini error:", err);
    return "BridgeBot: Gemini API error. Check console.";
  }
}

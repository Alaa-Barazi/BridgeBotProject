import { Send, Maximize2, Minimize2 } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockProjectExample } from "../../mock/mockProject";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatPanel = forwardRef(function ChatPanel(
  {
    pageContext = "project",
    quizMode = false,
    onQuizEvent = null,
    projectContext = {
      projectName: "Unknown Project",
      stage: "general",
    },
  },
  ref
) {
  projectContext = mockProjectExample;
  const { projectName, stage } = projectContext;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const bottomRef = useRef(null);

  const askGemini = async (userText) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Model kept exactly as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const QUIZ_PROMPT = `
You are BridgeBot acting as an adaptive IoT quiz examiner
for Mechanical Engineering students taking an IoT course.

Rules:
- Ask ONE clear question at a time
- If answer is "START_QUIZ", generate the first easy question
- If answer is wrong: explain briefly and simplify next question
- If answer is correct: confirm and make next question slightly harder

Respond ONLY in JSON format:
{
  "question": "string",
  "isCorrect": true | false | null,
  "correctAnswer": "string",
  "explanation": "string",
  "difficulty": "easy | medium | hard"
}

Student answer: "${userText}"


When evaluating the student's answer:

- Focus on conceptual understanding, not exact wording
- Minor spelling mistakes, missing articles, or word order errors should NOT affect correctness
- If the idea is mostly correct, mark it as correct
- If partially correct, explain what is missing
- If incorrect, explain briefly why

Do NOT be strict about spelling.
Do NOT require exact definitions.

`;

    const PROJECT_PROMPT = `Mentor prompt... ${userText}`;

    const result = await model.generateContent(
      quizMode ? QUIZ_PROMPT : PROJECT_PROMPT
    );

    return result.response.text();
  };

  // 🔥 EXPOSE FUNCTION TO PARENT
  useImperativeHandle(ref, () => ({
    submitQuizAnswer: async (answer) => {
      setThinking(true);
      try {
        const reply = await askGemini(answer);
        // FIX: Remove markdown formatting if Gemini includes it (```json ... ```)
        const cleanedJson = reply.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        onQuizEvent?.(parsed);
      } catch (e) {
        console.error("Quiz logic error:", e);
      }
      setThinking(false);
    },
  }));

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    setMessages((p) => [...p, { role: "user", text }]);
    setThinking(true);
    try {
      const reply = await askGemini(text);
      setMessages((p) => [...p, { role: "bot", text: reply }]);
    } catch {
      setMessages((p) => [...p, { role: "bot", text: "Error occurred." }]);
    }
    setThinking(false);
  };

  // 🔥 FIX: Returning null kills the component. Returning a hidden div keeps it alive.
  if (quizMode) {
    return <div className="hidden pointer-events-none" aria-hidden="true" />;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${
        expanded ? "w-105 h-140" : "w-85 h-110"
      }`}
    >
      <div className="flex flex-col h-full bg-white border rounded-xl shadow-lg">
        <div className="flex justify-between items-center px-4 py-3 bg-blue-300 rounded-t-xl">
          <div>
            <h4 className="text-sm font-semibold">🤖 BridgeBot</h4>
            <p className="text-xs">
              {projectName} • {stage}
            </p>
          </div>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded text-sm max-w-[85%] ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-100"
              }`}
            >
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className="text-xs text-gray-500 animate-pulse">
              BridgeBot is thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask BridgeBot..."
            className="flex-1 px-3 py-2 text-sm border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-3 rounded"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatPanel;

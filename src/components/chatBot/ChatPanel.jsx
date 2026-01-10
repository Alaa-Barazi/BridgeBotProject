/**
 * Component: ChatPanel
 *  Floating, collapsible chatbot interface for the BridgeBot application.
 * - Multimodal support (Text + Image uploads).
 * - UI States: Minimized (Launcher), Expanded (Panel), and Fullscreen.
 * - Context-aware prompting based on the current project stage.

 */
import {
  Send,
  Maximize2,
  Minimize2,
  Minus,
  MessageCircle,
  X,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockProjectExample } from "../../mock/mockProject";
import { useSearchParams, useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectsService";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatPanel = forwardRef(function ChatPanel(
  {
    pageContext = "project",
    quizMode = false,
    onQuizEvent = null,
    initialProjectContext = {
      projectName: "Loading...",
      stage: "general",
    },
  },
  ref
) {
  const lastGeminiCallRef = useRef(0);
  const GEMINI_COOLDOWN_MS = 12000;
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  // existing expand state (Standard vs Large)
  const [expanded, setExpanded] = useState(false);
  // NEW: open state (Visible vs Hidden Bubble)
  const [isOpen, setIsOpen] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [projectContext, setProjectContext] = useState(initialProjectContext);
  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        if (data) {
          setProjectContext(data);
        }
      } catch (error) {
        console.error("Failed to load project context", error);
      }
    };

    fetchProject();
  }, [projectId]);
  const { projectName, stage } = projectContext;

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, thinking, isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        resolve({
          inlineData: { data: base64Data, mimeType: file.type },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const askGemini = async (userText) => {
    const now = Date.now();
    if (now - lastGeminiCallRef.current < GEMINI_COOLDOWN_MS) {
      throw new Error("Please wait a moment before the next question");
    }
    lastGeminiCallRef.current = now;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const buildQuizPrompt = (payload) => {
      if (typeof payload === "object" && payload.question && payload.answer) {
        return `
You are a supportive course mentor.

TASK:
Evaluate the student's answer and help them understand the concept.

QUESTION:
${payload.question}

STUDENT ANSWER:
${payload.answer}

INSTRUCTIONS:
- Clearly state whether the answer is correct or incorrect
- If incorrect, explain why and provide the correct concept
- If partially correct, acknowledge what is right and clarify what is missing
- Keep the explanation concise and educational
- Do not mention grades or scores
- Do not ask a follow-up question

RETURN ONLY VALID JSON:
{
  "isCorrect": true or false,
  "explanation": "clear, student-friendly explanation"
}
`;
      }
      return `Adaptive IoT quiz examiner. STUDENT MESSAGE: "${payload}". Return JSON.`;
    };

    const PROJECT_PROMPT = `Engineering mentor rules... Project: ${projectName}, Stage: ${stage}, User message: "${userText}"`;
    const prompt = quizMode ? buildQuizPrompt(userText) : PROJECT_PROMPT;

    let payload = [prompt];
    if (imageFile && !quizMode) {
      const imagePart = await fileToGenerativePart(imageFile);
      payload.push(imagePart);
    }

    const result = await model.generateContent(payload);
    return result.response.text();
  };

  useImperativeHandle(ref, () => ({
    submitQuizAnswer: async (answer) => {
      if (thinking) return;
      setThinking(true);
      // If the chat is closed when a quiz event happens, open it
      setIsOpen(true);
      try {
        const reply = await askGemini(answer);
        const cleanedJson = reply.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        onQuizEvent?.(parsed);
      } catch (e) {
        setMessages((p) => [
          ...p,
          { role: "bot", text: "Error processing quiz answer." },
        ]);
      } finally {
        setThinking(false);
      }
    },
    // Allow parent to open chat programmatically
    openChat: () => setIsOpen(true),
  }));

  const sendMessage = async () => {
    if (!input.trim() && !imageFile) return;
    const text = input;
    const currentImage = imagePreview;

    setInput("");
    setMessages((p) => [...p, { role: "user", text, imageUrl: currentImage }]);
    setThinking(true);

    try {
      const reply = await askGemini(text);
      setMessages((p) => [...p, { role: "bot", text: reply }]);
      clearImage();
    } catch (e) {
      setMessages((p) => [...p, { role: "bot", text: "Error: " + e.message }]);
    } finally {
      setThinking(false);
    }
  };

  if (quizMode) {
    return <div className="hidden pointer-events-none" aria-hidden="true" />;
  }

  // 🔥 RENDER STATE 1: Launcher Button (Closed)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-fade-in"
        aria-label="Open BridgeBot"
      >
        <MessageCircle size={32} />
        {/* Optional Notification Badge */}
        {messages.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
        )}
      </button>
    );
  }

  // 🔥 RENDER STATE 2: Open Chat Panel
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        expanded ? "w-105 h-140" : "w-85 h-110"
      }`}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-blue-300 dark:bg-blue-900 rounded-t-xl transition-colors">
          <div className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h4 className="text-sm font-semibold leading-tight">BridgeBot</h4>
              <p className="text-[10px] opacity-80 leading-tight">
                {projectName}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1">
            {/* Shrink / Minimize to Bubble Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-400 dark:hover:bg-blue-800 rounded p-1 transition text-gray-900 dark:text-gray-100"
              title="Minimize"
            >
              <Minus size={18} />
            </button>

            {/* Expand / Resize Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:bg-blue-400 dark:hover:bg-blue-800 rounded p-1 transition text-gray-900 dark:text-gray-100"
              title={expanded ? "Restore Size" : "Maximize"}
            >
              {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-950 transition-colors">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
              <p>Hello! I'm your project mentor.</p>
              <p>Ask me anything about {projectName}.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[85%] shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {m.text}
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    className="mt-2 rounded max-h-32 border dark:border-gray-600"
                    alt="Sent"
                  />
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="text-xs text-gray-400 animate-pulse italic">
              BridgeBot is analyzing...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 p-3 border-t dark:border-gray-700 transition-colors">
          {imagePreview && (
            <div className="relative inline-block mb-2 group">
              <img
                src={imagePreview}
                className="h-16 w-16 object-cover rounded border-2 border-blue-500"
                alt="Preview"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            >
              📎
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-sm border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md transition shadow-md flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatPanel;

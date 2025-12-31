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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

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

  // 🔥 Browser-compatible Base64 converter
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
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const QUIZ_PROMPT = `Adaptive IoT quiz examiner rules... Student answer: "${userText}"`;

    const PROJECT_PROMPT = `Engineering mentor rules... Project: ${projectName}, Stage: ${stage}, User message: "${userText}"`;

    const prompt = quizMode ? QUIZ_PROMPT : PROJECT_PROMPT;

    // 🔥 Fix: Correct structure for Multi-modal (Text + Image)
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
      setThinking(true);
      try {
        const reply = await askGemini(answer);
        const cleanedJson = reply.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        onQuizEvent?.(parsed);
      } catch (e) {
        console.error("Quiz logic error:", e);
      } finally {
        setThinking(false);
      }
    },
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
      clearImage(); // Clear image after successful send
    } catch (e) {
      setMessages((p) => [...p, { role: "bot", text: "Error: " + e.message }]);
    } finally {
      setThinking(false);
    }
  };

  if (quizMode) {
    return <div className="hidden pointer-events-none" aria-hidden="true" />;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all ${
        expanded ? "w-105 h-140" : "w-85 h-110"
      }`}
    >
      <div className="flex flex-col h-full bg-white border rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-blue-300 rounded-t-xl">
          <div className="dark:text-gray-900">
            <h4 className="text-sm font-semibold">🤖 BridgeBot</h4>
            <p className="text-xs opacity-80">
              {projectName} • {stage}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="hover:bg-blue-400 rounded p-1 transition"
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                {m.text}
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    className="mt-2 rounded max-h-32 border"
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
        <div className="bg-white p-3 border-t">
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
                ✕
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
              className="p-2 text-gray-500 hover:bg-gray-100 rounded transition"
            >
              📎
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Describe your hardware or ask a question..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md transition shadow-md"
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

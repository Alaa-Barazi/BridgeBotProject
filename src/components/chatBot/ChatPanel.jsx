// bg-blue-300 dark:bg-blue-50 rounded-t-xl
import { Send, Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useParams } from "react-router-dom";
import { mockProjectExample, mockProjectNone } from "../../mock/mockProject";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function ChatPanel({
  pageContext = "project",
  projectContext = {
    projectName: "Unknown Project",
    category: "General",
    stage: "general",
  },
}) {
  const { projectId } = useParams();
  //Get project BY it's ID from the mockProject File
  projectContext = mockProjectExample;
  
  const { projectName, category, stage } = projectContext;

  console.log("ChatPanel projectContext:", projectContext);

  const storageKey = "bridgebot_chat_global";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [thinking, setThinking] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load chat
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  // Persist chat
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  // === GEMINI CALL ===
  const askGemini = async (userText, hasImage) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are BridgeBot, an AI mentor for multidisciplinary engineering student projects.

PROJECT CONTEXT:
- Project name: ${projectContext.projectName}
- Category: ${projectContext.category}
- Current stage: ${projectContext.stage}

PAGE CONTEXT:
${pageContext}

IMAGE UPLOADED:
${hasImage ? "YES" : "NO"}

USER MESSAGE:
"${userText}"

BEHAVIOR RULES:
- Adapt advice to the current project stage
- Be concise and practical
- Ask 1-2 relevant follow-up questions
- Do not explain everything at once
- If stage is "requirements": focus on clarification and scope
- If stage is "architecture": suggest components and structure
- If stage is "notes": summarize and reflect
- If an image was uploaded, acknowledge it but do not analyze it yet
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const sendMessage = async () => {
    if (!input.trim() && !imageFile) return;

    const userMessage = {
      role: "user",
      text: input,
      imageUrl: imagePreview,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setThinking(true);

    try {
      const reply = await askGemini(input, !!imageFile);

      const botMessage = {
        role: "bot",
        text: reply,
        imageUrl: null,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I ran into an issue answering that. Please try again.",
          imageUrl: null,
          timestamp: Date.now() + 1,
        },
      ]);
    }

    setThinking(false);
    removeImage();
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all ${
        expanded ? "w-105 h-140" : "w-85 h-110"
      }`}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700 bg-blue-300 dark:bg-blue-50 rounded-t-xl">
          <div>
            <h4 className="text-sm font-semibold dark:text-white">
              🤖 BridgeBot
            </h4>
            <p className="text-xs text-gray-600">
              {projectContext.projectName} • {projectContext.stage}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-100 dark:bg-gray-800 dark:text-white"
              }`}
            >
              {msg.text}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="uploaded"
                  className="mt-2 rounded-md max-h-40"
                />
              )}
            </div>
          ))}
          {thinking && (
            <div className="text-xs text-gray-500 animate-pulse">
              BridgeBot is thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="px-4 pb-2">
            <img src={imagePreview} className="h-20 rounded border" />
          </div>
        )}

        {/* INPUT */}
        <div className="border-t dark:border-gray-700 p-3 flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            📎
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BridgeBot..."
            className="flex-1 px-3 py-2 text-sm border rounded dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

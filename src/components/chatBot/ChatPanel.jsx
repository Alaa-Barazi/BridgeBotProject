import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;

const ChatPanel = ({ pageContext = "general" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isExpanded]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
You are BridgeBot, an IoT mentor for engineering students.

PAGE CONTEXT:
${pageContext}

CONVERSATION:
${messages.map((m) => `${m.role}: ${m.text}`).join("\n")}

USER:
${input}

RULES:
- Be concise
- Prefer guidance over solutions
- Ask clarifying questions
- Avoid repetition
`;

      const result = await model.generateContent(prompt);
      const botText = result.response.text();

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "BridgeBot encountered an error." },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isExpanded ? "w-[520px] h-[680px]" : "w-[360px] h-[420px]"
      }`}
    >
      <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              🤖 BridgeBot
            </div>
            <div className="text-xs text-slate-500">Context: {pageContext}</div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isExpanded ? "Shrink" : "Expand"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] p-3 rounded-lg ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200"
              }`}
            >
              {m.text}
            </div>
          ))}

          {isThinking && (
            <div className="text-xs text-slate-400 animate-pulse">
              BridgeBot is thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BridgeBot..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={isThinking}
            className="px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

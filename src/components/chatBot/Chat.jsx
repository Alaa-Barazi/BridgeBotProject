import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ActionButton from "../common/ActionButton";

const API_KEY = import.meta.env.VITE_API_KEY;

const Chat = () => {
  const { pageContext } = useOutletContext();

  const [history, setHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [mode, setMode] = useState("GENERAL"); //Mode: GENERAL,REQUIREMENTS,ARCHITECTURE,DEBUGGING

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isThinking]);

  const askBridgeBot = async (message) => {
    if (!message.trim()) return;

    setHasStarted(true);
    setIsThinking(true);

    setHistory((prev) => [...prev, { role: "user", text: message }]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
You are BridgeBot, an AI mentor for multidisciplinary engineering student teams.



CURRENT PAGE CONTEXT:
${pageContext}

Behavior rules:
- architecture -> discuss blocks, data flow, interfaces
- project -> discuss requirements, risks, milestones
- quiz -> ask questions, do NOT explain
- general -> guide with questions


CURRENT MODE: ${mode}

MODE DEFINITIONS:
- GENERAL: Broad guidance, onboarding, clarifying questions.
- REQUIREMENTS: Focus on functional and non-functional requirements.
- ARCHITECTURE: Focus on system blocks, data flow, interfaces, protocols.
- DEBUGGING: Focus on hypotheses, isolation steps, testing strategy.

CONVERSATION HISTORY:
${JSON.stringify(history)}

USER MESSAGE:
"${message}"

TASK:
Respond according to CURRENT MODE.

GENERAL MODE:
- Explain concepts simply
- Ask guiding questions

REQUIREMENTS MODE:
- Separate functional vs non-functional requirements
- Use requirement-style language (shall, should)
- Avoid implementation details

ARCHITECTURE MODE:
- Describe components, connections, data flow
- Mention protocols, interfaces, responsibilities
- Think in diagrams and layers

DEBUGGING MODE:
- Suggest possible causes
- Propose experiments or checks
- Narrow down the problem step by step

RESPONSE FORMAT (MANDATORY):
PART 1 - SHORT ANSWER:
- Max 3 bullet points
- One line each

PART 2 - FOLLOW-UP QUESTIONS:
- Ask exactly 2 short questions

Do NOT write long explanations unless the user explicitly asks to expand or explain more.

OUTPUT JSON ONLY:
{
  "botMessage": "string"
}
`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text());

      const formatBotMessage = (msg) => {
        if (typeof msg === "string") return msg;

        let output = "";

        if (msg["PART 1 - SHORT ANSWER"]) {
          output += "PART 1 - SHORT ANSWER:\n";
          msg["PART 1 - SHORT ANSWER"].forEach((b) => {
            output += `• ${b}\n`;
          });
          output += "\n";
        }

        if (msg["PART 2 - FOLLOW-UP QUESTIONS"]) {
          output += "PART 2 - FOLLOW-UP QUESTIONS:\n";
          msg["PART 2 - FOLLOW-UP QUESTIONS"].forEach((q) => {
            output += `• ${q}\n`;
          });
        }

        return output.trim();
      };

      setHistory((prev) => [
        ...prev,
        { role: "bot", text: formatBotMessage(data.botMessage) },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* LANDING STATE */}
        {!hasStarted && (
          <div className="max-w-xl mx-auto mt-24 text-center space-y-6">
            🤖
            <h2 className="text-xl font-semibold">Start a Conversation</h2>
            <div>
              Modes:
              <ActionButton
                text="General"
                onClick={() => {
                  setMode("GENERAL");
                  askBridgeBot(
                    "Help me with a general question about my IoT project."
                  );
                }}
              />
              <ActionButton
                text="Requirements"
                onClick={() => {
                  setMode("REQUIREMENTS");
                  askBridgeBot(
                    "Help me with the requirements for my IoT project."
                  );
                }}
              />
              <ActionButton
                text="ARCHITECTURE"
                onClick={() => {
                  setMode("ARCHITECTURE");
                  askBridgeBot("Help me design my system architecture.");
                }}
              />
              <ActionButton
                text="DEBUGGING"
                onClick={() => {
                  setMode("DEBUGGING");
                  askBridgeBot("Help me debug my IoT project.");
                }}
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              BridgeBot helps you think through IoT design decisions using
              guided questions and practical engineering insight.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                "How do I choose the right microcontroller?",
                "My sensor readings are unstable",
                "Help me design my system architecture",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => askBridgeBot(q)}
                  className="
                    px-4 py-2 rounded-lg border
                    border-slate-300 dark:border-slate-700
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    text-sm transition
                  "
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT STATE */}
        {hasStarted && (
          <div className="space-y-5 max-w-3xl mx-auto">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[75%] px-4 py-3 rounded-xl text-sm
                    whitespace-pre-line leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm animate-pulse">
                  🤖 BridgeBot is thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask BridgeBot about your IoT project…"
            className="
              flex-1 px-4 py-3 rounded-lg
              bg-white dark:bg-slate-900
              border border-slate-300 dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
              text-sm
            "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askBridgeBot(userInput);
                setUserInput("");
              }
            }}
          />
          <button
            onClick={() => {
              askBridgeBot(userInput);
              setUserInput("");
            }}
            disabled={isThinking}
            className="
              px-5 rounded-lg text-white text-sm
              bg-blue-600 hover:bg-blue-500
              disabled:opacity-50 transition
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

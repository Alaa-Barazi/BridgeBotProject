import { useState, useRef, useEffect } from "react";
import ChatPanel from "../components/chatBot/ChatPanel";
import QuestionsCard from "../components/common/QuestionsCard";
import InputField from "../components/common/InputField";
import PrimaryButton from "../components/common/PrimaryButton";

const Quiz = () => {
  const chatRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const startQuiz = async () => {
      const savedSession = localStorage.getItem("bridgebot_quiz_current");

      if (savedSession) {
        const data = JSON.parse(savedSession);
        handleQuizEvent(data);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (chatRef.current) {
        setIsThinking(true);
        chatRef.current.submitQuizAnswer("START_QUIZ");
      }
    };

    startQuiz();
  }, []);

  const handleQuizEvent = (data) => {
    setIsThinking(false);
    setQuestion(data.question);
    setFeedback(data.isCorrect);
    setExplanation(data.explanation);
    setDifficulty(data.difficulty);

    // Save session to avoid re-spending tokens
    localStorage.setItem("bridgebot_quiz_current", JSON.stringify(data));
  };

  const submitAnswer = () => {
    if (!question) return;
    if (!answer.trim()) return;
    if (isThinking) return;

    setIsThinking(true);
    setFeedback(null);

    chatRef.current.submitQuizAnswer(answer);
    setAnswer("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Quiz - let’s test you
      </h1>

      {isThinking && !question && (
        <div className="text-center p-10 animate-pulse text-blue-500">
          BridgeBot is preparing your first question...
        </div>
      )}

      {question && (
        <QuestionsCard
          questionNo={feedback === null ? "Current" : "Next"}
          question={question}
        />
      )}

      <div className="mt-6">
        <InputField
          label="Type your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here"
          onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
        />

        <div className="mt-4">
          <PrimaryButton
            label={isThinking ? "Thinking..." : "Submit answer"}
            onClick={submitAnswer}
            disabled={isThinking || !answer.trim()}
          />
        </div>
      </div>

      {!question && !isThinking && (
        <div className="text-center text-sm text-gray-400 mt-6">
          Waiting for the next question...
        </div>
      )}

      {feedback !== null && !isThinking && (
        <div
          className={`mt-6 p-4 rounded-lg border transition
            ${
              feedback
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200"
            }
          `}
        >
          <p className="font-bold">
            {feedback ? "✅ Correct!" : "❌ Incorrect"}
          </p>

          <p className="text-sm mt-2 opacity-90">{explanation}</p>

          <p className="text-xs mt-3 opacity-70 uppercase">
            Difficulty: {difficulty}
          </p>
        </div>
      )}

      {/* Hidden AI brain */}
      <ChatPanel
        ref={chatRef}
        quizMode={true}
        pageContext="quiz"
        onQuizEvent={handleQuizEvent}
      />
    </div>
  );
};

export default Quiz;

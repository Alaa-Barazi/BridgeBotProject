import { useEffect, useRef, useState } from "react";
import QuestionsCard from "../components/common/QuestionsCard";
import InputField from "../components/common/InputField";
import PrimaryButton from "../components/common/PrimaryButton";
import ChatPanel from "../components/chatBot/ChatPanel";
import { listWeekQuiz } from "../services/quizService";

export default function CourseQuiz() {
  const chatRef = useRef(null);

  const evaluationCache = useRef({}); // ⛔ prevent duplicate Gemini calls
  const lastCallRef = useRef(0); // ⏳ cooldown tracking

  const GEMINI_COOLDOWN_MS = 12000;

  const [week, setWeek] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, [week]);

  const loadQuiz = async () => {
    try {
      const data = await listWeekQuiz(week);
      setQuestions(data);
      setCurrentIndex(0);
      resetFeedback();
    } catch (e) {
      setError("Failed to load quiz for this week.");
    }
  };

  const resetFeedback = () => {
    setFeedback(null);
    setExplanation("");
    setAnswer("");
    setError("");
  };

  const submitAnswer = () => {
    if (!answer.trim() || isThinking) return;

    const now = Date.now();
    if (now - lastCallRef.current < GEMINI_COOLDOWN_MS) {
      setError("Please wait a few seconds before submitting again.");
      return;
    }

    const key = `${currentIndex}:${answer.trim().toLowerCase()}`;

    // ♻️ reuse cached evaluation
    if (evaluationCache.current[key]) {
      handleQuizEvent(evaluationCache.current[key]);
      return;
    }

    lastCallRef.current = now;
    setIsThinking(true);
    setError("");

    chatRef.current.submitQuizAnswer({
      question: questions[currentIndex].question,
      answer,
      cacheKey: key,
    });
  };

  const handleQuizEvent = (data) => {
    setIsThinking(false);

    if (!data || typeof data.isCorrect !== "boolean") {
      setError("Unable to evaluate answer. Please try again.");
      return;
    }

    setFeedback(data.isCorrect);
    setExplanation(data.explanation || "");

    // store evaluation to avoid extra Gemini calls
    const key = `${currentIndex}:${answer.trim().toLowerCase()}`;
    evaluationCache.current[key] = data;
  };

  const nextQuestion = () => {
    resetFeedback();
    setCurrentIndex((i) => i + 1);
  };

  if (questions.length === 0) {
    return <div className="p-6 text-center">No quiz for this week.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Quiz</h1>

      <QuestionsCard
        questionNo={currentIndex + 1}
        question={questions[currentIndex].question}
      />

      <div className="mt-6">
        <InputField
          label="Your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer"
          disabled={isThinking}
        />

        <div className="mt-4">
          <PrimaryButton
            label={isThinking ? "Checking..." : "Submit answer"}
            onClick={submitAnswer}
            disabled={isThinking || !answer.trim()}
          />
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {feedback !== null && !isThinking && (
        <div
          className={`mt-6 p-4 rounded-lg border transition ${
            feedback
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          <p className="font-bold">
            {feedback ? "Well done" : "Needs clarification"}
          </p>

          <p className="text-sm mt-2">{explanation}</p>

          {currentIndex < questions.length - 1 && (
            <div className="mt-4">
              <PrimaryButton label="Next question" onClick={nextQuestion} />
            </div>
          )}
        </div>
      )}

      {/* AI brain - evaluation only */}
      <ChatPanel
        ref={chatRef}
        quizMode={true}
        pageContext="course-quiz"
        onQuizEvent={handleQuizEvent}
      />
    </div>
  );
}

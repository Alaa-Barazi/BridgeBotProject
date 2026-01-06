/**
 * CourseQuiz Page
 * ---------------
 * Weekly course quiz with AI-based answer evaluation.
 *
 * Responsibilities:
 * - Load quiz questions per week
 * - Handle user answers and AI evaluation
 * - Cache evaluations to reduce duplicate API calls
 * - Provide clear feedback and explanations
 *
 * Dark mode design:
 * - Calm, exam-like environment
 * - Flat background with a single focused surface
 * - Soft feedback colors without emotional intensity
 */

import { useEffect, useRef, useState } from "react";
import QuestionsCard from "../components/common/QuestionsCard";
import InputField from "../components/common/InputField";
import PrimaryButton from "../components/common/PrimaryButton";
import ChatPanel from "../components/chatBot/ChatPanel";
import { listWeekQuiz } from "../services/quizService";

export default function CourseQuiz() {
  const chatRef = useRef(null);

  const evaluationCache = useRef({});
  const lastCallRef = useRef(0);

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
    } catch {
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

    const key = `${currentIndex}:${answer.trim().toLowerCase()}`;
    evaluationCache.current[key] = data;
  };

  const nextQuestion = () => {
    resetFeedback();
    setCurrentIndex((i) => i + 1);
  };

  if (questions.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
                      bg-gray-50 dark:bg-[#0f172a]"
      >
        <p className="text-gray-600 dark:text-slate-400">
          No quiz for this week.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center pt-16
                 bg-gray-50 dark:bg-[#0f172a]"
    >
      <div>
        <h1
          className="text-3xl font-bold mb-6 text-center
                       text-gray-900 dark:text-slate-200"
        >
          Course Quiz
        </h1>

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

          {error && (
            <p
              className="text-sm mt-3
                          text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>

        {feedback !== null && !isThinking && (
          <div
            className={`mt-6 p-4 rounded-lg border transition
              ${
                feedback
                  ? "bg-green-50 border-green-300  dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                  : "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
              }
            `}
          >
            <p className="font-semibold">
              {feedback ? "Well done" : "Needs clarification"}
            </p>

            <p className="text-sm mt-2 opacity-90">{explanation}</p>

            {currentIndex < questions.length - 1 && (
              <div className="mt-4">
                <PrimaryButton label="Next question" onClick={nextQuestion} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI evaluation engine */}
      <ChatPanel
        ref={chatRef}
        quizMode={true}
        pageContext="course-quiz"
        onQuizEvent={handleQuizEvent}
      />
    </div>
  );
}

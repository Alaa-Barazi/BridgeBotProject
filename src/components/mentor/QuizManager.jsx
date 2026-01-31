/**
 * QuizManager
 *
 * Mentor-facing component for managing weekly quizzes.
 * Loads quiz questions, triggers AI-based quiz generation,
 * and allows editing individual questions using AI commands.
 */

import { useEffect, useState } from "react";
import {
  generateWeekQuiz,
  listWeekQuiz,
  applyQuizEdit,
} from "../../services/quizService";
import AICommandPanel from "./AICommandPanel";

export default function QuizManager({ week }) {
  const [questions, setQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const refresh = async () => {
    try {
      const data = await listWeekQuiz(week);
      setQuestions(data);
    } catch (e) {
      setError(e.message || "Failed to load quiz");
    }
  };

  useEffect(() => {
    refresh();
  }, [week]);

  const onGenerate = async () => {
    setGenerating(true);
    try {
      await generateWeekQuiz(week);
      await refresh();
    } catch (e) {
      setError(e.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const onApplyEdit = async (instruction) => {
    const updated = await applyQuizEdit(editingId, instruction);
    setQuestions((prev) => prev.map((q) => (q.id === editingId ? updated : q)));
    setEditingId(null);
  };

  return (
    <div className="rounded-xl p-2 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Quiz - Week {week}</h2>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="px-3 py-2 text-sm rounded-md
            bg-indigo-600 hover:bg-indigo-700 notice
            text-white disabled:opacity-60
            flex items-center gap-2 transition"
        >
          {generating && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {generating ? "Generating quiz..." : "Generate 10 questions"}
        </button>
      </div>

      {/* Generating hint */}
      {generating && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
          BridgeBot is analyzing the documents and creating questions
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}

      {/* Questions */}
      <div className="mt-4 space-y-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="border border-gray-200 dark:border-gray-700
              rounded-lg p-3
              bg-gray-50 dark:bg-gray-900/50
              transition"
          >
            <div className="flex justify-between gap-4">
              <p className="text-sm leading-relaxed">
                {idx + 1}. {q.question}
              </p>

              <button
                onClick={() => setEditingId(q.id)}
                className="text-xs px-2 py-1 rounded-md
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition whitespace-nowrap"
              >
                Edit with AI
              </button>
            </div>

            {editingId === q.id && (
              <div className="mt-3">
                <AICommandPanel
                  title="Tell BridgeBot how to change this question"
                  onApply={onApplyEdit}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

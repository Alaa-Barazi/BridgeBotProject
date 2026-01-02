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
    <div className="bg-white border rounded-xl p-4">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold">Quiz - Week {week}</h2>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
        >
          {generating && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {generating ? "Generating quiz..." : "Generate 10 questions"}
        </button>
      </div>
      {generating && (
        <p className="text-xs text-gray-500 mt-2 italic">
          BridgeBot is analyzing the documents and creating questions
        </p>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-4 space-y-2">
        {questions.map((q, idx) => (
          <div key={q.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between">
              <p className="text-sm">
                {idx + 1}. {q.question}
              </p>
              <button
                onClick={() => setEditingId(q.id)}
                className="text-xs border px-2 py-1 rounded-md"
              >
                Edit with AI
              </button>
            </div>

            {editingId === q.id && (
              <AICommandPanel
                title="Tell BridgeBot how to change this question"
                onApply={onApplyEdit}
                onCancel={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

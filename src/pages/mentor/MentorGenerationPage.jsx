import { useEffect, useState } from "react";
import WeekSelector from "../../components/mentor/WeekSelector";
import DocumentUploader from "../../components/mentor/DocumentUploader";
import QuizManager from "../../components/mentor/QuizManager";
import DictionaryManager from "../../components/mentor/DictionaryManager";

export default function MentorGenerationPage() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState("quiz");

  useEffect(() => {
    const saved = localStorage.getItem("mentor_active_week");
    if (saved) setActiveWeek(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("mentor_active_week", String(activeWeek));
  }, [activeWeek]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mentor Content Generation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage weekly documents, quizzes, and dictionary
            </p>
          </div>

          <WeekSelector
            activeWeek={activeWeek}
            onChange={setActiveWeek}
            weeks={13}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Documents + Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentUploader week={activeWeek} />

        </div>

        {/* Tabs OUTSIDE the box */}
        <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`pb-3 text-sm font-medium transition
              ${
                activeTab === "quiz"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Quiz Generation
          </button>

          <button
            onClick={() => setActiveTab("dictionary")}
            className={`pb-3 text-sm font-medium transition
              ${
                activeTab === "dictionary"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Dictionary Generation
          </button>
        </div>

        {/* Content card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          {activeTab === "quiz" && <QuizManager week={activeWeek} />}
          {activeTab === "dictionary" && (
            <DictionaryManager week={activeWeek} />
          )}
        </div>
      </main>
    </div>
  );
}

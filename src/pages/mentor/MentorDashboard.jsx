import { useEffect, useState } from "react";
import WeekSelector from "../../components/mentor/WeekSelector";
import DocumentUploader from "../../components/mentor/DocumentUploader";
import QuizManager from "../../components/mentor/QuizManager";
import DictionaryManager from "../../components/mentor/DictionaryManager";


export default function MentorDashboard() {
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("mentor_active_week");
    if (saved) setActiveWeek(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("mentor_active_week", String(activeWeek));
  }, [activeWeek]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              BridgeBot - Mentor Dashboard
            </h1>
            <p className="text-sm text-gray-500">
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

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentUploader week={activeWeek} />
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold">Week rules</h2>
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Week 1 is syllabus-based content.</li>
              <li>Weeks 2+ use the uploaded documents for that week.</li>
              <li>Generated quiz and dictionary are saved and reused.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuizManager week={activeWeek} />
          <DictionaryManager week={activeWeek} />
        </div>
      </main>
    </div>
  );
}

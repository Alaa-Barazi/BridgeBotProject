import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseMaterials from "../components/team/CourseMaterials";

export default function Home() {
  const navigate = useNavigate();
  const [week, setWeek] = useState(1);

  const weeks = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Home
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Week</span>
          <select
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CourseMaterials week={week} />

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-fit">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Week {week} – Activities
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Study the materials, then practice.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/quiz")}
            >
              Start Quiz
            </button>

            <button
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
                 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => navigate("/dictionary")}
            >
              Open Dictionary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeekSelector({ activeWeek, onChange, weeks }) {
  const options = Array.from({ length: weeks }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600 dark:text-gray-400">Week</label>

      <select
        value={activeWeek}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-sm px-3 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition"
      >
        {options.map((w) => (
          <option key={w} value={w}>
            {w === 1 ? "Week 1 (Syllabus)" : `Week ${w}`}
          </option>
        ))}
      </select>
    </div>
  );
}

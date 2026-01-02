export default function WeekSelector({ activeWeek, onChange, weeks }) {
  const options = Array.from({ length: weeks }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Week</label>
      <select
        value={activeWeek}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-sm border rounded-md px-2 py-2 bg-white"
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

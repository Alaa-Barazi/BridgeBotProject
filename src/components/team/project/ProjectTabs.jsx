export default function ProjectTabs({ active, onChange }) {
  const tabs = [
    { key: "documents", label: "Documents" },
    { key: "requirements", label: "Requirements" },
    { key: "architecture", label: "Architecture" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium transition
                ${isActive
                  ? "bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

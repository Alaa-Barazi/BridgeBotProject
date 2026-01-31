/**
 * ProjectTabs
 *
 * Tab navigation component for the project workspace.
 * Renders section tabs and optional unread badges,
 * and notifies the parent when the active tab changes.
 */

export default function ProjectTabs({ active, onChange, badges = {} }) {
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
          const badge = Number(badges?.[t.key] || 0);

          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "relative px-4 py-2 rounded-t-md text-sm font-medium transition",
                isActive
                  ? "bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
              ].join(" ")}
            >
              {t.label}

              {/* ✅ Small red badge */}
              {badge > 0 && (
                <span
                  className={[
                    "absolute top-1 -right-1",
                    "min-w-4 h-4 px-1",
                    "rounded-full bg-red-600 text-white",
                    "text-[10px] leading-4 text-center font-semibold",
                    "shadow",
                  ].join(" ")}
                  aria-label={`${badge} unread`}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

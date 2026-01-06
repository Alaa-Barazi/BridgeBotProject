/**
 * StatusIndicator
 * ---------------
 * Visual indicator for project status.
 *
 * Responsibilities:
 * - Display project status with color-coded dot
 *
 * Dark mode design:
 * - Muted colors
 * - Clear but non-distracting
 */

const StatusIndicator = ({ status = "On track" }) => {
  const statusColors = {
    "On track": "bg-green-500",
    "Minor issues": "bg-yellow-500",
    Delayed: "bg-red-500",
    "Not started": "bg-gray-400",
  };

  return (
    <div
      className="flex items-center gap-2 mt-2
                    text-sm text-gray-700 dark:text-slate-300"
    >
      <span
        className={`w-3 h-3 rounded-full ${
          statusColors[status] || "bg-gray-400"
        }`}
      />
      <span>{status}</span>
    </div>
  );
};

export default StatusIndicator;

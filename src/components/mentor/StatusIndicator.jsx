const StatusIndicator = ({ status="On track" || "Minor issues"|| "Delayed" ||  "Not started" }) => {
  const statusColors = {
    "On track": "bg-green-500",
    "Minor issues": "bg-yellow-500",
    "Delayed": "bg-red-500",
    "Not started": "bg-gray-400",
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className={`w-3 h-3 rounded-full ${statusColors[status]}`}></span>
      <span>{status}</span>
    </div>
  );
};

export default StatusIndicator;

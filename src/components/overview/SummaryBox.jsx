import React from "react";
import StatusIndicator from "../mentor/StatusIndicator";

/* Team leader
Semester / Course
Category (IoT, Hardware, etc.)
Progress (% + bar)
Status circle */

const SummaryBox = ({ teamLeader, category, progress, status }) => {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
      <span>Team leader: {teamLeader}</span>
      <br />
      <span>Category: {category}</span>

      <div className="mt-2">
        <progress value={progress} max="100" />
        <span className="ml-2">{progress}%</span>
      </div>

      <div className="mt-2">
        <StatusIndicator status={status} />
      </div>
    </div>
  );
};

export default SummaryBox;

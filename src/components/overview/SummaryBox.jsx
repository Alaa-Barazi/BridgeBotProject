/**
 * SummaryBox
 * ----------
 * Displays a concise summary of a project for mentors.
 *
 * Responsibilities:
 * - Show team leader and category
 * - Display project status via StatusIndicator
 *
 * Dark mode design:
 * - Calm surface with low contrast
 * - No white text
 * - Borders instead of heavy shadows
 */

import StatusIndicator from "../mentor/StatusIndicator";

const SummaryBox = ({ teamLeader, category, status }) => {
  return (
    <div
      className="rounded-lg p-6 mb-6
                 bg-white dark:bg-[#111827]
                 border border-gray-200 dark:border-[#1f2933]
                 shadow-sm dark:shadow-none"
    >
      <h3
        className="text-xl font-semibold mb-4 text-center
                   text-gray-900 dark:text-slate-200"
      >
        Summary
      </h3>

      <div
        className="space-y-2 text-center
                   text-gray-700 dark:text-slate-300"
      >
        <p>
          <span className="font-semibold">Team leader:</span> {teamLeader}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {category}
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <StatusIndicator status={status} />
      </div>
    </div>
  );
};

export default SummaryBox;

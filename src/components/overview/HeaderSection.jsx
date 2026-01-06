/**
 * HeaderSection
 * -------------
 * Displays the main project header information.
 *
 * Responsibilities:
 * - Show project name and description
 * - Display progress and status
 *
 * Dark mode design:
 * - Clear typography hierarchy
 * - Soft contrast for reading comfort
 */

const HeaderSection = ({ projectName, description, progress, status }) => {
  return (
    <div
      className="rounded-lg p-6 mb-6
                 bg-white dark:bg-[#111827]
                 border border-gray-200 dark:border-[#1f2933]
                 shadow-sm dark:shadow-none"
    >
      <h2
        className="text-2xl font-bold text-center mb-2
                   text-gray-900 dark:text-slate-200"
      >
        {projectName}
      </h2>

      <p
        className="text-center mb-4
                   text-gray-600 dark:text-slate-400"
      >
        {description}
      </p>

      <div>
        <p
          className="font-medium mb-1
                     text-gray-800 dark:text-slate-300"
        >
          Progress
        </p>
        <progress value={progress} max="100" className="w-full h-4" />
      </div>

      <p
        className="mt-3 text-center
                   text-gray-700 dark:text-slate-300"
      >
        <span className="font-semibold">Status:</span> {status}
      </p>
    </div>
  );
};

export default HeaderSection;

/**
 * ProjectMentorView
 * -----------------
 * Displays high-level project information inside mentor project cards.
 *
 * Responsibilities:
 * - Show project name, leader, description
 * - Display progress and status textually
 *
 * Dark mode design:
 * - Clear hierarchy
 * - Soft slate text
 * - No white blocks or harsh contrast
 */

const ProjectMentorView = ({
  projectName,
  teamLeader,
  description,
  progress,
  status,
}) => {
  return (
    <div className="mb-4">
      <h2
        className="text-xl font-semibold mb-1
                     text-gray-900 dark:text-slate-200"
      >
        {projectName}
      </h2>

      <p className="text-sm text-gray-700 dark:text-slate-300">
        <span className="font-medium">Team leader:</span> {teamLeader}
      </p>

      <p className="text-sm text-gray-700 dark:text-slate-300">
        <span className="font-medium">Description:</span> {description}
      </p>

      <div className="mt-3">
        <div
          className="flex items-center justify-between text-sm mb-1
                        text-gray-700 dark:text-slate-300"
        >
          <span className="font-medium">Progress</span>
          <span>{progress}%</span>
        </div>

        <progress value={progress} max="100" className="w-full h-2 rounded" />
      </div>

      <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
        <span className="font-medium">Status:</span> {status}
      </p>
    </div>
  );
};

export default ProjectMentorView;

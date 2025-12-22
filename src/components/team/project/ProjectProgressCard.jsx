export default function ProjectProgressCard({ status, progress, category, teamLeader }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Team leader</div>
          <div className="text-gray-900 dark:text-white font-semibold">{teamLeader}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
          <div className="text-gray-900 dark:text-white font-semibold">{category}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
          <div className="text-gray-900 dark:text-white font-semibold">{status}</div>
        </div>

        <div className="w-full md:w-64">
          <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className="h-2 bg-blue-600 dark:bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

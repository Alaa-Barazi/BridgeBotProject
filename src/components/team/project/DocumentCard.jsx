export default function DocumentCard({ title, type, updatedAt, onOpen }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {type} - Updated {updatedAt}
          </p>
        </div>

        <button
          onClick={onOpen}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Open
        </button>
      </div>
    </div>
  );
}

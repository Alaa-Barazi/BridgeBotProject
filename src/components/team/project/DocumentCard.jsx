/**
 * DocumentCard
 *
 * Displays a single document summary.
 * Shows the document title, last update time,
 * and an action button to open the document.
 */

export default function DocumentCard({ title, updatedAt, onOpen, disabled }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title || "Document"}
          </h3>
          {updatedAt ? (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Updated {updatedAt}
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">No date</p>
          )}
        </div>

        <button
          onClick={onOpen}
          disabled={disabled}
          className={[
            "text-sm font-medium",
            disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 dark:text-blue-400 hover:underline",
          ].join(" ")}
        >
          Open
        </button>
      </div>
    </div>
  );
}

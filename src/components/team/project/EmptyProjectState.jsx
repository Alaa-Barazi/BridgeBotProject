import ActionButton from "../../common/ActionButton";

export default function EmptyProjectState({ onCreateArchitecture }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        No project workspace yet
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Start by creating your architecture. After that, you will be able to upload documents, add requirements, and track progress.
      </p>

      <div className="flex gap-3">
        <ActionButton text="Create Architecture" onClick={onCreateArchitecture} />
      </div>
    </div>
  );
}

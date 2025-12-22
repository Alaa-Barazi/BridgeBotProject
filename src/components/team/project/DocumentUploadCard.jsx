import ActionButton from "../../common/ActionButton";

export default function DocumentUploadCard() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Upload a new document
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Upload requirements, diagrams, reports, or any supporting files.
      </p>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="file"
          className="block w-full text-sm text-gray-600 dark:text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-gray-200 dark:file:bg-gray-700
                     file:text-gray-900 dark:file:text-white"
        />
        <ActionButton text="Upload" onClick={() => {}} />
      </div>
    </div>
  );
}

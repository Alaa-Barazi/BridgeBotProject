const ArchitectureSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Architecture
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Upload or update your system architecture diagram.
      </p>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Upload Architecture
        </button>

        <button className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200">
          View Architecture
        </button>
      </div>
    </div>
  );
};

export default ArchitectureSection;

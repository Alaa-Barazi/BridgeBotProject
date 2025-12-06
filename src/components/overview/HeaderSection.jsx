const HeaderSection = ({ projectName, description, progress, status }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        {projectName}
      </h2>

      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>

      <div>
        <p className="font-medium mb-1 text-gray-800 dark:text-gray-200">Progress</p>
        <progress value={progress} max="100" className="w-full h-4" />
      </div>

      <p className="mt-3 text-center">
        <span className="font-semibold">Status:</span> {status}
      </p>
    </div>
  );
};

export default HeaderSection;

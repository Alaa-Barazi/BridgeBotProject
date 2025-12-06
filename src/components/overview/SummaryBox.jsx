import StatusIndicator from "../mentor/StatusIndicator";

const SummaryBox = ({ teamLeader, category, status }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
        Summary
      </h3>

      <div className="space-y-2 text-gray-700 dark:text-gray-300 text-center">
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

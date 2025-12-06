const FeedbackItem = ({ user, message, timestamp }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700">
      <div className="flex justify-between mb-1">
        <span className="font-semibold text-gray-900 dark:text-white">{user}</span>
        <span className="text-sm text-gray-500">{timestamp}</span>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default FeedbackItem;

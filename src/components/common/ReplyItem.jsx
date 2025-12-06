const ReplyItem = ({ text, user, timestamp }) => {
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-900 
                    p-4 rounded-lg shadow-sm"
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">
          {user}
        </span>
        <span className="text-sm text-gray-500">{timestamp}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
};

export default ReplyItem;

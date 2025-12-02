const QuestionsCard = ({ questionNo, question }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-md shadow p-4 border w-full max-w-2xl mx-auto hover:shadow-lg transition">
      <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed">
        <span className="font-semibold mr-2">{questionNo}.</span>
        {question}
      </p>
    </div>
  );
};

export default QuestionsCard;

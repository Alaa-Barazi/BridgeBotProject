/**
 * QuestionsCard Component
 * -----------------------
 * Displays the current quiz question in a focused card layout.
 *
 * Responsibilities:
 * - Show question number and text
 * - Provide a calm reading surface
 *
 * Dark mode design:
 * - Soft dark surface
 * - Reduced contrast for comfortable reading
 * - No bright whites or heavy shadows
 */

const QuestionsCard = ({ questionNo, question }) => {
  return (
    <div
      className="rounded-md p-4 w-full max-w-2xl mx-auto transition
                 bg-white dark:bg-[#111827]
                 border border-gray-200 dark:border-[#1f2933]
                 shadow-sm dark:shadow-none"
    >
      <p
        className="text-lg leading-relaxed
                    text-gray-800 dark:text-slate-300"
      >
        <span className="font-semibold mr-2 text-gray-900 dark:text-slate-200">
          {questionNo}.
        </span>
        {question}
      </p>
    </div>
  );
};

export default QuestionsCard;

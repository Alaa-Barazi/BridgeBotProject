/**
 * DictionaryCard Component
 * ------------------------
 * Displays a single dictionary term with its definition and category.
 *
 * Responsibilities:
 * - Present term title, description, and category
 * - Adapt cleanly to both light and dark modes
 *
 * Dark mode design goals:
 * - Calm, low-contrast surface
 * - No pure white backgrounds
 * - Soft text colors for long reading sessions
 */

const DictionaryCard = ({ term, definition, category }) => {
  return (
    <div
      className="rounded-lg p-4
                 bg-white dark:bg-[#111827]
                 border border-gray-200 dark:border-gray-100
                 shadow-sm dark:shadow-none"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
        {term}
      </h3>

      <p className="text-sm text-gray-700 dark:text-slate-300 mt-2 leading-relaxed">
        {definition}
      </p>

      <span className="text-xs text-gray-500 dark:text-slate-400 mt-3 inline-block">
        Category: {category}
      </span>
    </div>
  );
};

export default DictionaryCard;

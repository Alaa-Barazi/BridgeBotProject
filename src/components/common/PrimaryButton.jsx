/**
 * PrimaryButton Component
 * -----------------------
 * Main action button used for form submission and quiz actions.
 *
 * Responsibilities:
 * - Trigger primary user actions
 * - Reflect disabled state clearly
 *
 * Dark mode design:
 * - Muted blue accent
 * - No glowing or aggressive hover
 * - Professional, calm interaction
 */

const PrimaryButton = ({ label, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded font-semibold transition
        bg-blue-600 text-white
        dark:bg-blue-500 dark:text-white
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700 dark:hover:bg-blue-600"
        }`}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

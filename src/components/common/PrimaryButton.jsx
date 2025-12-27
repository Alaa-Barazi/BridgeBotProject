const PrimaryButton = ({ label, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

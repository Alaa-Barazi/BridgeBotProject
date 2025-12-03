const PrimaryButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-medium
                 hover:bg-blue-700 transition active:scale-95
                 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

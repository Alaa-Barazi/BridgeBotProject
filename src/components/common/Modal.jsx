const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="
          w-full max-w-md p-6 rounded-lg shadow-lg relative
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
        "
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 text-gray-500
            hover:text-gray-700
            dark:text-gray-400 dark:hover:text-gray-200
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;

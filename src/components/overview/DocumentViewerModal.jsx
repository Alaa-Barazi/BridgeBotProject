import React from "react";
import { IoClose } from "react-icons/io5";

const DocumentViewerModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Document content area */}
        <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-200 max-h-[60vh] overflow-auto">
          {content ? (
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {content}
            </p>
          ) : (
            <p className="text-gray-500">No content available.</p>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;

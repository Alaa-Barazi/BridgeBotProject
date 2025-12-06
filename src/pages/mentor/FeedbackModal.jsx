import { IoClose } from "react-icons/io5";
import ActionButton from "../../components/common/ActionButton";
import { useState } from "react";

const FeedbackModal = ({ isOpen, onClose, onSave }) => {
  const [feedbackText, setFeedbackText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedbackText.trim()) return;
    onSave(feedbackText);
    setFeedbackText("");
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Feedback
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Feedback textarea */}
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full h-32 border border-gray-300 dark:border-gray-600 rounded-md p-3 
                     bg-gray-50 dark:bg-gray-900 dark:text-white
                     focus:ring-1 focus:ring-blue-500"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <ActionButton text="Cancel" type="clear" onClick={onClose} />
          <ActionButton text="Send Feedback" onClick={handleSubmit} />
          <ActionButton
            text="Get AI Suggestion✨"
            onClick={() => {}}
            buttonStyle="px-3 py-2 bg-purple-400 text-white rounded hover:bg-purple-500 text-sm cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

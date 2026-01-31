/**
 * FeedbackModal
 *
 * Reusable modal for mentors to send written feedback.
 * Allows optional association of feedback with a specific document
 * and submits the feedback text with related metadata.
 */

import { IoClose } from "react-icons/io5";
import ActionButton from "../../components/common/ActionButton";
import { useEffect, useMemo, useState } from "react";

/**
 * Props:
 * - isOpen (boolean)
 * - onClose (fn)
 * - onSave (fn(text, meta))  // meta: { aboutDocId, aboutDocTitle }
 * - documents (array)        // optional: [{ id, title/fileName }]
 */
const FeedbackModal = ({ isOpen, onClose, onSave, documents = [] }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");

  const docs = useMemo(
    () => (Array.isArray(documents) ? documents : []),
    [documents],
  );

  const selectedDoc = useMemo(() => {
    if (!selectedDocId) return null;
    return docs.find((d) => String(d?.id || "") === String(selectedDocId));
  }, [docs, selectedDocId]);

  const getDocTitle = (d) => d?.title || d?.fileName || d?.name || "Document";

  // reset only when opening
  useEffect(() => {
    if (!isOpen) return;
    setFeedbackText("");
    setSelectedDocId("");
  }, [isOpen]);

  const handleSubmit = () => {
    const text = String(feedbackText || "").trim();
    if (!text) return;

    onSave?.(text, {
      aboutDocId: selectedDoc ? String(selectedDoc.id) : null,
      aboutDocTitle: selectedDoc ? getDocTitle(selectedDoc) : null,
    });

    onClose?.();
  };

  // ✅ return AFTER hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Feedback
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            aria-label="Close"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Select document (optional) */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Feedback is about (optional)
          </label>

          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2
                       bg-gray-50 dark:bg-gray-900 dark:text-white
                       focus:ring-1 focus:ring-blue-500"
          >
            <option value="">General (not about a specific document)</option>
            {docs.map((d) => (
              <option key={String(d?.id)} value={String(d?.id)}>
                {getDocTitle(d)}
              </option>
            ))}
          </select>

          {selectedDoc ? (
            <div className="mt-1 text-xs text-gray-500">
              Selected: <b>{getDocTitle(selectedDoc)}</b>
            </div>
          ) : null}
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
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

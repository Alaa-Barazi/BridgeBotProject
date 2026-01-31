/**
 * AICommandPanel
 *
 * Reusable input panel for sending natural language instructions to AI.
 * Used to edit quiz questions, dictionary entries, and similar content.
 */
``;

import { useState } from "react";

export default function AICommandPanel({
  title,
  placeholder,
  onApply,
  onCancel,
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    await onApply(text.trim());
    setBusy(false);
    setText("");
  };

  return (
    <div
      className="mt-3 rounded-lg p-3
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900/60
        text-gray-900 dark:text-gray-100
        transition"
    >
      <p className="text-xs font-semibold mb-2">{title}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Describe the change..."}
        className="w-full mt-1 px-3 py-2 text-sm rounded-md
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onCancel}
          disabled={busy}
          className="text-sm px-3 py-1 rounded-md
            border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            disabled:opacity-60 transition"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={busy || !text.trim()}
          className="text-sm px-3 py-1 rounded-md
            bg-blue-600 hover:bg-blue-700
            text-white
            disabled:opacity-60 transition"
        >
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
}

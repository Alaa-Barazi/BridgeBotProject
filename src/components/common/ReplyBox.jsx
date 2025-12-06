import { useState } from "react";
import ActionButton from "./ActionButton";

const ReplyBox = ({ onSave }) => {
  const [text, setText] = useState("");

  return (
    <div
      className="mt-6 bg-gray-50 dark:bg-gray-900 
                    p-5 rounded-lg border border-gray-300 dark:border-gray-700"
    >
      <textarea
        className="w-full border border-gray-300 dark:border-gray-600 
                   rounded-md px-3 py-2 mb-4
                   focus:ring-1 focus:ring-blue-500
                   dark:bg-gray-800 dark:text-white"
        rows="3"
        placeholder="Type your reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-3">
        <ActionButton text="Save" onClick={() => onSave(text)} />
        <ActionButton text="Clear" type="clear" onClick={() => setText("")} />
      </div>
    </div>
  );
};

export default ReplyBox;

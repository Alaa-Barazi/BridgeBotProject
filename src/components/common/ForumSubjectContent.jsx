import { useState } from "react";
import ActionButton from "./ActionButton";
import ReplyBox from "./ReplyBox";

const ForumSubjectContent = ({ title, body, onBack }) => {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div
      className="bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 
                    rounded-lg p-8 shadow-sm"
    >
      <button
        onClick={onBack}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>

      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
        {body}
      </p>

      <ActionButton text="Reply" onClick={() => setReplyOpen(!replyOpen)} />

      {replyOpen && <ReplyBox />}
    </div>
  );
};

export default ForumSubjectContent;

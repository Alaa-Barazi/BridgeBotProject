import { useState } from "react";
import ActionButton from "./ActionButton";
import ReplyBox from "./ReplyBox";
import ReplyItem from "./ReplyItem";

const ForumSubjectContent = ({ title, body, onBack }) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replies, setReplies] = useState([]);
  const [viewPreviousReplies, setViewPreviousReplies] = useState(false);

  const handleSaveReply = (text) => {
    if (!text.trim()) return;

    const newReply = {
      id: Date.now(),
      text,
      user: "Student",
      timestamp: new Date().toLocaleString(),
    };
    //setReplyOpen(false)
    setReplies((prev) => [...prev, newReply]);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 rounded-xl p-8 shadow-md max-w-3xl mx-auto"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-blue-600 dark:text-blue-400 
                   hover:underline mb-6 inline-block"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      {/* Body */}
      <p
        className="text-gray-700 dark:text-gray-300 
                    text-lg leading-relaxed mb-8 border-l-4 border-blue-500 
                    pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded"
      >
        {body}
      </p>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <ActionButton
          text={replyOpen ? "Close Reply Box" : "Reply"}
          onClick={() => setReplyOpen(!replyOpen)}
        />

        {replyOpen && (
          <ActionButton
            text={!viewPreviousReplies ? "View Replies" : "Hide Replies"}
            onClick={() => setViewPreviousReplies(!viewPreviousReplies)}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
          />
        )}
      </div>

      {/* Reply box */}
      {replyOpen && (
        <div className="mb-6">
          <ReplyBox onSave={handleSaveReply} />
        </div>
      )}

      {/* Replies */}
      {viewPreviousReplies && (
        <div className="mt-6 space-y-4">
          {replies.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No replies yet.
            </p>
          ) : (
            replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                text={reply.text}
                user={reply.user}
                timestamp={reply.timestamp}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ForumSubjectContent;

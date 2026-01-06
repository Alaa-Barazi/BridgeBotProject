// src/pages/mentor/MentorForum.jsx
import { useEffect, useState } from "react";
import { subscribeQuestions, addAnswer } from "../../services/forumService";

const MentorForum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // replies UI
  const [openId, setOpenId] = useState(null);
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const [savingReply, setSavingReply] = useState({});

  useEffect(() => {
    const unsub = subscribeQuestions({
      onData: (rows) => {
        setQuestions(rows);
        setLoading(false);
      },
      onError: (err) => {
        console.error(err);
        setErrMsg(err?.message || "Failed to load questions.");
        setLoading(false);
      },
      max: 50,
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const sortedAnswers = (answers) => {
    const arr = Array.isArray(answers) ? answers : [];
    return [...arr].sort((a, b) => {
      const at = a?.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bt = b?.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return at - bt;
    });
  };

  const handleSaveReply = async (qid) => {
    const text = String(replyText[qid] ?? "").trim();
    if (!text) return;

    setErrMsg("");
    try {
      setSavingReply((p) => ({ ...p, [qid]: true }));
      await addAnswer(qid, { body: text });
      setReplyText((p) => ({ ...p, [qid]: "" }));

      // close reply box after saving
      setReplyOpen((p) => ({ ...p, [qid]: false }));
    } catch (err) {
      console.error(err);
      setErrMsg(err?.message || "Failed to save reply.");
    } finally {
      setSavingReply((p) => ({ ...p, [qid]: false }));
    }
  };

  const getDateText = (ts) => {
    if (!ts) return "";
    const ms = ts?.toMillis ? ts.toMillis() : null;
    if (!ms) return "";
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mentor Forum
        </h1>
      </div>

      {errMsg && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {errMsg}
        </div>
      )}

      {/* ✅ mentor view = فقط قائمة الأسئلة بعرض كامل */}
      <div>
        {loading && (
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-gray-600 dark:text-gray-300">
            No questions yet.
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q) => {
            const isOpen = openId === q.id;
            const answers = sortedAnswers(q.answers);
            const count = Number(q.answersCount ?? answers.length ?? 0);
            const showReplyForm = !!replyOpen[q.id];

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white wrap-break-word">
                      {q.title}
                    </h3>

                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {q.userName || "User"}
                      </span>
                      {q.createdAt ? (
                        <>
                          <span className="mx-2">•</span>
                          <span>{getDateText(q.createdAt)}</span>
                        </>
                      ) : null}
                      <span className="mx-2">•</span>
                      <span>{count} replies</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const nextOpen = isOpen ? null : q.id;
                      setOpenId(nextOpen);
                      if (nextOpen) {
                        setReplyOpen((p) => ({ ...p, [q.id]: false }));
                      }
                    }}
                    className="shrink-0 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                  >
                    {isOpen ? "Hide Replies" : "View Replies"}
                  </button>
                </div>

                {/* Body */}
                <div className="mt-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {q.body}
                </div>

                {/* Replies */}
                {isOpen && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                    <div className="space-y-3">
                      {answers.length === 0 ? (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          No replies yet.
                        </div>
                      ) : (
                        answers.map((a, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {a.userName || "User"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getDateText(a.createdAt)}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                              {a.body}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* reply button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() =>
                          setReplyOpen((p) => ({
                            ...p,
                            [q.id]: !showReplyForm,
                          }))
                        }
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                      >
                        {showReplyForm ? "Close Reply" : "Answer as Mentor"}
                      </button>
                    </div>

                    {showReplyForm && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Mentor Answer
                        </div>

                        <textarea
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          placeholder="Type your answer..."
                          rows={3}
                          value={replyText[q.id] ?? ""}
                          onChange={(e) =>
                            setReplyText((p) => ({
                              ...p,
                              [q.id]: e.target.value,
                            }))
                          }
                          disabled={!!savingReply[q.id]}
                        />

                        <div className="mt-3 flex gap-2 justify-end">
                          <button
                            onClick={() => handleSaveReply(q.id)}
                            disabled={!!savingReply[q.id]}
                            className={[
                              "px-4 py-2 rounded-lg text-white font-medium",
                              savingReply[q.id]
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700",
                            ].join(" ")}
                          >
                            {savingReply[q.id] ? "Saving..." : "Save Answer"}
                          </button>

                          <button
                            onClick={() =>
                              setReplyText((p) => ({ ...p, [q.id]: "" }))
                            }
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MentorForum;

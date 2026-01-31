/**
 * Forum
 *
 * Student-facing discussion forum.
 * Allows users to post questions, view existing discussions,
 * and add replies with real-time updates.
 */

import { useEffect, useState } from "react";
import {
  createQuestion,
  subscribeQuestions,
  addAnswer,
} from "../services/forumService";

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ask question form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  // replies UI
  const [openId, setOpenId] = useState(null); // which question has replies open
  const [replyOpen, setReplyOpen] = useState({}); // { [qid]: boolean } => show reply form?
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

  const handlePost = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      setPosting(true);
      await createQuestion({ title, body });
      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      setErrMsg(err?.message || "Failed to post question.");
    } finally {
      setPosting(false);
    }
  };

  const sortedAnswers = (answers) => {
    if (!answers) return [];

    // RTDB stores objects, not arrays
    const arr = Array.isArray(answers) ? answers : Object.values(answers);

    return [...arr].sort((a, b) => {
      const at = typeof a?.createdAt === "number" ? a.createdAt : 0;
      const bt = typeof b?.createdAt === "number" ? b.createdAt : 0;
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

      // ✅ close the reply box after saving
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
    const ms =
      typeof ts === "number" ? ts : ts?.toMillis ? ts.toMillis() : null;

    if (!ms) return "";
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Forum
        </h1>
      </div>

      {errMsg && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {errMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ASK QUESTION */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ask a Question
            </h2>

            <form onSubmit={handlePost} className="space-y-3">
              <input
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={posting}
              />

              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Describe your question..."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={posting}
              />

              <button
                type="submit"
                disabled={posting}
                className={[
                  "w-full px-4 py-2.5 rounded-lg text-white font-medium",
                  posting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700",
                ].join(" ")}
              >
                {posting ? "Posting..." : "Post Question"}
              </button>
            </form>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="text-gray-600 dark:text-gray-300">Loading...</div>
          )}

          {!loading && questions.length === 0 && (
            <div className="text-gray-600 dark:text-gray-300">
              No questions yet. Be the first to ask 🙂
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
                        // toggle replies area
                        const nextOpen = isOpen ? null : q.id;
                        setOpenId(nextOpen);

                        // when opening replies, default reply form closed
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

                  {/* Replies section */}
                  {isOpen && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                      {/* Answers list */}
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

                      {/* ✅ Button BELOW replies */}
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
                          {showReplyForm ? "Close Reply" : "Add Reply"}
                        </button>
                      </div>

                      {/* ✅ Reply form opens only after clicking Add Reply */}
                      {showReplyForm && (
                        <div className="mt-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Add Reply
                          </div>

                          <textarea
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="Type your reply..."
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
                              {savingReply[q.id] ? "Saving..." : "Save"}
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
    </div>
  );
};

export default Forum;

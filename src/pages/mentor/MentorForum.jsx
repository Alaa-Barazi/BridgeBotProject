/**
 * MentorForum
 *
 * Mentor-facing forum page for answering student questions.
 * Loads questions in real time, displays replies per question,
 * and allows mentors to post answers with role-based labeling.
 */

import { useEffect, useState } from "react";
import {
  subscribeQuestions,
  subscribeAnswers,
  addAnswer,
} from "../../services/forumService";

const MentorForum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // which question is open
  const [openId, setOpenId] = useState(null);

  // ✅ answers of the currently open question
  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(false);

  // reply UI
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const [savingReply, setSavingReply] = useState({});

  // load questions
  useEffect(() => {
    const unsub = subscribeQuestions({
      onData: (rows) => {
        setQuestions(Array.isArray(rows) ? rows : []);
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

  // ✅ subscribe answers when openId changes
  useEffect(() => {
    if (!openId) {
      setAnswers([]);
      return;
    }

    setAnswersLoading(true);
    const unsub = subscribeAnswers(openId, {
      onData: (rows) => {
        const arr = Array.isArray(rows) ? rows : [];
        // RTDB timestamps are numbers (after serverTimestamp resolves)
        arr.sort(
          (a, b) => Number(a?.createdAt || 0) - Number(b?.createdAt || 0),
        );
        setAnswers(arr);
        setAnswersLoading(false);
      },
      onError: (err) => {
        console.error(err);
        setErrMsg(err?.message || "Failed to load answers.");
        setAnswers([]);
        setAnswersLoading(false);
      },
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [openId]);

  const handleSaveReply = async (qid) => {
    const text = String(replyText[qid] ?? "").trim();
    if (!text) return;

    setErrMsg("");
    try {
      setSavingReply((p) => ({ ...p, [qid]: true }));
      await addAnswer(qid, { body: text });

      setReplyText((p) => ({ ...p, [qid]: "" }));
      setReplyOpen((p) => ({ ...p, [qid]: false }));
    } catch (err) {
      console.error(err);
      setErrMsg(err?.message || "Failed to save reply.");
    } finally {
      setSavingReply((p) => ({ ...p, [qid]: false }));
    }
  };

  // ✅ RTDB date helper
  const getDateText = (ts) => {
    const n = Number(ts || 0);
    if (!Number.isFinite(n) || n <= 0) return "";
    try {
      return new Date(n).toLocaleString();
    } catch {
      return "";
    }
  };

  // ✅ decide how to show author name (mentor vs user)
  const getAuthor = (a) => {
    const role = String(a?.role || "").toLowerCase();
    const isMentor =
      role === "mentor" || a?.isMentor === true || a?.mentorUid != null;

    if (isMentor) {
      const mentorName =
        String(a?.mentorName || "").trim() ||
        String(a?.userName || "").trim() || // fallback if you stored mentor name in userName
        "Mentor";
      return { name: mentorName, isMentor: true };
    }

    const name = String(a?.userName || "").trim() || "User";
    return { name, isMentor: false };
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

            // ✅ count from DB field (fast), fallback to loaded answers only if open
            const count = Number(
              q.answersCount ?? (isOpen ? answers.length : 0) ?? 0,
            );

            const showReplyForm = !!replyOpen[q.id];

            // ✅ show only answers of opened question
            const visibleAnswers = isOpen ? answers : [];

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
                        // close reply box when opening a question
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
                      {answersLoading ? (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Loading replies...
                        </div>
                      ) : visibleAnswers.length === 0 ? (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          No replies yet.
                        </div>
                      ) : (
                        visibleAnswers.map((a) => {
                          const author = getAuthor(a);

                          return (
                            <div
                              key={a.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {author.name}
                                  </div>

                                  {author.isMentor && (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                      Mentor
                                    </span>
                                  )}
                                </div>

                                <div className="text-xs text-gray-500">
                                  {getDateText(a.createdAt)}
                                </div>
                              </div>

                              <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                {a.body}
                              </div>
                            </div>
                          );
                        })
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

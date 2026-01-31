/**
 * MentorFeedBack
 *
 * Mentor-facing page for viewing and creating project feedback.
 * Loads project documents for context, subscribes to feedback notes
 * in real time, and allows mentors to add new feedback via a modal.
 */

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

import ActionButton from "../../components/common/ActionButton";
import FeedbackModal from "./FeedbackModal";
import FeedbackList from "../../components/feedback/FeedbackList";

// ✅ mentor-side services
import {
  getProjectDocumentsForMentor,
  createProjectNoteForMentor,
} from "../../services/mentorService";

// ✅ mentor subscribe
import { subscribeProjectNotesMentor } from "../../services/notesService";

export default function MentorFeedBack() {
  const { projectId } = useParams();
  const pid = useMemo(() => String(projectId || "").trim(), [projectId]);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  // 1) load documents (for "about what file")
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!pid) return;

      try {
        const docs = await getProjectDocumentsForMentor(pid);
        if (cancelled) return;

        setDocuments(
          (Array.isArray(docs) ? docs : []).map((d) => ({
            id: d.id,
            title: d.title || d.fileName || "Document",
            fileName: d.fileName || d.title || "Document",
          })),
        );
      } catch (e) {
        console.error("LOAD DOCS ERROR:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pid]);

  // 2) subscribe feedback (mentor)
  useEffect(() => {
    if (!pid) return;

    setLoading(true);
    setErr("");

    const unsub = subscribeProjectNotesMentor(pid, {
      onState: (state) => {
        if (typeof state.loading === "boolean") setLoading(state.loading);
        if (state.error !== undefined) setErr(state.error || "");

        if (state.notes !== undefined) {
          const arr = Array.isArray(state.notes) ? state.notes : [];
          const mapped = arr.map((n) => ({
            id: n.id,
            user: "Mentor",
            message: n.body || "",
            timestamp: n.createdAt
              ? new Date(Number(n.createdAt)).toLocaleString()
              : "",
            aboutDocTitle: n.aboutDocTitle || "General",
            aboutDocId: n.aboutDocId || null,
          }));
          setFeedbackList(mapped);
        }
      },
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [pid]);

  // 3) create feedback (mentor write)
  const handleSave = async (text, meta = {}) => {
    if (!pid) return;

    const body = String(text || "").trim();
    if (!body) return;

    try {
      await createProjectNoteForMentor(pid, {
        body,
        aboutDocId: meta?.aboutDocId || null,
        aboutDocTitle: meta?.aboutDocTitle || null,
      });

      setModalOpen(false);
      // ✅ אין צורך לעדכן feedbackList ידנית — ה-subscribe יעדכן לבד
    } catch (e) {
      console.error("CREATE FEEDBACK ERROR:", e);
      alert(String(e?.message || "Failed to save feedback."));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-transparent dark:bg-[#0f172a]">
      <button
        onClick={() => navigate("/mentor/view-projects")}
        className="flex items-center gap-2 mb-6 transition text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        <IoArrowBack size={20} />
        Back to Projects
      </button>

      <div className="rounded-lg p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1f2933]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-200">
            Notes and Feedback
          </h3>

          <ActionButton
            text="Add Feedback"
            onClick={() => setModalOpen(true)}
          />
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">Loading feedback...</div>
        ) : err ? (
          <div className="text-sm text-red-600">{err}</div>
        ) : feedbackList.length === 0 ? (
          <div className="text-sm text-gray-500">
            No feedback submitted yet.
          </div>
        ) : (
          <FeedbackList feedback={feedbackList} />
        )}
      </div>

      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        documents={documents}
        onSave={handleSave}
      />
    </div>
  );
}

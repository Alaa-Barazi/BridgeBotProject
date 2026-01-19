// src/pages/mentor/ProjectOverViewPage.jsx
/**
 * ProjectOverViewPage (REAL DB)
 * -----------------------------
 * Mentor view for inspecting a single student project (RTDB).
 *
 * Responsibilities:
 * - Display project details, progress, and documents (from RTDB)
 * - Display mentor notes/feedback (from RTDB - live)
 * - Allow mentor to add feedback (writes to RTDB)
 */

// src/pages/mentor/ProjectOverViewPage.jsx
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import HeaderSection from "../../components/overview/HeaderSection";
import SummaryBox from "../../components/overview/SummaryBox";
import DocumentsSection from "../../components/overview/DocumentsSection";
import FeedbackModal from "./FeedbackModal";
import ActionButton from "../../components/common/ActionButton";
import FeedbackList from "../../components/feedback/FeedbackList";

// ✅ Mentor DB services (RTDB)
import {
  getProjectByIdForMentor,
  getProjectDocumentsForMentor,
  createProjectNoteForMentor,
} from "../../services/mentorService";

// ✅ Notes subscribe (mentor reads notes list live)
import { subscribeProjectNotesMentor } from "../../services/notesService";

const ProjectOverViewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const pid = useMemo(() => String(projectId || "").trim(), [projectId]);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [feedbackList, setFeedbackList] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesErr, setNotesErr] = useState("");

  // 1) Load project + documents
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!pid) {
        setErrMsg("Missing project id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrMsg("");

      try {
        const p = await getProjectByIdForMentor(pid);
        if (!p) throw new Error("Project not found.");

        const docs = await getProjectDocumentsForMentor(pid);

        if (cancelled) return;

        setProject(p);

        const normalizedDocs = (Array.isArray(docs) ? docs : []).map((d) => ({
          id: d.id,
          title: d.title || d.fileName || "Document",
          fileName: d.fileName || d.title || "Document",
          createdAt: d.createdAt || null,
          updatedAt: d.updatedAt || d.createdAt || null,
          dataUrl: d.dataUrl || d.dataURL || "",
          downloadURL: d.downloadURL || d.downloadUrl || d.url || "",
          contentType: d.contentType || "",
          size: d.size || 0,
        }));

        setDocuments(normalizedDocs);
      } catch (e) {
        console.error("MENTOR PROJECT LOAD ERROR:", e);
        if (!cancelled)
          setErrMsg(String(e?.message || "Failed to load project."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pid]);

  // 2) Live subscribe to notes/feedback (mentor)
  useEffect(() => {
    if (!pid) return;

    setNotesLoading(true);
    setNotesErr("");

    const unsub = subscribeProjectNotesMentor(pid, {
      onState: (state) => {
        if (typeof state.loading === "boolean") setNotesLoading(state.loading);
        if (state.error !== undefined) setNotesErr(state.error || "");

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

    return () => typeof unsub === "function" && unsub();
  }, [pid]);

  // 3) Create new feedback (writes to RTDB)
  const handleSaveFeedback = async (text, meta = {}) => {
    if (!pid) return;

    const body = String(text || "").trim();
    if (!body) return;

    try {
      await createProjectNoteForMentor(pid, {
        body,
        aboutDocId: meta?.aboutDocId || null,
        aboutDocTitle: meta?.aboutDocTitle || null,
      });

      setFeedbackModalOpen(false);
    } catch (e) {
      console.error("CREATE NOTE ERROR:", e);
      alert(String(e?.message || "Failed to save feedback."));
    }
  };

  if (loading) return <div className="p-8 max-w-5xl mx-auto">Loading...</div>;

  if (!project || errMsg) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <p className="text-center text-gray-600 dark:text-slate-400">
          {errMsg || "Project not found."}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/mentor/view-projects")}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const projectName = project.projectName || "Project";
  const description = project.description || "";
  const leader = project.teamLeader || "-";
  const category = project.category || "-";
  const progress = Number(project.progress ?? 0) || 0;
  const status = project.status || "On track";

  return (
    <div className="p-8 max-w-5xl mx-auto bg-transparent dark:bg-[#0f172a]">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-slate-200">
        Project Overview
      </h1>

      <button
        onClick={() => navigate("/mentor/view-projects")}
        className="flex items-center gap-2 mb-6 transition text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        <IoArrowBack size={20} />
        Back to Projects
      </button>

      <div className="space-y-8">
        <HeaderSection
          projectName={projectName}
          description={description}
          progress={progress}
          status={status}
        />

        <SummaryBox
          teamLeader={leader}
          category={category}
          progress={progress}
          status={status}
        />

        <div className="rounded-lg p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1f2933]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-200">
              Notes and Feedback
            </h3>

            <ActionButton
              text="Add Feedback"
              onClick={() => setFeedbackModalOpen(true)}
            />
          </div>

          {notesLoading ? (
            <div className="text-sm text-gray-500">Loading feedback...</div>
          ) : notesErr ? (
            <div className="text-sm text-red-600">{notesErr}</div>
          ) : feedbackList.length === 0 ? (
            <div className="text-sm text-gray-500">
              No feedback submitted yet.
            </div>
          ) : (
            <FeedbackList feedback={feedbackList} />
          )}
        </div>

        <DocumentsSection documents={documents} />
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        documents={documents}
        onSave={handleSaveFeedback}
      />
    </div>
  );
};

export default ProjectOverViewPage;

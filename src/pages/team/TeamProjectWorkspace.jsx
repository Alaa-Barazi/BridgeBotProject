// src/pages/team/TeamProjectWorkspace.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectHeader from "../../components/team/project/ProjectHeader";
import ProjectTabs from "../../components/team/project/ProjectTabs";
import ChatPanel from "../../components/chatBot/ChatPanel";
import ProjectNotes from "../../components/team/project/ProjectNotes";

import ProjectProgressCard from "../../components/team/project/ProjectProgressCard";
import DocumentsPanel from "../../components/team/project/DocumentsPanel";
import ArchitectureSection from "../../components/team/project/ArchitectureSection";
import EmptyProjectState from "../../components/team/project/EmptyProjectState";

import {
  subscribeTeamProjectWorkspace,
  getTeamIdByUserUid,
  updateProjectProgress,
  getStatusFromProgress,
} from "../../services/projectsService";

import {
  uploadProjectDocumentBase64,
  deleteProjectDocument,
  subscribeProjectDocuments,
} from "../../services/documentService";

import { subscribeProjectNotes } from "../../services/notesService";

export default function TeamProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("documents");
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [teamId, setTeamId] = useState("");
  const [notesUnread, setNotesUnread] = useState(0);

  // ✅ PID - safest source order
  const pid = useMemo(() => {
    return (
      String(projectId || "").trim() ||
      String(project?.id || "").trim() ||
      String(localStorage.getItem("projectId") || "").trim()
    );
  }, [projectId, project?.id]);

  // ✅ load project workspace (project data)
  useEffect(() => {
    setLoading(true);
    setErrMsg("");
    setProject(null);
    setDocuments([]); // will be filled by subscribeProjectDocuments
    setSelectedFile(null);

    const unsub = subscribeTeamProjectWorkspace(projectId, {
      onState: (state) => {
        if (state.redirectTo) {
          navigate(state.redirectTo, { replace: true });
          return;
        }

        if (typeof state.loading === "boolean") setLoading(state.loading);
        if (state.error !== undefined) setErrMsg(state.error || "");
        if (state.project !== undefined) setProject(state.project);
        // ❌ do NOT rely on state.documents here (documents come from documentService subscription)
      },
    });

    return () => typeof unsub === "function" && unsub();
  }, [projectId, navigate]);

  // ✅ subscribe project documents (so when project opens, docs show from RTDB)
  useEffect(() => {
    if (!pid) return;

    const unsub = subscribeProjectDocuments(pid, {
      onState: (state) => {
        if (Array.isArray(state?.documents)) setDocuments(state.documents);
        if (state?.error) setErrMsg(String(state.error || ""));
      },
    });

    return () => typeof unsub === "function" && unsub();
  }, [pid]);

  // ✅ load teamId once (from localStorage or users/{uid})
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ls = String(localStorage.getItem("teamId") || "").trim();
        if (ls) {
          if (!cancelled) setTeamId(ls);
          return;
        }

        const { getAuth } = await import("firebase/auth");
        const user = getAuth().currentUser;
        if (!user) return;

        const tid = await getTeamIdByUserUid(user.uid, {
          syncLocalStorage: true,
        });
        if (!cancelled) setTeamId(tid);
      } catch (e) {
        console.error("TEAMID LOAD ERROR:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ subscribe to notes UNREAD always (badge)
  useEffect(() => {
    if (!pid || !teamId) return;

    const unsub = subscribeProjectNotes(pid, teamId, {
      onState: (state) => {
        if (typeof state.unreadCount === "number") {
          setNotesUnread(Number(state.unreadCount || 0));
        }
      },
    });

    return () => typeof unsub === "function" && unsub();
  }, [pid, teamId]);

  // ✅ progress number (0..100)
  const safeProgress = useMemo(() => {
    const v = Number(project?.progress ?? 0);
    return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0;
  }, [project?.progress]);

  // ✅ status derived from progress (On track / At risk / etc)
  const statusFromProgress = useMemo(() => {
    return getStatusFromProgress(safeProgress);
  }, [safeProgress]);

  const goToArchitectureSelection = useCallback(() => {
    if (!pid) return;
    navigate("/architecture", { state: { projectId: pid } });
  }, [navigate, pid]);

  const getDocTitle = useCallback(
    (d) => d?.title || d?.name || d?.fileName || "Document",
    []
  );

  // NOTE: for download we mainly use dataUrl, but keep this helper if you need
  const getDocUrl = useCallback((d) => d?.dataUrl || d?.url || "", []);

  // ✅ upload handler uses selectedFile ONLY
  const handleUploadSelected = useCallback(async () => {
    if (!pid) return alert("Missing project id.");
    if (!selectedFile) return alert("Please choose a file first.");

    setErrMsg("");
    setUploading(true);

    try {
      // ✅ write to RTDB
      await uploadProjectDocumentBase64(pid, selectedFile);

      // ✅ clear selection
      setSelectedFile(null);

      // ✅ update progress (example: +10 per upload)
      await updateProjectProgress(pid, Math.min(100, safeProgress + 10));
      // ✅ UI docs list will update automatically because of subscribeProjectDocuments
    } catch (e) {
      console.error(e);
      setErrMsg(String(e?.message || "Upload failed."));
    } finally {
      setUploading(false);
    }
  }, [pid, selectedFile, safeProgress]);

  // ✅ delete doc (RTDB + UI refresh via subscription)
  const handleDeleteDoc = useCallback(
    async (docId) => {
      if (!pid) return alert("Missing project id.");
      if (!docId) return;

      setErrMsg("");
      try {
        await deleteProjectDocument(pid, docId);
        // optional immediate UI removal (subscription will also handle it)
        setDocuments((prev) =>
          Array.isArray(prev) ? prev.filter((d) => d?.id !== docId) : []
        );
      } catch (e) {
        console.error(e);
        setErrMsg(String(e?.message || "Delete failed."));
      }
    },
    [pid]
  );

  if (loading) return <div className="p-8">Loading...</div>;

  if (!project || errMsg) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Error
          </h3>
          <p className="text-gray-700 dark:text-gray-200">
            {errMsg || "Project not found"}
          </p>

          {String(errMsg).toLowerCase().includes("logged") && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <ProjectHeader
        projectName={project.projectName}
        description={project.description}
      />

      <ProjectProgressCard
        teamLeader={project.teamLeader || "-"}
        category={project.category || "-"}
        status={statusFromProgress}
        progress={safeProgress}
      />

      <ProjectTabs
        active={activeTab}
        onChange={setActiveTab}
        badges={{ notes: notesUnread }}
      />

      {activeTab === "documents" && (
        <DocumentsPanel
          documents={Array.isArray(documents) ? documents : []}
          selectedFile={selectedFile}
          uploading={uploading}
          onChooseFile={(file) => setSelectedFile(file)}
          onUpload={handleUploadSelected}
          getDocTitle={getDocTitle}
          getDocUrl={getDocUrl}
          onDeleteDoc={handleDeleteDoc}
        />
      )}

      {activeTab === "architecture" && (
        <ArchitectureSection
          architectureConfig={project.architectureConfig}
          onEdit={goToArchitectureSelection}
        />
      )}

      {activeTab === "requirements" && (
        <EmptyProjectState title="Requirements" subtitle="Coming soon" />
      )}

      {activeTab === "notes" && (
        <ProjectNotes projectId={pid} teamId={teamId} />
      )}

      <ChatPanel
        pageContext="project"
        projectContext={{
          projectName: project.projectName,
          category: project.category,
          stage: activeTab,
        }}
      />
    </div>
  );
}

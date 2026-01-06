// src/pages/team/TeamProjectWorkspace.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectHeader from "../../components/team/project/ProjectHeader";
import ProjectTabs from "../../components/team/project/ProjectTabs";
import ChatPanel from "../../components/chatBot/ChatPanel";

import { subscribeTeamProjectWorkspace } from "../../services/projectsService";

import sectionsData from "../../mock/sectionsData";

/* =========================
   Architecture Summary UI
   ========================= */
function ArchitectureSummary({ architectureConfig }) {
  const config =
    architectureConfig && typeof architectureConfig === "object"
      ? architectureConfig
      : {};

  const rows = sectionsData
    .map((section) => {
      const selected = Array.isArray(config[section.id])
        ? config[section.id]
        : [];
      return { section, selected };
    })
    .filter((r) => r.selected.length > 0);

  if (rows.length === 0) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <div className="font-semibold mb-1 text-gray-900 dark:text-white">
          Architecture
        </div>
        <div className="text-sm text-gray-500">
          No architecture selected yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {rows.map(({ section, selected }) => (
        <div
          key={section.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
        >
          <div className="font-semibold text-gray-900 dark:text-white">
            {section.title}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

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

  useEffect(() => {
    setLoading(true);
    setErrMsg("");
    setProject(null);
    setDocuments([]);
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
        if (state.documents !== undefined) setDocuments(state.documents);
      },
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [projectId, navigate]);

  // ✅ allow opening selection page for editing anytime
  const goToArchitectureSelection = useMemo(() => {
    const pid =
      projectId || project?.id || localStorage.getItem("projectId") || "";
    return () => {
      if (!pid) return;
      navigate("/architecture", { state: { projectId: pid } });
    };
  }, [navigate, projectId, project?.id]);

  const getDocTitle = (d) => d?.title || d?.name || d?.fileName || "Document";
  const getDocUrl = (d) => d?.url || d?.downloadURL || d?.downloadUrl || "";

  const progressValue = Number(project?.progress ?? 0);
  const safeProgress = Number.isFinite(progressValue)
    ? Math.max(0, Math.min(100, progressValue))
    : 0;

  if (loading) return <div className="p-8">Loading...</div>;

  if (!project || errMsg) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Error
          </h3>
          <p className="text-gray-700 dark:text-gray-200">{errMsg}</p>

          {errMsg.toLowerCase().includes("logged") && (
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

      {/* INFO BAR */}
      <div className="mt-6 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-6 text-sm items-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Team Leader</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {project.teamLeader || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Category</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {project.category || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {project.status || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Progress</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${safeProgress}%` }}
                />
              </div>
              <span className="text-xs">{safeProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      <ProjectTabs active={activeTab} onChange={setActiveTab} />

      {/* DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <div className="font-semibold mb-2 text-gray-900 dark:text-white">
            Documents
          </div>

          <div className="text-sm text-gray-500 mb-4">
            {documents.length === 0 ? "No documents yet" : "Project documents"}
          </div>

          <label
            className={[
              "inline-block cursor-pointer px-4 py-2 text-white text-sm rounded",
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700",
            ].join(" ")}
          >
            {uploading ? "Uploading..." : "Choose file"}
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleFileUpload(file, e.target);
              }}
            />
          </label>

          {selectedFile && (
            <div className="mt-3 text-xs text-gray-600">
              Selected: <b>{selectedFile.name}</b>
            </div>
          )}

          {documents.length > 0 && (
            <div className="mt-5 space-y-2 text-left">
              {documents.map((d, i) => (
                <div
                  key={d?.id || i}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <span className="text-gray-800 dark:text-gray-100">
                    {getDocTitle(d)}
                  </span>

                  {getDocUrl(d) ? (
                    <a
                      href={getDocUrl(d)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No link</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ARCHITECTURE TAB */}
      {activeTab === "architecture" && (
        <>
          <ArchitectureSummary
            architectureConfig={project.architectureConfig}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={goToArchitectureSelection}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Edit Architecture
            </button>
          </div>
        </>
      )}

      {/* REQUIREMENTS TAB */}
      {activeTab === "requirements" && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <div className="font-semibold mb-2 text-gray-900 dark:text-white">
            Requirements
          </div>
          <div className="text-sm text-gray-500">Coming soon</div>
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === "notes" && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <div className="font-semibold mb-2 text-gray-900 dark:text-white">
            Notes
          </div>
          <div className="text-sm text-gray-500">Coming soon</div>
        </div>
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

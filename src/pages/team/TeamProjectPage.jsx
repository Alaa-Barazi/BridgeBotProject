/**
 * TeamProjectPage
 *
 * Main overview page for a team project.
 * Subscribes to real-time project updates, handles loading and error states,
 * and renders project summary, progress, and navigation to key project areas
 * such as workspace, architecture, documents, quizzes, and the AI assistant.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HeaderSection from "../../components/overview/HeaderSection";
import SummaryBox from "../../components/overview/SummaryBox";
import ActionButton from "../../components/common/ActionButton";

import { subscribeTeamProjectPage } from "../../services/projectsService";

export default function TeamProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [project, setProject] = useState(null);

  useEffect(() => {
    const unsub = subscribeTeamProjectPage(projectId, {
      onState: (state) => {
        if (state.redirectTo) {
          navigate(state.redirectTo, { replace: true });
          return;
        }

        if (typeof state.loading === "boolean") setLoading(state.loading);
        if (state.error !== undefined) setErrMsg(state.error || "");
        if (state.project !== undefined) setProject(state.project || null);
      },
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="text-gray-700 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{errMsg}</p>

          <button
            onClick={() => navigate("/project")}
            className="mt-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const projectName = project.projectName || "My Project";
  const description = project.description || "";
  const progress = Number.isFinite(Number(project.progress))
    ? Number(project.progress)
    : 0;
  const status = project.status || "On track";
  const category = project.category || "General";
  const teamLeader = project.teamLeader || "Team";

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold text-center mb-10">My Project</h1>

      <HeaderSection
        projectName={projectName}
        description={description}
        progress={progress}
        status={status}
      />

      <SummaryBox teamLeader={teamLeader} category={category} status={status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-2">Workspace</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Continue working on documents, requirements, notes and more.
          </p>
          <ActionButton
            text="Open Workspace"
            onClick={() => navigate(`/project/${projectId}`)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-2">Architecture</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create or update your architecture diagram and flow.
          </p>
          <ActionButton
            text="Create / Edit Architecture"
            onClick={() => navigate("/architecture", { state: { projectId } })}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">Documents</h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Upload project documents such as requirements and reports.
        </p>

        <ActionButton
          text="Go to Documents"
          onClick={() => navigate(`/project/${projectId}`)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">Learning & Quiz</h3>
        <ActionButton text="Start Quiz" onClick={() => navigate("/quiz")} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
        <ActionButton
          text="Open Chatbot"
          onClick={() => navigate("/chatbot")}
        />
      </div>
    </div>
  );
}

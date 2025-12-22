import { useState } from "react";
import ProjectHeader from "../../components/team/project/ProjectHeader";
import ProjectProgressCard from "../../components/team/project/ProjectProgressCard";
import ProjectTabs from "../../components/team/project/ProjectTabs";
import DocumentsPanel from "../../components/team/project/DocumentsPanel";

export default function TeamProjectWorkspace({ project }) {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ProjectHeader projectName={project.projectName} description={project.description} />

      <ProjectProgressCard
        status={project.status}
        progress={project.progress}
        category={project.category}
        teamLeader={project.teamLeader}
      />

      <ProjectTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "documents" && <DocumentsPanel documents={project.documents} />}

      {activeTab === "requirements" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Requirements
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Placeholder for requirements view and editor.
          </p>
        </div>
      )}

      {activeTab === "architecture" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Architecture
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Placeholder for architecture builder and device list.
          </p>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Placeholder for team notes and mentor feedback summary.
          </p>
        </div>
      )}
    </div>
  );
}

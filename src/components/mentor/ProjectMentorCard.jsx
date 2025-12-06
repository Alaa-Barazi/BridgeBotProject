import React from "react";
import ProjectMentorView from "./ProjectMentorView";
import ProjectMentorActions from "./ProjectMentorActions";
import StatusIndicator from "./StatusIndicator";

const ProjectMentorCard = ({ project, projectId }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 shadow mb-6">
      <ProjectMentorView
        projectName={project.projectName}
        teamLeader={project.teamLeader}
        description={project.description}
        progress={project.progress}
        status={project.status}
      />

      <StatusIndicator status={project.status} />

      <ProjectMentorActions />
    </div>
  );
};

export default ProjectMentorCard;

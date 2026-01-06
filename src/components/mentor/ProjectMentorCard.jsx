/**
 * ProjectMentorCard
 * -----------------
 * Card used by mentors to view and manage student projects.
 *
 * Responsibilities:
 * - Display project overview information
 * - Show current project status
 * - Provide mentor actions
 *
 * Dark mode design:
 * - Embedded card surface
 * - No floating white blocks
 * - Consistent with mentor layout
 */

import ProjectMentorView from "./ProjectMentorView";
import ProjectMentorActions from "./ProjectMentorActions";
import StatusIndicator from "./StatusIndicator";

const ProjectMentorCard = ({ project, projectId }) => {
  return (
    <div
      className="rounded-lg p-6 mb-6
                 bg-white dark:bg-[#111827]
                 border border-gray-200 dark:border-[#1f2933]
                 shadow-sm dark:shadow-none"
    >
      <ProjectMentorView
        projectName={project.projectName}
        teamLeader={project.teamLeader}
        description={project.description}
        progress={project.progress}
        status={project.status}
      />

      <div className="mt-4 flex justify-center">
        <StatusIndicator status={project.status} />
      </div>

      <div className="mt-4">
        <ProjectMentorActions projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectMentorCard;

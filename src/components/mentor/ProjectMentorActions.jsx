/**
 * ProjectMentorActions
 * --------------------
 * Action buttons for mentors to inspect and manage a student project.
 *
 * Responsibilities:
 * - Navigate to architecture, requirements, chatbot logs
 * - Open full project overview
 *
 * Dark mode design:
 * - Buttons remain clearly visible
 * - No visual noise or harsh contrast
 */

import ActionButton from "../common/ActionButton";
import { useNavigate } from "react-router-dom";

const ProjectMentorActions = ({ projectId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <ActionButton
        text="Open Project Overview"
        onClick={() => navigate(`/mentor/view-projects/${projectId}`)}
      />
    </div>
  );
};

export default ProjectMentorActions;

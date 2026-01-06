import React from "react";
import ActionButton from "../common/ActionButton";
import { Navigate, useNavigate } from "react-router-dom";
{
  /*
      ⭐ View Architecture - Mentor can see the architecture submitted by the team.

⭐ View Requirements Document - Opens the requirement doc (the one students create).

⭐ Chatbot Prompts Log - What questions students asked the bot and how they interacted with it.

⭐ Send Feedback - Mentor writes notes or comments to the team.

⭐ Open Project Overview
    Summary
Architecture
Requirements
Student questions
Diary log
Quiz performance
Etc.
      */
}
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

const ProjectMentorActions = ({ projectId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {/* <ActionButton text="View Architecture" />
      <ActionButton text="Open Requirements Doc" />
      <ActionButton text="Chatbot Prompts Log" /> */}
      <ActionButton
        text="Open Project Overview"
        onClick={() => navigate(`/mentor/view-projects/${projectId}`)}
      />
    </div>
  );
};

export default ProjectMentorActions;

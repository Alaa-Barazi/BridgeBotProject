/**
 * ProjectOverViewPage
 * -------------------
 * Mentor view for inspecting a single student project.
 *
 * Responsibilities:
 * - Display project details, progress, and documents
 * - Allow mentor feedback and notes
 *
 * Dark mode design:
 * - Calm, readable surfaces
 * - Clear section separation
 * - No bright white blocks
 */

import { IoArrowBack } from "react-icons/io5";
import HeaderSection from "../../components/overview/HeaderSection";
import SummaryBox from "../../components/overview/SummaryBox";
import DocumentsSection from "../../components/overview/DocumentsSection";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import ActionButton from "../../components/common/ActionButton";
import { useState } from "react";
import FeedbackList from "../../components/feedback/FeedbackList";

const sampleProjects = [
  {
    id: "1",
    name: "Smart Greenhouse",
    description: "IoT based environmental monitoring system",
    leader: "Alaa",
    category: "IoT",
    progress: 70,
    status: "On track",
    documents: [
      {
        id: "d1",
        title: "Requirements Document",
        content: "Requirements content here...",
      },
      {
        id: "d2",
        title: "System Architecture",
        content: "Architecture content...",
      },
    ],
  },
  {
    id: "2",
    name: "Smart Parking System",
    description: "Camera based parking automation",
    leader: "Rozen",
    category: "Computer Vision",
    progress: 40,
    status: "Minor issues",
    documents: [
      { id: "d1", title: "Requirements Doc", content: "Parking req doc..." },
    ],
  },
];

const ProjectOverViewPage = () => {
  const { projectId } = useParams();
  const project = sampleProjects.find((p) => p.id === projectId);

  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  if (!project) {
    return (
      <p className="text-center text-gray-600 dark:text-slate-400">
        Project not found.
      </p>
    );
  }

  const handleSaveFeedback = (text) => {
    setFeedbackList([
      ...feedbackList,
      {
        id: Date.now(),
        user: "Mentor",
        message: text,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  return (
    <div
      className="p-8 max-w-5xl mx-auto
                    bg-transparent dark:bg-[#0f172a]"
    >
      <h1
        className="text-4xl font-bold text-center mb-10
                     text-gray-900 dark:text-slate-200"
      >
        Project Overview
      </h1>

      <button
        onClick={() => navigate("/mentor/view-projects")}
        className="flex items-center gap-2 mb-6 transition
                   text-blue-600 dark:text-blue-400
                   hover:text-blue-700 dark:hover:text-blue-300"
      >
        <IoArrowBack size={20} />
        Back to Projects
      </button>

      <div className="space-y-8">
        <HeaderSection
          projectName={project.name}
          description={project.description}
          progress={project.progress}
          status={project.status}
        />

        <SummaryBox
          teamLeader={project.leader}
          category={project.category}
          progress={project.progress}
          status={project.status}
        />

        {/* Notes and feedback */}
        <div
          className="rounded-lg p-6
                     bg-white dark:bg-[#111827]
                     border border-gray-200 dark:border-[#1f2933]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-xl font-semibold
                           text-gray-900 dark:text-slate-200"
            >
              Notes and Feedback
            </h3>

            <ActionButton
              text="Add Feedback"
              onClick={() => setFeedbackModalOpen(true)}
            />
          </div>

          <FeedbackList feedback={feedbackList} />
        </div>

        <DocumentsSection documents={project.documents} />
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSave={handleSaveFeedback}
      />
    </div>
  );
};

export default ProjectOverViewPage;

import { IoArrowBack } from "react-icons/io5"; // icon
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
  if (!project) return <p className="text-center">Project not found.</p>;

  const handleSaveFeedback = (text) => {
    const newFeedback = {
      id: Date.now(),
      user: "Mentor",
      message: text,
      timestamp: new Date().toLocaleString(),
    };

    setFeedbackList([...feedbackList, newFeedback]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        Project Overview
      </h1>

      {/* Back Button */}
      <button
        onClick={() => navigate("/mentor/view-projects")}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 
                   hover:text-blue-700 dark:hover:text-blue-300 
                   font-medium mb-6 transition"
      >
        <IoArrowBack size={20} />
        Back to Projects
      </button>

      {/* Header Section */}
      <HeaderSection
        projectName={project.name}
        description={project.description}
        progress={project.progress}
        status={project.status}
      />

      {/* Summary Section */}
      <SummaryBox
        teamLeader={project.leader}
        category={project.category}
        progress={project.progress}
        status={project.status}
      />

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notes and Feedback
          </h3>

          <ActionButton
            text="Add Feedback"
            onClick={() => setFeedbackModalOpen(true)}
          />
        </div>

        <FeedbackList feedback={feedbackList} />
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSave={handleSaveFeedback}
      />

      {/* Documents */}
      <DocumentsSection documents={project.documents} />
    </div>
  );
};

export default ProjectOverViewPage;

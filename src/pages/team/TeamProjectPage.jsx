import { useParams } from "react-router-dom";
import HeaderSection from "../../components/overview/HeaderSection";
import SummaryBox from "../../components/overview/SummaryBox";
import ActionButton from "../../components/common/ActionButton";

const TeamProjectPage = () => {
  const { projectId } = useParams();

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold text-center mb-10">My Project</h1>

      {/* Header */}
      <HeaderSection
        projectName="Smart Greenhouse"
        description="IoT based environmental monitoring system"
        progress={40}
        status="In progress"
      />

      {/* Summary */}
      <SummaryBox teamLeader="You" category="IoT" status="In progress" />

      {/* Architecture */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">Architecture</h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No architecture uploaded yet.
        </p>

        <ActionButton text="Create Architecture" />
      </div>

      {/* Documents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">Documents</h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Upload project documents such as requirements and reports.
        </p>

        <ActionButton text="Upload Document" />
      </div>

      {/* Learning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">Learning & Quiz</h3>
        <ActionButton text="Start Quiz" />
      </div>

      {/* Bot */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
        <ActionButton text="Open Chatbot" />
      </div>
    </div>
  );
};

export default TeamProjectPage;

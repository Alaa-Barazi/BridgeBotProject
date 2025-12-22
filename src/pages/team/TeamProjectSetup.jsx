import { useNavigate } from "react-router-dom";
import EmptyProjectState from "../../components/team/project/EmptyProjectState";

export default function TeamProjectSetup() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Project Setup
      </h1>

      <EmptyProjectState onCreateArchitecture={() => navigate("/architecture")} />

      <div className="mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Next steps
        </h3>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Create architecture (devices, protocols, data flow)</li>
          <li>Add requirements document</li>
          <li>Upload supporting documents</li>
          <li>Use the forum and bot for questions</li>
        </ul>
      </div>
    </div>
  );
}

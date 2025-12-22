import { useNavigate } from "react-router-dom";

const ActionsPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Project Tools
      </h3>

      <div className="flex flex-wrap gap-4">
        <button onClick={() => navigate("/quiz")} className="btn-primary">
          Quiz
        </button>

        <button onClick={() => navigate("/forum")} className="btn-primary">
          Forum
        </button>

        <button onClick={() => navigate("/chatbot")} className="btn-primary">
          Chatbot
        </button>
      </div>
    </div>
  );
};

export default ActionsPanel;

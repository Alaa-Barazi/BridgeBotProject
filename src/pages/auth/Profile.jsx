import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const [teamInfo, setTeamInfo] = useState({
    teamName: "BridgeBot Team",
    email: "team@bridgebot.com",
    joinedOn: "Jan 25, 2025",
  });

  const handleToggleEdit = () => {
    if (isEditMode) {
      console.log("Changes saved:", teamInfo);
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {teamInfo.teamName}
            </span>{" "}
            👋
          </h2>
        </div>

        {/* Avatar */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full mx-auto border-2 border-gray-200 dark:border-gray-700 p-1"
            />
            {isEditMode && (
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs p-1 rounded-full cursor-pointer">
                ✎
              </span>
            )}
          </div>
        </div>

        {/* Team Info Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Team Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name
            </label>
            <input
              name="teamName"
              className={`w-full px-3 py-2 rounded-md border transition ${
                isEditMode
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
              value={teamInfo.teamName}
              readOnly={!isEditMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              name="email"
              className={`w-full px-3 py-2 rounded-md border transition ${
                isEditMode
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
              value={teamInfo.email}
              readOnly={!isEditMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Joined On
            </label>
            <input
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              value={teamInfo.joinedOn}
              readOnly
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Learning Status
          </h3>
          <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 text-sm font-medium">
            Level: Beginner ⭐
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleToggleEdit}
            className={`w-full py-2 rounded-md font-medium transition shadow-sm ${
              isEditMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isEditMode ? "Save Changes" : "Edit Profile"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

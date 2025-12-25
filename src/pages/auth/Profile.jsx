import React, { useState } from "react";
const Profile = () => {
  // State to handle edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // State to handle form data
  const [teamInfo, setTeamInfo] = useState({
    teamName: "BridgeBot Team",
    email: "team@bridgebot.com",
    joinedOn: "Jan 25, 2025",
  });

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Logic for saving changes would go here
      console.log("Changes saved:", teamInfo);
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-slate-800 to-black p-6">
      {/* Component Specific CSS */}
      <style>
        {`
          .glass-card {
            backdrop-filter: blur(14px);
            background: rgba(255,255,255,0.18);
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
            border: 1px solid rgba(255,255,255,0.25);
          }
          .info-box {
            background: rgba(255, 255, 255, 0.7);
            color: black;
            padding: 10px 14px;
            border-radius: 10px;
            width: 100%;
            margin-bottom: 12px;
            border: 1px solid rgba(255,255,255,0.4);
            transition: 0.3s;
          }
          .info-box.editable {
            background: white !important;
            border: 1px solid #3b82f6 !important;
            box-shadow: 0 0 8px #3b82f67a;
            outline: none;
          }
        `}
      </style>

      <div className="glass-card w-full max-w-lg p-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">
            Welcome, <span className="text-blue-300">{teamInfo.teamName}</span>{" "}
            👋
          </h2>
        </div>

        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg"
          />
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold mb-2">Team Information</p>

          <label className="text-gray-300 text-sm">Team Name</label>
          <input
            name="teamName"
            className={`info-box ${isEditMode ? "editable" : ""}`}
            value={teamInfo.teamName}
            readOnly={!isEditMode}
            onChange={handleChange}
          />

          <label className="text-gray-300 text-sm">Email</label>
          <input
            name="email"
            className={`info-box ${isEditMode ? "editable" : ""}`}
            value={teamInfo.email}
            readOnly={!isEditMode}
            onChange={handleChange}
          />

          <label className="text-gray-300 text-sm">Joined On</label>
          <input className="info-box" value={teamInfo.joinedOn} readOnly />
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold mb-2">Learning Status</p>
          <div className="info-box">Level: Beginner ⭐</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleToggleEdit}
            className={`w-full p-3 rounded shadow-lg transition font-medium ${
              isEditMode
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Edit Profile"}
          </button>

          <button className="w-full p-3 bg-red-500 hover:bg-red-600 rounded shadow-lg transition font-medium">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

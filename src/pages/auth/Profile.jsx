// src/pages/auth/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  loadStudentProfile,
  updateTeamName,
  logout,
} from "../../services/authService";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [teamId, setTeamId] = useState(null);

  const [teamInfo, setTeamInfo] = useState({
    teamName: "",
    email: "",
    teamNumber: "",
    joinedOn: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // ✅ FIX: pass user.uid (string), not the whole user object
        const res = await loadStudentProfile(user.uid);

        setTeamId(res.teamId);
        setTeamInfo(res.teamInfo);
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);
        alert(String(err?.message || "Failed to load profile."));
        // optional: don't force logout, just send to login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleToggleEdit = async () => {
    if (isEditMode) {
      try {
        await updateTeamName(teamId, teamInfo.teamName);
        alert("Changes saved successfully!");
      } catch (err) {
        alert(String(err?.message || "Failed to save changes."));
        return;
      }
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <p className="text-gray-700 dark:text-gray-200">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {teamInfo.teamName || "Team"}
            </span>{" "}
            👋
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name
            </label>
            <input
              name="teamName"
              value={teamInfo.teamName}
              readOnly={!isEditMode}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                isEditMode
                  ? "border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Number
            </label>
            <input
              name="teamNumber"
              value={teamInfo.teamNumber}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              value={teamInfo.email}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Joined On
            </label>
            <input
              value={teamInfo.joinedOn}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleToggleEdit}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {isEditMode ? "Save Changes" : "Edit Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 border border-red-300 text-red-600 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

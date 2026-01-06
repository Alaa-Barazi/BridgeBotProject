// src/pages/team/TeamProjectHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase";
import { loadStudentProfile } from "../../services/authService";
import { getTeamProjectByOwnerTeamId } from "../../services/projectsService";

import TeamProjectSetup from "./TeamProjectSetup";
import TeamProjectWorkspace from "./TeamProjectWorkspace";
// או Architecture אם זה מה שאת רוצה במקום setup
// import Architecture from "./TeamProjectArchitecture";

export default function TeamProjectHome() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hasProject, setHasProject] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setErrMsg("");

      try {
        if (!user) {
          navigate("/login");
          return;
        }

        // 1) get teamId from users/{uid}
        const prof = await loadStudentProfile(user.uid); // חשוב: uid
        const tid = String(prof.teamId || "").trim();
        if (!tid) {
          setErrMsg("teamId missing in user profile.");
          setLoading(false);
          return;
        }

        setTeamId(tid);
        localStorage.setItem("teamId", tid);

        // 2) find project by ownerteamid
        const proj = await getTeamProjectByOwnerTeamId(tid);

        if (!proj) {
          setHasProject(false);
          setProjectId(null);
          setLoading(false);
          return;
        }

        setHasProject(true);
        setProjectId(proj.id);

        // אופציונלי: לנתב לכתובת הרשמית
        navigate(`/project/${proj.id}`, { replace: true });
      } catch (e) {
        console.error("TeamProjectHome error:", e);
        setErrMsg(e?.message || "Failed to load project.");
        setHasProject(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading...</div>;

  if (errMsg) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-5">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{errMsg}</p>
        </div>
      </div>
    );
  }

  // אם אין פרויקט – תראי מסך הקמה
  if (!hasProject) {
    // אפשר להחליף ל <Architecture />
    return <TeamProjectSetup teamId={teamId} />;
  }

  // אם כן יש פרויקט – אפשר להציג workspace (אבל לרוב navigate כבר יקח לשם)
  return <TeamProjectWorkspace projectId={projectId} />;
}

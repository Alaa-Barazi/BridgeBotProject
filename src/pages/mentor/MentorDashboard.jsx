// src/pages/mentor/MentorDashboard.jsx
// Mentor Dashboard page:
// - Loads ALL teams + ALL users (mentor-only by Firestore Rules)
// - Shows Teams + members by default
// - Has a toggle button to show/hide the "All Users" table
// - Uses Tailwind classes (matches your project style)

import { useEffect, useMemo, useState } from "react";
import { auth } from "../../firebase";
import { getAllTeams, getAllUsers } from "../../services/mentorService";

export default function MentorDashboard() {
  /* -----------------------------
     UI state
  ----------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  /* -----------------------------
     Data state
  ----------------------------- */
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  /* -----------------------------
     Load data once on mount
  ----------------------------- */
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError("");

      try {
        // Load both in parallel
        const [teamsData, usersData] = await Promise.all([
          getAllTeams(),
          getAllUsers(),
        ]);

        setTeams(teamsData);
        setUsers(usersData);
      } catch (e) {
        console.error("MentorDashboard load error:", e);

        if (e?.code === "permission-denied") {
          setError(
            "Permission denied. Check Firestore Rules: mentor must be allowed to LIST users and teams."
          );
        } else {
          setError("Failed to load data. Check console for details.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  /* -----------------------------
     Helper: Map uid -> user object
  ----------------------------- */
  const userByUid = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      // If you store uid inside the doc:
      if (u?.uid) map.set(u.uid, u);
      // If sometimes uid is doc id:
      else if (u?.id) map.set(u.id, u);
    });
    return map;
  }, [users]);

  /* -----------------------------
     Optional: Sort teams by teamNumber/teamId
  ----------------------------- */
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const A = String(a.teamNumber || a.teamId || a.id || "");
      const B = String(b.teamNumber || b.teamId || b.id || "");
      return A.localeCompare(B, undefined, { numeric: true });
    });
  }, [teams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* =============================
            Header Card
        ============================== */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mentor Dashboard
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Logged in as:{" "}
            <span className="font-medium">
              {auth.currentUser?.email || "—"}
            </span>
          </p>

          {/* Toggle button */}
          <div className="mt-4">
            <button
              onClick={() => setShowUsers((v) => !v)}
              className="px-4 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900"
            >
              {showUsers ? "Hide Users" : "Show Users"}
            </button>
          </div>
        </div>

        {/* =============================
            Loading / Error
        ============================== */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-200">Loading data…</p>
          </div>
        )}

        {error && (
          <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* =============================
            Main content
        ============================== */}
        {!loading && !error && (
          <>
            {/* =============================
                All Users (toggle)
            ============================== */}
            {showUsers && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    All Users ({users.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 pr-4 text-gray-700 dark:text-gray-300 text-center align-middle">
                          Name
                        </th>
                        <th className="py-2 pr-4 text-gray-700 dark:text-gray-300 text-center align-middle">
                          Email
                        </th>
                        <th className="py-2 pr-4 text-gray-700 dark:text-gray-300 text-center align-middle">
                          Team
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.uid || u.id}
                          className="border-b border-gray-100 dark:border-gray-800"
                        >
                          <td className="py-2 pr-4 text-gray-900 dark:text-white">
                            {u.userName || "—"}
                          </td>

                          <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                            {u.email || "—"}
                          </td>

                          <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                            {u.teamId || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =============================
                Teams + Members
            ============================== */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Teams ({teams.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTeams.map((t) => {
                  const teamKey = t.teamId || t.id;
                  const members = Array.isArray(t.memberUids)
                    ? t.memberUids
                    : [];

                  return (
                    <div
                      key={teamKey}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {t.teamName || `Team ${t.teamNumber || teamKey}`}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        teamId: {teamKey} | members: {members.length}
                      </div>

                      <div className="mt-3 space-y-2">
                        {members.length === 0 ? (
                          <div className="text-sm text-gray-500">
                            No members yet.
                          </div>
                        ) : (
                          members.map((uid) => {
                            const u = userByUid.get(uid);

                            return (
                              <div
                                key={uid}
                                className="text-sm flex items-center justify-between"
                              >
                                <div className="text-gray-800 dark:text-gray-200">
                                  {u ? (
                                    <>
                                      <span className="font-medium">
                                        {u.userName || "—"}
                                      </span>{" "}
                                      <span className="text-gray-500">
                                        ({u.email || "—"})
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-gray-500">
                                      {uid} (no user doc)
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

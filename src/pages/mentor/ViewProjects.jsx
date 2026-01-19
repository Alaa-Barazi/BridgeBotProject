/**
 * ViewProjects
 * ------------
 * Mentor page for browsing and filtering student projects.
 *
 * Responsibilities:
 * - Search and filter projects
 * - Display project status and progress
 *
 * Dark mode design:
 * - Clear content surfaces
 * - No floating light elements
 * - Calm, professional tone
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeMentorProjects } from "../../services/mentorService";

export default function ViewProjects() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [projects, setProjects] = useState([]);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const unsub = subscribeMentorProjects({
      onState: (s) => {
        if (typeof s.loading === "boolean") setLoading(s.loading);
        if (s.error !== undefined) setErr(s.error || "");
        if (s.projects !== undefined)
          setProjects(Array.isArray(s.projects) ? s.projects : []);
      },
    });

    return () => typeof unsub === "function" && unsub();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return projects.filter((p) => {
      const name = String(p.projectName || "").toLowerCase();
      const desc = String(p.description || "").toLowerCase();
      const leader = String(p.teamLeader || "").toLowerCase();
      const status = String(p.status || "");

      const matchQ =
        !qq || name.includes(qq) || desc.includes(qq) || leader.includes(qq);
      const matchStatus = !statusFilter || status === statusFilter;

      return matchQ && matchStatus;
    });
  }, [projects, q, statusFilter]);

  if (loading) return <div className="p-8">Loading projects...</div>;

  if (err) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="font-semibold text-gray-900 dark:text-white">
            Error
          </div>
          <div className="mt-2 text-sm text-red-600">{err}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-transparent dark:bg-[#0f172a]">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-slate-200">
        View Student Projects
      </h1>

      <div className="flex gap-3 items-center mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects..."
          className="w-full max-w-md px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-slate-200"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-900 dark:text-slate-200"
        >
          <option value="">Filter by status</option>
          <option value="On track">On track</option>
          <option value="Minor issues">Minor issues</option>
          <option value="At risk">At risk</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No projects found.</div>
      ) : (
        <div className="space-y-6">
          {filtered.map((p) => {
            const progress = Number(p.progress ?? 0);
            const safeProgress = Number.isFinite(progress)
              ? Math.max(0, Math.min(100, progress))
              : 0;

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1f2933] rounded-lg p-6"
              >
                <div className="text-center">
                  <div className="text-sm text-gray-500">Team leader:</div>
                  <div className="font-semibold text-gray-900 dark:text-slate-200">
                    {p.teamLeader || "-"}
                  </div>

                  <div className="mt-2 text-sm text-gray-500">Description:</div>
                  <div className="text-gray-800 dark:text-slate-300">
                    {p.description || "-"}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{safeProgress}%</span>
                  </div>

                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-green-600"
                      style={{ width: `${safeProgress}%` }}
                    />
                  </div>

                  <div className="mt-4 text-center text-sm">
                    <div className="text-gray-500">
                      Status: {p.status || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate(`/mentor/project-overview/${p.id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Open Project Overview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

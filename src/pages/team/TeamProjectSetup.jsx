/**
 * TeamProjectSetup
 *
 * Initial project creation page for a team.
 * Collects basic project details, validates required fields,
 * creates the project in the backend, and routes the team
 * to the architecture configuration step.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  subscribeTeamProjectSetup,
  createProjectFromSetup,
} from "../../services/projectsService";

export default function TeamProjectSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    category: "",
    description: "",
    teamLeader: "",
  });

  const [touched, setTouched] = useState({
    projectName: false,
    teamLeader: false,
  });

  useEffect(() => {
    const unsub = subscribeTeamProjectSetup({
      onState: (state) => {
        if (state.redirectTo) {
          navigate(state.redirectTo, { replace: true });
          return;
        }
        if (typeof state.loading === "boolean") setLoading(state.loading);
        if (state.teamId !== undefined) setTeamId(state.teamId || "");
        if (state.error) alert(state.error);
      },
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const markTouched = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!String(form.projectName).trim())
      e.projectName = "Project Name is required.";
    if (!String(form.teamLeader).trim())
      e.teamLeader = "Team Leader is required.";
    return e;
  }, [form.projectName, form.teamLeader]);

  const canSubmit = Object.keys(errors).length === 0 && !isSaving;

  const handleCreateProject = async () => {
    try {
      if (errors.projectName || errors.teamLeader) {
        setTouched({ projectName: true, teamLeader: true });
        return;
      }

      setIsSaving(true);

      const result = await createProjectFromSetup({
        projectName: form.projectName,
        category: form.category,
        description: form.description,
        teamLeader: form.teamLeader,
      });

      localStorage.setItem("projectId", result.projectId);
      navigate("/architecture", { state: { projectId: result.projectId } });
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err);
      alert(String(err?.message || "Failed to create project."));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Create your project
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
          Add the basic details now. You’ll continue to Architecture after
          saving.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-xs text-gray-700 dark:text-gray-200">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
          Team ID: <span className="font-semibold">{teamId || "-"}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-blue-600" />

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="projectName"
                  value={form.projectName}
                  onChange={onChange}
                  onBlur={() => markTouched("projectName")}
                  className={[
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-gray-700",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400",
                    touched.projectName && errors.projectName
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400",
                    "outline-none focus:ring-4 transition",
                  ].join(" ")}
                />
                {touched.projectName && errors.projectName ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.projectName}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className={[
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-gray-700",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400",
                    "border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400",
                    "outline-none focus:ring-4 transition",
                  ].join(" ")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  placeholder="Write 1–2 lines about what your project does..."
                  className={[
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-gray-700",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400",
                    "border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400",
                    "outline-none focus:ring-4 transition resize-none",
                  ].join(" ")}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Team Leader <span className="text-red-500">*</span>
                </label>
                <input
                  name="teamLeader"
                  value={form.teamLeader}
                  onChange={onChange}
                  onBlur={() => markTouched("teamLeader")}
                  className={[
                    "w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-gray-700",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400",
                    touched.teamLeader && errors.teamLeader
                      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400",
                    "outline-none focus:ring-4 transition",
                  ].join(" ")}
                />
                {touched.teamLeader && errors.teamLeader ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.teamLeader}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-1">
                <div className="h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tips
                  </div>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Keep the name short and unique.</li>
                    <li>• Category can be “IoT”, “Web”, “AI”, etc.</li>
                    <li>• Description helps you later in documentation.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                onClick={handleCreateProject}
                disabled={!canSubmit}
                className={[
                  "px-6 py-3 rounded-lg font-medium text-white transition",
                  "bg-blue-600 hover:bg-blue-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {isSaving ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

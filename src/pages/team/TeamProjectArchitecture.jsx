/**
 * TeamProjectArchitecture
 *
 * React page that allows a team to configure and select their project architecture.
 * The page displays predefined architecture sections with selectable options
 * and persists the selection per project.
 *
 * Data flow:
 * - sectionsData defines available architecture sections and options
 * - User selections are stored in selectedOptions state
 * - Data is fetched and saved via projectsService
 *
 * Navigation:
 * - Redirects to the project page after successful save
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProjectProgress } from "../../services/projectsService";

import SectionAccordion from "../../components/common/SectionAccordion.jsx";
import sectionsData from "../../mock/sectionsData.js";

import {
  saveProjectArchitectureConfig,
  getProjectById,
} from "../../services/projectsService";

function TeamProjectArchitecture() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectId = useMemo(() => {
    return (
      location?.state?.projectId || localStorage.getItem("projectId") || ""
    );
  }, [location?.state?.projectId]);

  const emptySelection = useMemo(() => {
    const initial = {};
    sectionsData.forEach((section) => {
      initial[section.id] = [];
    });
    return initial;
  }, []);

  const [selectedOptions, setSelectedOptions] = useState(emptySelection);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        if (!projectId) {
          navigate("/project", { replace: true });
          return;
        }

        const p = await getProjectById(projectId);
        const existing = p?.architectureConfig;

        if (!alive) return;

        if (existing && typeof existing === "object") {
          setSelectedOptions({ ...emptySelection, ...existing });
        } else {
          setSelectedOptions(emptySelection);
        }
      } catch (err) {
        console.error("ARCH LOAD ERROR:", err);
        alert(String(err?.message || "Failed to load architecture."));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [projectId, navigate, emptySelection]);

  const handleToggle = (sectionId, option) => {
    setSelectedOptions((prev) => {
      const list = Array.isArray(prev[sectionId]) ? prev[sectionId] : [];
      const alreadySelected = list.includes(option);

      const updated = alreadySelected
        ? list.filter((opt) => opt !== option)
        : [...list, option];

      return { ...prev, [sectionId]: updated };
    });
  };

  const handleSave = async () => {
    try {
      if (!projectId) throw new Error("Missing projectId.");
      setSaving(true);

      await saveProjectArchitectureConfig(projectId, selectedOptions);

      alert("Saved ✅");
      navigate(`/project/${projectId}`, { replace: true });
    } catch (err) {
      console.error("ARCH SAVE ERROR:", err);
      alert(String(err?.message || "Failed to save selection."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center
                      bg-slate-100 dark:bg-gray-900 px-4"
      >
        <div className="text-slate-700 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center
                    bg-slate-100 dark:bg-gray-900 py-10 px-4"
    >
      <div
        className="w-full max-w-xl p-8 rounded-2xl
                      bg-white dark:bg-gray-800
                      shadow-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Configuration Selection
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Choose the components you want for your project architecture.
          </p>
        </div>

        {sectionsData.map((section) => (
          <SectionAccordion
            key={section.id}
            sectionId={section.id}
            title={section.title}
            options={section.options}
            selectedOptions={selectedOptions[section.id] || []}
            onOptionToggle={(option) => handleToggle(section.id, option)}
          />
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className={[
            "mt-6 w-full px-6 py-3 text-white rounded-lg font-semibold shadow transition",
            "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          {saving ? "Saving..." : "Save Selection"}
        </button>
      </div>
    </div>
  );
}

export default TeamProjectArchitecture;

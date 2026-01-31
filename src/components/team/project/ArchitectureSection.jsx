/**
 * ArchitectureSection
 *
 * Displays a summary of the selected project architecture.
 * Groups selected components by section and provides
 * an option to navigate to the architecture editor.
 */

import { useMemo } from "react";
import sectionsData from "../../../mock/sectionsData";

function ArchitectureSummary({ architectureConfig }) {
  const config =
    architectureConfig && typeof architectureConfig === "object"
      ? architectureConfig
      : {};

  const rows = sectionsData
    .map((section) => {
      const selected = Array.isArray(config[section.id])
        ? config[section.id]
        : [];
      return { section, selected };
    })
    .filter((r) => r.selected.length > 0);

  if (rows.length === 0) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <div className="font-semibold mb-1 text-gray-900 dark:text-white">
          Architecture
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No architecture selected yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {rows.map(({ section, selected }) => (
        <div
          key={section.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
        >
          <div className="font-semibold text-gray-900 dark:text-white">
            {section.title}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-sm
                  bg-gray-100 dark:bg-gray-700
                  text-gray-700 dark:text-gray-200
                  border border-gray-200 dark:border-gray-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ArchitectureSection({ architectureConfig, onEdit }) {
  const canEdit = useMemo(() => typeof onEdit === "function", [onEdit]);

  return (
    <>
      <ArchitectureSummary architectureConfig={architectureConfig} />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onEdit}
          disabled={!canEdit}
          className={[
            "px-4 py-2 rounded text-white transition",
            canEdit
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed",
          ].join(" ")}
        >
          Edit Architecture
        </button>
      </div>
    </>
  );
}

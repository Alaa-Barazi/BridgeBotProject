/**
 * SectionAccordion
 *
 * Collapsible accordion component for architecture sections.
 * Displays a section title and toggles a list of selectable options.
 * Uses CheckboxList to manage option selection state.
 */

import React, { useState } from "react";
import CheckboxList from "./CheckboxList.jsx";

function SectionAccordion({
  sectionId,
  title,
  options,
  selectedOptions,
  onOptionToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          w-full flex justify-between items-center px-6 py-3
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-100
          font-medium shadow-sm rounded-lg
          border border-gray-300 dark:border-gray-700
          hover:bg-blue-50 dark:hover:bg-gray-700
          transition
        "
      >
        <span>{title}</span>
        <span>{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div
          className="
            px-4 py-3
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-b-lg
          "
        >
          <CheckboxList
            sectionId={sectionId}
            options={options}
            selectedOptions={selectedOptions}
            onOptionToggle={onOptionToggle}
          />
        </div>
      )}
    </div>
  );
}

export default SectionAccordion;

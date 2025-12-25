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
        className="w-full flex justify-between items-center px-6 py-3 bg-white text-gray-800 font-medium shadow-sm rounded-lg border border-gray-300 hover:bg-blue-50 transition"
      >
        <span>{title}</span>
        <span>{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-white border border-gray-200 rounded-b-lg">
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

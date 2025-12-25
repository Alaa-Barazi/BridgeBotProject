import React, { useState } from "react";

import SectionAccordion from "../../components/common/SectionAccordion.jsx";
import sectionsData from "../../mock/sectionsData.js";
function Architecture() {
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    sectionsData.forEach((section) => {
      initial[section.id] = [];
    });
    return initial;
  });

  const handleToggle = (sectionId, option) => {
    setSelectedOptions((prev) => {
      const alreadySelected = prev[sectionId].includes(option);
      const updated = alreadySelected
        ? prev[sectionId].filter((opt) => opt !== option)
        : [...prev[sectionId], option];

      return { ...prev, [sectionId]: updated };
    });
  };

  const handleSave = () => {
    alert(JSON.stringify(selectedOptions, null, 2));
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-100 py-10 px-4">
      <div className="w-full max-w-xl p-8 rounded-2xl bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">
          Configuration Selection
        </h1>

        {sectionsData.map((section) => (
          <SectionAccordion
            key={section.id}
            sectionId={section.id} // ✅ important
            title={section.title}
            options={section.options}
            selectedOptions={selectedOptions[section.id]}
            onOptionToggle={(option) => handleToggle(section.id, option)}
          />
        ))}

        <button
          onClick={handleSave}
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Save Selection
        </button>
      </div>
    </div>
  );
}

export default Architecture;

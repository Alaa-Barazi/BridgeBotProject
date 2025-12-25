function CheckboxList({ sectionId, options, selectedOptions, onOptionToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option, index) => {
        const id = `${sectionId}-option-${index}`; // ✅ unique per section
        return (
          <label
            key={id}
            htmlFor={id}
            className="inline-flex items-center gap-2"
          >
            <input
              id={id}
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onOptionToggle(option)}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-gray-800">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export default CheckboxList;

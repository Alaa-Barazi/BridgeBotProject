import React from "react";

const InputField = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  name,
}) => {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto mt-4">
      <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value} // 🔥 Critical: Connects to your 'answer' state
        onChange={onChange} // 🔥 Critical: Updates your state when you type
        onKeyDown={onKeyDown} // 🔥 Critical: Allows 'Enter' to submit
        placeholder={placeholder}
        className="border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
    </div>
  );
};

export default InputField;

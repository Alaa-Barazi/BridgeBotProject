/**
 * InputField Component
 * --------------------
 * Reusable labeled input field used for quiz answers and forms.
 *
 * Responsibilities:
 * - Display label and input
 * - Forward value and events to parent
 *
 * Dark mode design:
 * - Calm input surface
 * - Soft borders instead of heavy shadows
 * - Clear focus without glare
 */

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
      <label
        className="font-medium mb-1
                        text-gray-700 dark:text-slate-300"
      >
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="border rounded-md px-3 py-2 transition
                   bg-white dark:bg-[#111827]
                   text-gray-800 dark:text-slate-300
                   border-gray-300 dark:border-[#1f2933]
                   placeholder-gray-400 dark:placeholder-slate-400
                   focus:outline-none
                   focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  );
};

export default InputField;

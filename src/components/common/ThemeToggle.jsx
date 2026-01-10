/**
 * ThemeToggle
 * -----------
 * Toggles between light and dark mode.
 */

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getInitialTheme, applyTheme } from "../../utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2 rounded-md transition
                 hover:bg-gray-100 dark:hover:bg-[#111827]"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;

/**
 * MentorNavBar
 * ------------
 * Main navigation bar for mentor-facing pages.
 *
 * Responsibilities:
 * - Display mentor navigation links
 * - Provide access to profile and logout actions
 * - Support responsive desktop and mobile layouts
 *
 * Dark mode design:
 * - Calm, flat background
 * - Low-contrast text for reduced eye strain
 * - Subtle hover states without bright flashes
 */

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ActionButton from "./ActionButton";
import ThemeToggle from "./ThemeToggle";

export default function MentorNavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const navBarItems = [
    { label: "Home", path: "/mentor" },
    { label: "Dashboard", path: "/mentor/dashboard" },
    { label: "Projects", path: "/mentor/view-projects" },
    { label: "Dictionary", path: "/mentor/dictionary" },
    { label: "Forum", path: "/mentor/forum" },
    { label: "API key Change", path: "/mentor/api-change" },
    { label: "Feedback", path: "/mentor/feedback" },
  ];

  return (
    <nav
      className="w-full px-6 py-3 flex items-center justify-between
                 bg-white dark:bg-[#0b1220]
                 border-b border-gray-200 dark:border-[#1f2933]"
    >
      {/* Logo */}
      <h2
        className="text-xl font-bold
                     text-gray-900 dark:text-slate-200"
      >
        BridgeBot
      </h2>

      {/* Desktop navigation */}
      <ul className="hidden md:flex items-center space-x-4">
        {navBarItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="px-3 py-2 rounded-md text-sm transition
                         text-gray-700 dark:text-slate-300
                         hover:bg-gray-100 dark:hover:bg-[#111827]
                         hover:text-gray-900 dark:hover:text-slate-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggle />
        <ActionButton
          buttonStyle="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => navigate("/profile")}
          text="Profile"
        />
        <ActionButton
          buttonStyle="text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
          onClick={() => {}}
          text="Logout"
        />
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-gray-700 dark:text-slate-300"
        onClick={() => setOpenMenu(!openMenu)}
      >
        ☰
      </button>

      {/* Mobile menu */}
      {openMenu && (
        <div
          className="absolute top-16 left-0 w-full z-50 p-4 md:hidden
                     bg-white dark:bg-[#0b1220]
                     border-t border-gray-200 dark:border-[#1f2933]"
        >
          <ul className="flex flex-col space-y-3">
            {navBarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block px-3 py-2 rounded-md transition
                             text-gray-700 dark:text-slate-300
                             hover:bg-gray-100 dark:hover:bg-[#111827]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1f2933]">
            <button
              className="w-full text-left py-2 transition
                         text-gray-600 dark:text-slate-300
                         hover:text-blue-600 dark:hover:text-blue-400"
            >
              Profile
            </button>
            <button
              className="w-full text-left py-2 transition
                         text-gray-600 dark:text-slate-300
                         hover:text-red-600 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

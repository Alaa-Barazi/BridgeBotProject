import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Dictionary", path: "/dictionary" },
    { label: "Quiz", path: "/quiz" },
    { label: "Forum", path: "/forum" },
    { label: "Architecture", path: "/architecture" },
    { label: "Learning Diary", path: "/diary" },
    { label: "ChatBot", path: "/chatbot" },
  ];

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      {/* Logo needed too!!*/}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        BridgeBot
      </h2>

      <ul className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="px-3 py-2 rounded-md  text-gray-700 dark:text-gray-200 hover:bg-sky-200 hover:text-white dark:hover:bg-gray-800"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center space-x-4">
        <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
          Profile
        </button>
        <button className="text-gray-600 dark:text-gray-300 hover:text-red-600">
          Logout
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-gray-700 dark:text-gray-200"
        onClick={() => setOpenMenu(!openMenu)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 md:hidden">
          <ul className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-sky-200 dark:text-gray-200  dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button className="w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600">
              Profile
            </button>
            <button className="w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

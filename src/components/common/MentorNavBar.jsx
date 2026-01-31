/**
 * MentorNavBar
 *
 * Main navigation bar for mentor users.
 * Provides access to mentor dashboard, projects, forum,
 * dictionary, theme toggle, and logout.
 * Includes responsive mobile navigation support.
 */

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ActionButton from "./ActionButton";
import ThemeToggle from "./ThemeToggle";
import MobileNavMenu from "./MobileNavMenu";
import { logout } from "../../services/authService";

export default function MentorNavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const navBarItems = [
    { label: "Home", path: "/mentor" },
    { label: "Dashboard", path: "/mentor/dashboard" },
    { label: "Projects", path: "/mentor/view-projects" },
    { label: "Dictionary", path: "/mentor/dictionary" },
    { label: "Forum", path: "/mentor/forum" },
  ];
  const onLogout = async () => {
    try {
      console.log("Logging out...");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed. Please try again.");
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className="relative w-full px-6 py-3 flex items-center justify-between
                 bg-white dark:bg-[#0b1220]
                 border-b border-gray-200 dark:border-[#1f2933]"
    >
      {/* Logo */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-200">
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
                         hover:bg-gray-100 dark:hover:bg-[#111827]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggle />
        {/* <ActionButton
          buttonStyle="text-gray-600 dark:text-slate-300 hover:text-blue-600"
          onClick={() => navigate("/profile")}
          text="Profile"
        /> */}
        <ActionButton
          buttonStyle="text-gray-600 dark:text-slate-300 hover:text-red-600"
          onClick={() => onLogout()}
          text="Logout"
        />
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-gray-700 dark:text-slate-300"
        onClick={() => setOpenMenu((prev) => !prev)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile menu */}
      <MobileNavMenu
        open={openMenu}
        items={navBarItems}
        onClose={() => setOpenMenu(false)}
        onProfile={() => navigate("/profile")}
        isStudent={false}
      />
    </nav>
  );
}

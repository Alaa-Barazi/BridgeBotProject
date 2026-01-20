import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { logout } from "../../services/authService";

export default function MobileNavMenu({
  open,
  items,
  onClose,
  onProfile,
  onLogout,
  isStudent = true,
}) {
  if (!open) return null;
  const navigate = useNavigate();

  return (
    <div
      className="absolute top-full left-0 w-full z-50 p-4 md:hidden
                 bg-white dark:bg-[#0b1220]
                 border-t border-gray-200 dark:border-[#1f2933]"
    >
      <ul className="flex flex-col space-y-3">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onClose}
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
        {/* Theme toggle */}
        <div className="flex items-center justify-between py-2">
          <ThemeToggle />
        </div>

        {/* Profile */}
        {isStudent && (
          <button
            onClick={() => {
              onClose();
              onProfile();
            }}
            className="w-full text-left py-2 transition
                     text-gray-600 dark:text-slate-300
                     hover:text-blue-600"
          >
            Profile
          </button>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full text-left py-2 transition
                     text-gray-600 dark:text-slate-300
                     hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

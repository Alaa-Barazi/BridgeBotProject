/**
 * Login
 *
 * Authentication page for signing in users.
 * Validates credentials, enforces allowed email domain,
 * and routes users based on their role (mentor or student).
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginWithEmail } from "../../services/authService";
import { ALLOWED_DOMAIN } from "../../services/validators";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      if (res.role === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        localStorage.setItem("teamId", res.teamId);
        localStorage.setItem("userId", res?.user.uid);
        navigate("/profile");
      }
    } catch (error) {
      const msg = String(error?.message || "");

      if (msg.includes("end with")) {
        alert(`Login is allowed only with ${ALLOWED_DOMAIN}`);
      } else if (error?.code === "auth/user-not-found") {
        alert("No user found with this email address.");
      } else if (error?.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error?.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (error?.code === "auth/too-many-requests") {
        alert("Too many failed attempts. Please try again later.");
      } else if (error?.code === "auth/invalid-credential") {
        alert("Incorrect email or password.");
      } else {
        alert(msg || "Login failed. Please try again.");
      }

      console.error("LOGIN ERROR:", error?.code, error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🤖 BridgeBot
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to your workspace
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`name${ALLOWED_DOMAIN}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Register
          </button>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

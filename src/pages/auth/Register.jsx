/**
 * Register
 *
 * User registration page.
 * Collects account and team details, creates a new user,
 * and redirects to the profile setup after successful signup.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    teamNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(formData);
      alert("Account created successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700 text-gray-900 dark:text-white " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ✍️ Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Join the BridgeBot workspace
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>User Name</label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Team Number</label>
            <input
              name="teamNumber"
              value={formData.teamNumber}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g. 1"
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="name@e.braude.ac.il"
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

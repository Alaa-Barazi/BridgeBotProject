/**
 * ForgotPassword
 *
 * Authentication page for requesting a password reset.
 * Validates the email domain, sends a reset link,
 * and handles common Firebase auth error states.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendResetPasswordLink } from "../../services/authService";
import { ALLOWED_DOMAIN } from "../../services/validators";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendResetPasswordLink(email);
      setSubmitted(true);
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      const code = error?.code;
      const msg = String(error?.message || "");

      if (msg.includes("end with")) {
        alert(`Reset is allowed only with ${ALLOWED_DOMAIN}`);
      } else if (code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (code === "auth/user-not-found") {
        // best practice: do not reveal if user exists
        setSubmitted(true);
      } else if (code === "auth/too-many-requests") {
        alert("Too many requests. Please try again later.");
      } else {
        alert("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔑 Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {submitted ? "Success!" : "We'll send you a recovery link"}
          </p>
        </div>

        {!submitted ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`name${ALLOWED_DOMAIN}`}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition shadow-sm"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <p className="text-sm text-green-800 dark:text-green-200">
              If an account exists for <strong>{email}</strong>, you will
              receive a reset link shortly. Please check your spam folder if it
              doesn't appear.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

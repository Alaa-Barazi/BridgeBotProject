import { useNavigate } from "react-router-dom";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 
                      rounded-lg shadow p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🤖 BridgeBot
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to your workspace
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md 
                         border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="team@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md 
                         border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md 
                       bg-blue-600 hover:bg-blue-700 
                       text-white font-medium transition"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-2 rounded-md 
                       border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Register
          </button>

          <div className="text-right">
            <a
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

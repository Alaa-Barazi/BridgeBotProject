/**
 * ProtectedRoute
 * --------------
 * Route guard component for BridgeBot.
 *
 * Purpose:
 * - Prevents access to protected routes when the user is not authenticated
 * - Redirects unauthenticated users to the login page
 *
 * Usage:
 * - Wraps student and mentor route layouts in App routing
 * - Ensures MainLayout and MentorLayout are only rendered for logged-in users
 *
 * Behavior:
 * - If no authenticated Firebase user exists -> redirects to /login
 * - If authenticated -> renders nested routes via <Outlet />
 */

import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const user = auth.currentUser;

  // Not logged in -> kick to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Logged in -> allow route
  return <Outlet />;
}

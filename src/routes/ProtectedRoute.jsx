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

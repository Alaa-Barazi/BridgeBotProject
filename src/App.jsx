/**
 * App routing configuration
 *
 * Defines all application routes using React Router.
 * Includes:
 * - Public routes (login, register, forgot password)
 * - Student routes wrapped with MainLayout
 * - Mentor routes wrapped with MentorLayout
 *
 * Route definitions are grouped into reusable arrays
 * to keep routing structure readable and maintainable.
 */

import "./App.css";
import MainLayout from "./layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dictionary from "./pages/Dictionary";

import Home from "./pages/Home";
import Forum from "./pages/Forum";
import Profile from "./pages/auth/Profile";
import MentorLayout from "./layout/MentorLayout";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import ViewProjects from "./pages/mentor/ViewProjects";
import MentorForum from "./pages/mentor/MentorForum";
import MentorFeedBack from "./pages/mentor/MentorFeedBack";
import ProjectOverViewPage from "./pages/mentor/ProjectOverViewPage";
import TeamProjectHome from "./pages/team/TeamProjectHome";
import ChatPanel from "./components/chatBot/ChatPanel";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Architecture from "./pages/team/TeamProjectArchitecture";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CourseQuiz from "./pages/CourseQuiz";
import MentorGenerationPage from "./pages/mentor/MentorGenerationPage";

const commonRouteItems = [
  { label: "Login", path: "/login", element: <Login /> },
  { label: "Register", path: "/register", element: <Register /> },
  {
    label: "Forgot Password",
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];

export const routeItems = [
  { label: "Home", path: "/", element: <Home /> },
  { label: "Dictionary", path: "/dictionary", element: <Dictionary /> },
  { label: "Quiz", path: "/quiz", element: <CourseQuiz /> },
  { label: "Forum", path: "/forum", element: <Forum /> },
  { label: "Architecture", path: "/architecture", element: <Architecture /> },
  { label: "ChatBot", path: "/chatbot", element: <ChatPanel /> },
  { label: "Profile", path: "/profile", element: <Profile /> },
];

export const MentorRouteItems = [
  { label: "Home", path: "", element: <MentorGenerationPage /> },
  { label: "Dashboard", path: "dashboard", element: <MentorDashboard /> },
  { label: "Dictionary", path: "dictionary", element: <Dictionary /> },
  { label: "Forum", path: "forum", element: <MentorForum /> },
  { label: "Feedback", path: "feedback", element: <MentorFeedBack /> },
  { label: "Projects", path: "view-projects", element: <ViewProjects /> },
  {
    label: "Project Overview",
    path: "project-overview",
    element: <ProjectOverViewPage />,
  },
];
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common routes like Login, Register, Forgot Password */}
        {commonRouteItems.map((item) => (
          <Route key={item.path} path={item.path} element={item.element} />
        ))}
        {/* Student layout */}
        <Route path="/" element={<MainLayout />}>
          {routeItems.map((item) => (
            <Route
              key={item.path}
              path={item.path === "/" ? "" : item.path.substring(1)}
              element={item.element}
            />
          ))}
          <Route path="project/:projectId" element={<TeamProjectHome />} />
        </Route>

        {/* Mentor layout */}
        <Route path="/mentor" element={<MentorLayout />}>
          {MentorRouteItems.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
          <Route
            path="project-overview/:projectId"
            element={<ProjectOverViewPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

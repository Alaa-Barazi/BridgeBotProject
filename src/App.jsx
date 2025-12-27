import "./App.css";
import MainLayout from "./layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dictionary from "./pages/Dictionary";
import ChatBot from "./pages/ChatBot";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Forum from "./pages/Forum";

import LearningDiary from "./pages/LearningDiary";
import Profile from "./pages/auth/Profile";
import MentorLayout from "./layout/MentorLayout";
import MentorDashboard from "./pages/mentor/mentorDashboard";
import ViewProjects from "./pages/mentor/ViewProjects";
import MentorForum from "./pages/mentor/MentorForum";
import MentorBotInsight from "./pages/mentor/MentorBotInsight";
import MentorFeedBack from "./pages/mentor/MentorFeedBack";
import MentorDictionary from "./pages/mentor/MentorDictionary";
import ProjectOverViewPage from "./pages/mentor/ProjectOverViewPage";
import TeamProjectHome from "./pages/team/TeamProjectHome";

import ChatPanel from "./components/chatBot/ChatPanel";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Architecture from "./pages/team/TeamProjectArchitecture";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
  // { label: "Dashboard", path: "/dashboard", element: <Dashboard/> },
  { label: "Dictionary", path: "/dictionary", element: <Dictionary /> },
  { label: "Quiz", path: "/quiz", element: <Quiz /> },
  { label: "Forum", path: "/forum", element: <Forum /> },
  { label: "Architecture", path: "/architecture", element: <Architecture /> },
  // {
  //   label: "Project",
  //   path: "/project/:projectId",
  //   element: <TeamProjectHome />,
  // },
  // {
  //   label: "TeamWorkSpaceProject",
  //   path: "/project/:projectId",
  //   element: <TeamProjectHome />,
  // },
  { label: "Learning Diary", path: "/diary", element: <LearningDiary /> },
  { label: "ChatBot", path: "/chatbot", element: <ChatPanel /> },
  { label: "Profile", path: "/profile", element: <Profile /> },
];

export const MentorRouteItems = [
  { label: "Home", path: "", element: <MentorDashboard /> },
  { label: "Dashboard", path: "dashboard", element: <MentorDashboard /> },
  { label: "Dictionary", path: "dictionary", element: <Dictionary /> },
  { label: "Forum", path: "forum", element: <MentorForum /> },
  {
    label: "Bot Insights",
    path: "bot-insights",
    element: <MentorBotInsight />,
  },
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
            path="view-projects/:projectId"
            element={<ProjectOverViewPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

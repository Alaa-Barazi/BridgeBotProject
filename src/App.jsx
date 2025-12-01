import "./App.css";
import MainLayout from "./layout/mainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dictionary from "./pages/Dictionary";
import ChatBot from "./pages/ChatBot";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Forum from "./pages/Forum";
import Architecture from "./pages/Architecture";
import LearningDiary from "./pages/LearningDiary";
import Profile from "./pages/Profile";
import MentorLayout from "./layout/MentorLayout";
import MentorDashboard from "./pages/mentor/mentorDashboard";
import ViewProjects from "./pages/mentor/ViewProjects";
import MentorForum from "./pages/mentor/MentorForum";
import MentorBotInsight from "./pages/mentor/MentorBotInsight";
import MentorFeedBack from "./pages/mentor/MentorFeedBack";
import MentorDictionary from "./pages/mentor/MentorDictionary";

export const routeItems = [
  { label: "Home", path: "/", element: <Home /> },
  // { label: "Dashboard", path: "/dashboard", element: <Dashboard/> },
  { label: "Dictionary", path: "/dictionary", element: <Dictionary /> },
  { label: "Quiz", path: "/quiz", element: <Quiz /> },
  { label: "Forum", path: "/forum", element: <Forum /> },
  { label: "Architecture", path: "/architecture", element: <Architecture /> },
  { label: "Learning Diary", path: "/diary", element: <LearningDiary /> },
  { label: "ChatBot", path: "/chatbot", element: <ChatBot /> },
  { label: "Profile", path: "/profile", element: <Profile /> },
];

export const MentorRouteItems = [
  { label: "Home", path: "", element: <MentorDashboard /> },
  { label: "Dashboard", path: "dashboard", element: <MentorDashboard /> },
  { label: "View Projects", path: "projects", element: <ViewProjects /> },
  { label: "Dictionary", path: "dictionary", element: <MentorDictionary /> },
  { label: "Forum", path: "forum", element: <MentorForum /> },
  {
    label: "Bot Insights",
    path: "bot-insights",
    element: <MentorBotInsight />,
  },
  { label: "Feedback", path: "feedback", element: <MentorFeedBack/> },
];
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {routeItems.map((item) => (
            <Route
              key={item.path}
              path={item.path === "/" ? "" : item.path.substring(1)}
              element={item.element}
            />
          ))}
        </Route>
        {/* Mentor layout */}
        <Route path="/mentor" element={<MentorLayout />}>
          {MentorRouteItems.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

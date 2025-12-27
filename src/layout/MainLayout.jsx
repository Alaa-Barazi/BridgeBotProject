import { Outlet, useLocation } from "react-router-dom";
import StudentNavBar from "../components/common/StudentNavBar";
import ChatPanel from "../components/chatBot/ChatPanel";

export default function MainLayout() {
  const location = useLocation();

  const pageContext = location.pathname.replace("/", "") || "home";
  return (
    <div className="flex flex-col min-h-screen w-full">
      <StudentNavBar />

      <main className="flex-1 w-full bg-gray-50 p-6 overflow-y-auto">
        <Outlet />

        <ChatPanel pageContext={pageContext} />
      </main>
    </div>
  );
}

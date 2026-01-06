/**
 * MainLayout
 * ----------
 * Root application layout for BridgeBot.
 *
 * Responsibilities:
 * - Provide global page structure
 * - Render navigation bar
 * - Host routed pages via <Outlet />
 * - Attach the persistent ChatPanel
 *
 * Dark mode design:
 * - Calm, flat background (no gradients)
 * - Neutral slate palette
 * - Allows child pages to control their own surfaces
 */

import { Outlet, useLocation } from "react-router-dom";
import StudentNavBar from "../components/common/StudentNavBar";
import ChatPanel from "../components/chatBot/ChatPanel";

export default function MainLayout() {
  const location = useLocation();
  const pageContext = location.pathname.replace("/", "") || "home";

  return (
    <div
      className="flex flex-col min-h-screen w-full
                 bg-gray-50 dark:bg-[#0f172a]"
    >
      <StudentNavBar />

      <main
        className="flex-1 w-full p-6 overflow-y-auto
                   bg-gray-50 dark:bg-[#0f172a]"
      >
        <Outlet />

        {/* Global assistant panel */}
        <ChatPanel pageContext={pageContext} />
      </main>
    </div>
  );
}

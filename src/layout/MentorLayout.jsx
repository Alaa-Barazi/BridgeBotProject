/**
 * MentorLayout
 * ------------
 * Root layout for mentor-facing pages.
 *
 * Responsibilities:
 * - Provide consistent structure for mentor views
 * - Render MentorNavBar
 * - Host routed mentor pages via <Outlet />
 *
 * Dark mode design:
 * - Flat, calm background (no gradients)
 * - Neutral slate tone consistent with student layout
 * - Allows child pages to define their own surfaces
 */

import { Outlet } from "react-router-dom";
import MentorNavBar from "../components/common/MentorNavBar";

const MentorLayout = () => {
  return (
    <div
      className="flex flex-col min-h-screen w-full
                 bg-gray-50 dark:bg-[#0f172a]"
    >
      <MentorNavBar />

      <main
        className="flex-1 w-full p-6 overflow-y-auto
                   bg-gray-50 dark:bg-[#0f172a]"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MentorLayout;

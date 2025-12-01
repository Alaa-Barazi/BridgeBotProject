import { Outlet } from "react-router-dom";
import MentorNavBar from "../components/common/MentorNavBar";

const MentorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <MentorNavBar />

      <main className="flex-1 w-full bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MentorLayout;

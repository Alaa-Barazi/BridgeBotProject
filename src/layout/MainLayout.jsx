import { Outlet } from "react-router-dom";
import NavBar from "../components/common/NavBar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />

      <main className="flex-1 w-full bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

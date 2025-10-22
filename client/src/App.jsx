import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6F1FF] antialiased">
      {/* The Outlet renders the nested routes like Landing or Login */}
      <Outlet />
    </div>
  );
}
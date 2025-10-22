import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Public
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";

// App shell + pages
import AppShell from "./components/AppShell.jsx";
import Today from "./pages/app/Today.jsx";
import Leads from "./pages/app/Leads.jsx";
import RoundRobin from "./pages/app/RoundRobin.jsx";
import Reports from "./pages/app/Reports.jsx"; 
import Team from "./pages/app/Team.jsx";        
import Appointments from "./pages/app/Appointments.jsx";
import Settings from "./pages/app/Settings.jsx";
import MyStats from "./pages/app/MyStats.jsx";
import Manager from "./pages/app/Manager.jsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Today /> },
      { path: "today", element: <Today /> },
      { path: "leads", element: <Leads /> },
      { path: "roundrobin", element: <RoundRobin /> },
      { path: "reports", element: <Reports /> },  
      { path: "team", element: <Team /> },        
      // { path: "appointments", element: <div className="p-6">Appointments (coming soon)</div> },
      { path: "settings", element: <Settings /> },
      { path: "appointments", element: <Appointments /> },
      { path: "mystats", element: <MyStats /> },
      { path: "manager", element: <Manager /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen grid place-items-center bg-[#0B0F14] text-[#E6F1FF] p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
          <p className="text-sm text-[#9FB0C6] mb-6">The page you’re looking for doesn’t exist.</p>
          <a href="/" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15">Go home</a>
        </div>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
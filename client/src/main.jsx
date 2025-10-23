import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./lib/authProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleGate from "./components/RoleGate.jsx";

// Landing + Auth
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";

// App shell + nested pages
import AppShell from "./components/AppShell.jsx";
import Today from "./pages/app/Today.jsx";
import Leads from "./pages/app/Leads.jsx";
import Appointments from "./pages/app/Appointments.jsx";
import Reports from "./pages/app/Reports.jsx";
import Team from "./pages/app/Team.jsx";
import RoundRobin from "./pages/app/RoundRobin.jsx";
import Settings from "./pages/app/Settings.jsx";
import MyStats from "./pages/app/MyStats.jsx";
import Manager from "./pages/app/Manager.jsx";

import NotAllowed from "./pages/NotAllowed.jsx";

// Optional: global styles (if you have one)
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },

  // Everything under /app requires authentication
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="today" replace /> },
      { path: "today", element: <Today /> },
      { path: "leads", element: <Leads /> },
      { path: "appointments", element: <Appointments /> },

      // If you want Reports to be open to all signed-in users, leave as-is:
      { path: "reports", element: <Reports /> },

      { path: "team", element: <Team /> },
      { path: "roundrobin", element: <RoundRobin /> },
      { path: "settings", element: <Settings /> },
      { path: "mystats", element: <MyStats /> },

      // Manager-only section (manager/admin)
      {
        path: "manager",
        element: (
          <RoleGate allow={["manager", "admin"]} fallback={<NotAllowed />}>
            <Manager />
          </RoleGate>
        ),
      },
    ],
  },

  // Not allowed / 404 fallbacks
  { path: "/not-allowed", element: <NotAllowed /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
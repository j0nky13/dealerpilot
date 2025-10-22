import AppShell from "../components/AppShell.jsx";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
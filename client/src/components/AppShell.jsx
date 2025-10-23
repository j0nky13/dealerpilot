import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Home,
  List,
  Calendar,
  BarChart3,
  Users,
  Shield,
  Shuffle,
  Settings as SettingsIcon,
  Menu,
  PieChart,
} from "lucide-react";
import Viewport from "./Viewport.jsx";
import QuickAddLeadModal from "./QuickAddLeadModal.jsx";
import { useAuth } from "../lib/authProvider.jsx";
import { logout } from "../lib/firebase";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning,";
    if (h < 18) return "Good afternoon,";
    return "Good evening,";
  }, []);

  const NavItem = ({ to, label, Icon }) => (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors
         ${isActive ? "bg-white/10 text-white" : "text-[#9FB0C6] hover:text-white hover:bg-white/5"}`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span
        className={`whitespace-nowrap overflow-hidden transition-[opacity,width] duration-200 ease-out ${
          collapsed ? "opacity-0 w-0" : "opacity-100 w-36"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );

  return (
    <Viewport>
      {/* Fixed edge hamburger (always at far left) */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="fixed left-3 top-3 z-40 grid place-items-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/15"
        aria-label="Toggle navigation"
        title="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Top bar (stays full width) */}
      <header className="sticky top-0 z-30 bg-[#0B0F14]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
          {/* leave space on the left; we already have a fixed hamburger */}
          <img src="/logo.svg" alt="" className="h-6" />
          <div className="ml-2 hidden md:flex flex-col leading-tight">
            <span className="text-sm text-white font-medium">{greeting}</span>
            <span className="text-xs text-[#9FB0C6] truncate">
              {user?.email ?? "user@example.com"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input
              placeholder="Search leads (⌘K)"
              className="hidden md:block px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 w-72"
            />
            <button
              onClick={() => setShowQuickAdd(true)}
              className="px-3 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95"
              aria-haspopup="dialog"
              aria-expanded={showQuickAdd ? "true" : "false"}
            >
              + Quick Add
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Fixed sidebar + independent scrolling content */}
      <div className="relative w-full">
        {/* Sidebar (fixed, its own scroll if needed) */}
        <aside
          className={`fixed top-16 left-0 z-30 hidden md:flex md:flex-col
            h-[calc(100vh-4rem)] overflow-y-auto
            transition-[width] duration-300 ease-out
            ${collapsed ? "w-16" : "w-64"}
            pt-6 pr-4`}
        >
          {/* Visual separator on the right edge */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-px bg-white/10" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 shadow-[inset_-12px_0_24px_-16px_rgba(0,0,0,0.6)]" />

          {/* Top navigation group */}
          <nav className="space-y-1">
            <NavItem to="/app/today" label="Today" Icon={Home} />
            <NavItem to="/app/leads" label="Leads" Icon={List} />
            <NavItem to="/app/appointments" label="Appointments" Icon={Calendar} />
            <NavItem to="/app/reports" label="Reports" Icon={BarChart3} />
            <NavItem to="/app/manager" label="Manager" Icon={Shield} />
            <NavItem to="/app/mystats" label="My Stats" Icon={PieChart} />
            <NavItem to="/app/team" label="Team" Icon={Users} />
            <NavItem to="/app/roundrobin" label="Round Robin" Icon={Shuffle} />
          </nav>

          {/* Push settings to bottom */}
          <div className="flex-1" />

          {/* Divider above Settings */}
          <div className="mt-4 mb-2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Bottom group */}
          <nav className="pb-4">
            <NavItem to="/app/settings" label="Settings" Icon={SettingsIcon} />
          </nav>

          {/* Logout button with top border */}
          <div className="border-t border-white/10 pt-2">
            <button
              onClick={async () => {
                try {
                  await logout();
                } finally {
                  // clear anything custom you store
                  localStorage.removeItem("storeCode");
                  nav("/login", { replace: true });
                }
              }}
              className="w-full mt-2 flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-transparent hover:bg-red-500/10 text-left text-[#9FB0C6] hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span
                className={`whitespace-nowrap overflow-hidden transition-[opacity,width] duration-200 ease-out ${
                  collapsed ? "opacity-0 w-0" : "opacity-100 w-36"
                }`}
              >
                Logout
              </span>
            </button>
            <div className="h-6" />
          </div>
        </aside>

        {/* Content wrapper shifts to make room for fixed sidebar */}
        <div
          className={`transition-[padding] duration-300 ease-out ${
            collapsed ? "md:pl-16" : "md:pl-64"
          }`}
        >
          {/* Page content scrolls independently of the sidebar */}
          <main className="py-6 px-6 max-w-7xl mx-auto">
            <Outlet />
          </main>
          <QuickAddLeadModal
            open={showQuickAdd}
            onClose={() => setShowQuickAdd(false)}
            onCreated={(id) => {
              window.dispatchEvent(new CustomEvent("lead:created", { detail: { id } }));
              setShowQuickAdd(false);
            }}
          />
        </div>
      </div>
    </Viewport>
  );
}
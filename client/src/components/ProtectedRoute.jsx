import { useAuth } from "../lib/authProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0B0F14] text-white">
        <div className="flex items-center gap-3 text-[#9FB0C6]">
          <span className="h-2 w-2 rounded-full bg-[#5BE6CE] animate-pulse" />
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    // use a standard redirect route in main.jsx (already done)
    window.location.assign("/login");
    return null;
  }

  return children;
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/authProvider.jsx";
import FancyLoader from "./FancyLoader.jsx";

export default function RoleGate({ allow = [], fallback = null, children }) {
  const { role, loading, user } = useAuth();

  if (loading) {
    // In case RoleGate is used outside ProtectedRoute, show a consistent loader
    return (
      <FancyLoader
        title="Checking permissions…"
        subtitle="Making sure you can view this page"
      />
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(role)) {
    return fallback ?? <Navigate to="/not-allowed" replace />;
  }
  return children;
}
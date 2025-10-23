import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/authProvider.jsx";
import FancyLoader from "./FancyLoader.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <FancyLoader
        title="Checking authentication…"
        subtitle="Securing your session"
      />
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
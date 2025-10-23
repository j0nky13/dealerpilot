// src/components/RoleGate.jsx
import { useAuth } from "../lib/authProvider.jsx";

/**
 * Restrict rendering to allowed roles.
 * Example: <RoleGate allow={['manager','admin']}><ManagerPanel/></RoleGate>
 */
export default function RoleGate({ allow = [], children, fallback = null }) {
  const { role } = useAuth();
  if (!role) return null;
  return allow.includes(role) ? children : fallback;
}
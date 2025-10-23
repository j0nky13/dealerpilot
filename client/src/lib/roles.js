export const ROLES = /** @type {const} */ ([
  "admin",     // superuser for an org
  "manager",   // can manage users within org
  "sales",
  "bdc",
  "service",
  "viewer",
]);

export function canManageUsers(role) {
  return role === "admin" || role === "manager";
}

export function normalizeRole(value) {
  const v = String(value || "").toLowerCase();
  return ROLES.includes(v) ? v : "sales";
}

export function roleLabel(role) {
  switch (role) {
    case "admin": return "Admin";
    case "manager": return "Manager";
    case "sales": return "Sales";
    case "bdc": return "BDC";
    case "service": return "Service";
    default: return "Viewer";
  }
}
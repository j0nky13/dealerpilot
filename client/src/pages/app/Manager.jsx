import { useEffect, useMemo, useState } from "react";
import Panel from "../../components/Panel.jsx";
import { useAuth } from "../../lib/authProvider.jsx";
import { ROLES, roleLabel, canManageUsers } from "../../lib/roles";
import { listUsersByOrg, updateUserRole } from "../../lib/usersApi";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs text-[#9FB0C6] ring-1 ring-white/10">
      {children}
    </span>
  );
}

export default function Manager() {
  const { profile, loading } = useAuth();
  const orgId = profile?.orgId || null;
  const iAmAllowed = canManageUsers(profile?.role);

  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [err, setErr] = useState("");

  const canRender = useMemo(() => !loading && !!orgId, [loading, orgId]);

  useEffect(() => {
    let live = true;
    async function run() {
      setErr("");
      if (!orgId) return;
      try {
        const users = await listUsersByOrg(orgId);
        if (live) setRows(users);
      } catch (e) {
        if (live) setErr(e.message || "Failed to load users");
      }
    }
    run();
    return () => { live = false; };
  }, [orgId]);

  if (loading) return <div className="p-6 text-[#9FB0C6]">Loading…</div>;
  if (!canRender) return <div className="p-6 text-[#9FB0C6]">No org assigned. Ask an admin to set your org.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manager</h1>
        <div className="text-sm text-[#9FB0C6]">
          Org: <Badge>{orgId}</Badge>
        </div>
      </div>

      <Panel title="Team Members">
        {err && <div className="mb-3 text-sm text-red-400">{err}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#9FB0C6]">
                <th className="py-2 pr-4">Name / Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u, idx) => (
                <tr key={u.id} className={`border-t border-white/10 ${idx % 2 ? "bg-white/[0.03]" : ""}`}>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{u.displayName || u.name || u.email?.split("@")[0] || "—"}</div>
                    <div className="text-xs text-[#9FB0C6]">{u.email || "—"}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge>{roleLabel(u.role || "viewer")}</Badge>
                  </td>
                  <td className="py-3 pr-4">{u.active === false ? "Inactive" : "Active"}</td>
                  <td className="py-3 pr-4">
                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 pr-0 text-right">
                    <div className="inline-flex items-center gap-2">
                      {iAmAllowed ? (
                        <>
                          <select
                            className="rounded-lg bg-white/5 px-2 py-1 ring-1 ring-white/10"
                            value={u.role || "viewer"}
                            onChange={async (e) => {
                              const newRole = e.target.value;
                              setBusyId(u.id);
                              setErr("");
                              try {
                                await updateUserRole(u.id, newRole);
                                // optimistic update
                                setRows((prev) =>
                                  prev.map((r) => (r.id === u.id ? { ...r, role: newRole } : r))
                                );
                              } catch (ex) {
                                setErr(ex.message || "Failed to update role");
                              } finally {
                                setBusyId(null);
                              }
                            }}
                            disabled={busyId === u.id}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {roleLabel(r)}
                              </option>
                            ))}
                          </select>
                          <button
                            className="rounded-lg bg-white/5 px-3 py-1 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
                            disabled
                            title="More actions coming soon"
                          >
                            …
                          </button>
                        </>
                      ) : (
                        <span className="text-[#9FB0C6]">No permission</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 pr-4 text-[#9FB0C6]" colSpan={5}>
                    No users found for this org.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
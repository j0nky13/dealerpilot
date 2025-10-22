// src/pages/app/Manager.jsx
import { useMemo, useState } from "react";
import Panel from "../../components/Panel.jsx";
import RightDrawer from "../../components/RightDrawer.jsx"; // reuse your existing drawer
import {
  loadUsers, saveUsers, addUser, updateUser, removeUser,
  setActive, setRole, setDept, userKpis
} from "../../lib/usersStorage.js";
import { Search, UserPlus, Trash2 } from "lucide-react";

const ROLES = ["sales", "bdc", "manager", "admin"];
const DEPTS = ["Sales", "BDC"];

export default function Manager() {
  const [q, setQ] = useState("");
  const [dept, setDeptFilter] = useState("All");
  const [users, setUsers] = useState(loadUsers());
  const [drawerUser, setDrawerUser] = useState(null);

  const list = useMemo(() => {
    return users
      .filter(u => (dept === "All" || u.dept === dept))
      .filter(u => {
        const s = q.toLowerCase();
        return !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      })
      .sort((a,b)=> a.name.localeCompare(b.name));
  }, [users, q, dept]);

  const refresh = () => setUsers(loadUsers());

  const onAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.trim();
    const email = fd.get("email")?.trim();
    const role = fd.get("role");
    const d = fd.get("dept");
    if (!name || !email) return;
    addUser({ name, email, role, dept: d });
    e.currentTarget.reset();
    refresh();
  };

  const onToggleActive = (u) => { setActive(u.id, !u.active); refresh(); };
  const onRemove = (u) => { if (confirm(`Remove ${u.name}?`)) { removeUser(u.id); refresh(); } };

  const onInlineChange = (id, field, value) => {
    if (field === "role") setRole(id, value);
    else if (field === "dept") setDept(id, value);
    else updateUser(id, { [field]: value });
    refresh();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manager</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-[#9FB0C6]" />
            <input
              value={q} onChange={(e)=>setQ(e.target.value)}
              placeholder="Search name or email"
              className="pl-8 pr-3 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg text-sm"
            />
          </div>
          <select
            value={dept} onChange={(e)=>setDeptFilter(e.target.value)}
            className="bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option>All</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Onboard */}
      <Panel title="Onboard New Worker">
        <form onSubmit={onAdd} className="grid md:grid-cols-5 gap-3">
          <Field label="Full name">
            <input name="name" className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm" />
          </Field>
          <Field label="Email">
            <input type="email" name="email" className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm" />
          </Field>
          <Field label="Role">
            <select name="role" className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Department">
            <select name="dept" className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm">
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95">
              <UserPlus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>
      </Panel>

      {/* Workers table */}
      <Panel title="Workers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#9FB0C6]">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Dept</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2 pr-4">Open</th>
                <th className="py-2 pr-4">Overdue</th>
                <th className="py-2 pr-4">New</th>
                <th className="py-2 pr-4">Appts</th>
                <th className="py-2 pr-4">Last</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u, idx) => {
                const k = userKpis(u.id);
                return (
                  <tr key={u.id} className={`border-t border-white/10 ${idx % 2 ? "bg-white/[0.03]" : ""}`}>
                    <td className="py-3 pr-4 font-medium">{u.name}</td>
                    <td className="py-3 pr-4 text-[#9FB0C6]">{u.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={u.role}
                        onChange={(e)=>onInlineChange(u.id, "role", e.target.value)}
                        className="bg-white/5 ring-1 ring-white/10 rounded px-2 py-1"
                      >
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={u.dept}
                        onChange={(e)=>onInlineChange(u.id, "dept", e.target.value)}
                        className="bg-white/5 ring-1 ring-white/10 rounded px-2 py-1"
                      >
                        {DEPTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={u.active}
                          onChange={()=>onToggleActive(u)}
                        />
                        <span className="text-xs">{u.active ? "Active" : "Inactive"}</span>
                      </label>
                    </td>
                    <td className="py-3 pr-4">{k.open}</td>
                    <td className="py-3 pr-4">{k.overdue}</td>
                    <td className="py-3 pr-4">{k.newToday}</td>
                    <td className="py-3 pr-4">{k.apptThisWeek}</td>
                    <td className="py-3 pr-4">{k.lastActivityMins}m</td>
                    <td className="py-3 pr-0 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                          onClick={()=>setDrawerUser(u)}
                        >
                          View
                        </button>
                        <button
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-red-300"
                          onClick={()=>onRemove(u)}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Drawer with per-user detail & edits */}
      <RightDrawer
        open={!!drawerUser}
        onClose={()=>setDrawerUser(null)}
        title={drawerUser ? drawerUser.name : ""}
      >
        {drawerUser && <UserDetailEditor user={drawerUser} onChange={(patch)=>{
          updateUser(drawerUser.id, patch); refresh();
        }} />}
      </RightDrawer>
    </div>
  );
}

/* ----- subcomponents ----- */
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-[#9FB0C6] mb-1">{label}</div>
      {children}
    </label>
  );
}

function UserDetailEditor({ user, onChange }) {
  const k = userKpis(user.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name">
          <input
            defaultValue={user.name}
            onBlur={(e)=>onChange({ name: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            defaultValue={user.email}
            onBlur={(e)=>onChange({ email: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Role">
          <select
            defaultValue={user.role}
            onChange={(e)=>onChange({ role: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {["sales","bdc","manager","admin"].map(r=> <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select
            defaultValue={user.dept}
            onChange={(e)=>onChange({ dept: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {["Sales","BDC"].map(d=> <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Active">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={user.active}
              onChange={(e)=>onChange({ active: e.target.checked })}
            />
            <span className="text-xs">{user.active ? "Active" : "Inactive"}</span>
          </label>
        </Field>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Kpi label="Open Leads" value={k.open} />
        <Kpi label="Overdue" value={k.overdue} />
        <Kpi label="New Today" value={k.newToday} />
        <Kpi label="Appts (Wk)" value={k.apptThisWeek} />
        <Kpi label="Sold (Mo)" value={k.soldThisMonth} />
        <Kpi label="Last Activity" value={`${k.lastActivityMins}m`} />
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wide text-[#9FB0C6]">{label}</div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
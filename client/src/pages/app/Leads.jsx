import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, ArrowUpDown, Download, Trash2, UserPlus } from "lucide-react";
import LeadDrawer from "../../components/LeadDrawer.jsx";
import {
  loadLeads,
  saveLeads,
  updateLead,
} from "../../lib/leadsStorage.js";
import { getCurrentUserId, getCurrentUserRole } from "../../lib/roles.js";
import { loadPools } from "../../lib/roundRobinStorage.js";
import QuickAddLeadModal from "../../components/QuickAddLeadModal.jsx";

const STATUS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "working", label: "Working" },
  { id: "appt_set", label: "Appt Set" },
  { id: "showed", label: "Showed" },
  { id: "sold", label: "Sold" },
  { id: "lost", label: "Lost" },
];

function useUserNameMap() {
  const pools = loadPools();
  const map = new Map();
  pools.forEach(p => p.users.forEach(u => map.set(u.id, u.name)));
  return (id) => map.get(id) || "—";
}

function StatusPill({ value }) {
  const colors = {
    new: "bg-[#5BE6CE]/10 text-[#C7F4EA] ring-[#5BE6CE]/25",
    working: "bg-blue-500/10 text-blue-200 ring-blue-400/25",
    appt_set: "bg-amber-500/10 text-amber-200 ring-amber-400/25",
    showed: "bg-violet-500/10 text-violet-200 ring-violet-400/25",
    sold: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/25",
    lost: "bg-rose-500/10 text-rose-200 ring-rose-400/25",
  };
  const c = colors[value] || "bg-white/10 text-[#C7D6EA] ring-white/20";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] ring-1 ${c}`}>
      {value || "—"}
    </span>
  );
}

export default function Leads() {
  const me = getCurrentUserId();
  const role = getCurrentUserRole();
  const canSeeAll = role === "manager" || role === "bdc" || role === "admin";
  const userName = useUserNameMap();

  const [leads, setLeads] = useState(loadLeads());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState("updated"); // updated | due
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [drawerLead, setDrawerLead] = useState(null);

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  useEffect(() => {
    const handler = () => setLeads(loadLeads());
    window.addEventListener("lead:created", handler);
    return () => window.removeEventListener("lead:created", handler);
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return leads.filter(l => {
      if (!showAll && !canSeeAll && l.assignedTo !== me) return false;
      if (showAll && !canSeeAll && l.assignedTo !== me) return false; // non-managers can’t see others
      if (!showAll && canSeeAll && l.assignedTo !== me && status === "mine") return false;

      if (status !== "all" && l.status !== status) return false;

      if (text) {
        const hay = `${l.name} ${l.email || ""} ${l.phone || ""} ${l.source || ""}`.toLowerCase();
        if (!hay.includes(text)) return false;
      }
      return true;
    });
  }, [leads, q, status, showAll, canSeeAll, me]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const by = (a, b) => {
      let va, vb;
      if (sortKey === "due") {
        va = a.nextAction?.dueAt ?? Infinity;
        vb = b.nextAction?.dueAt ?? Infinity;
      } else {
        va = a.lastActivityAt ?? 0;
        vb = b.lastActivityAt ?? 0;
      }
      return sortDir === "asc" ? va - vb : vb - va;
    };
    arr.sort(by);
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir(key === "due" ? "asc" : "desc");
      return;
    }
    setSortDir(d => (d === "asc" ? "desc" : "asc"));
  };

  const allSelected = selectedIds.size > 0 && sorted.every(l => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected || someSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map(l => l.id)));
    }
  };
  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const assignToMe = () => {
    if (selectedIds.size === 0) return;
    const next = leads.map(l => (selectedIds.has(l.id) ? { ...l, assignedTo: me, updatedAt: Date.now() } : l));
    setLeads(next);
    saveLeads(next);
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    const next = leads.filter(l => !selectedIds.has(l.id));
    setLeads(next);
    saveLeads(next);
    setSelectedIds(new Set());
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Phone", "Email", "Source", "Status", "Assigned", "NextActionType", "NextActionDue", "LastActivityAt"],
      ...sorted.map(l => [
        l.name,
        l.phone || "",
        l.email || "",
        l.source || "",
        l.status || "",
        userName(l.assignedTo),
        l.nextAction?.type || "",
        l.nextAction?.dueAt ? new Date(l.nextAction.dueAt).toISOString() : "",
        l.lastActivityAt ? new Date(l.lastActivityAt).toISOString() : "",
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openLead = (lead) => setDrawerLead(lead);
  const closeDrawer = () => setDrawerLead(null);

  const onDrawerChange = (updated) => {
    const next = leads.map(l => (l.id === updated.id ? updated : l));
    setLeads(next);
    saveLeads(next);
  };

  const fmtRel = (ts) => {
    if (!ts) return "—";
    const now = Date.now();
    const d = Math.round((now - ts) / 60000);
    if (d < 1) return "just now";
    if (d < 60) return `${d}m ago`;
    const h = Math.round(d / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.round(h / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <div className="flex items-center gap-2">
          {canSeeAll && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
              title={showAll ? "Showing all leads" : "Showing my leads"}
            >
              {showAll ? "All leads" : "My leads"}
            </button>
          )}
          <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 w-full md:w-72">
          <Search className="h-4 w-4 opacity-70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email, source"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS.map(s => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`px-3 py-1.5 rounded-lg text-sm ring-1 transition
                ${status === s.id ? "bg-white/10 ring-white/20" : "bg-white/5 ring-white/10 hover:bg-white/8"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => toggleSort("updated")}
            className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-1 bg-white/5 ring-1 ring-white/10 hover:bg-white/8 ${
              sortKey === "updated" ? "opacity-100" : "opacity-80"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" /> Updated
          </button>
          <button
            onClick={() => toggleSort("due")}
            className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-1 bg-white/5 ring-1 ring-white/10 hover:bg-white/8 ${
              sortKey === "due" ? "opacity-100" : "opacity-80"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" /> Next due
          </button>
        </div>
      </div>

      {/* Bulk actions bar (sticky) */}
      {selectedIds.size > 0 && (
        <div className="sticky top-16 z-10 rounded-xl bg-[#111821]/90 backdrop-blur ring-1 ring-white/10 px-3 py-2 flex items-center gap-2">
          <div className="text-sm">{selectedIds.size} selected</div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={assignToMe} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm inline-flex items-center gap-1">
              <UserPlus className="h-4 w-4" /> Assign to me
            </button>
            <button onClick={deleteSelected} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm inline-flex items-center gap-1">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03]">
            <tr className="text-left text-[#9FB0C6]">
              <th className="py-2 pl-4 pr-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                />
              </th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Contact</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Assigned</th>
              <th className="py-2 pr-4">Next Action</th>
              <th className="py-2 pr-4">Updated</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((l, idx) => {
              const due = l.nextAction?.dueAt;
              return (
                <tr key={l.id} className={`border-t border-white/10 ${idx % 2 ? "bg-white/[0.02]" : ""}`}>
                  <td className="py-2 pl-4 pr-2 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(l.id)}
                      onChange={() => toggleOne(l.id)}
                    />
                  </td>
                  <td className="py-2 pr-4 align-middle">
                    <button
                      className="text-[#E6F1FF] hover:underline"
                      onClick={() => setDrawerLead(l)}
                      title="Open lead"
                    >
                      {l.name}
                    </button>
                  </td>
                  <td className="py-2 pr-4 align-middle text-[#C7D6EA]">
                    {(l.phone || l.email) ? (l.phone || l.email) : "—"}
                  </td>
                  <td className="py-2 pr-4 align-middle text-[#C7D6EA]">{l.source || "—"}</td>
                  <td className="py-2 pr-4 align-middle">
                    <StatusPill value={l.status} />
                  </td>
                  <td className="py-2 pr-4 align-middle text-[#C7D6EA]">{userName(l.assignedTo)}</td>
                  <td className="py-2 pr-4 align-middle text-[#C7D6EA]">
                    {l.nextAction ? `${l.nextAction.type} • ${due ? new Date(due).toLocaleString() : ""}` : "—"}
                  </td>
                  <td className="py-2 pr-4 align-middle text-[#9FB0C6]">{fmtRel(l.lastActivityAt)}</td>
                  <td className="py-2 pr-4 align-middle text-right">
                    <button
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                      onClick={() => {
                        const updated = updateLead(l.id, { assignedTo: me });
                        if (updated) {
                          const next = leads.map(x => (x.id === l.id ? updated : x));
                          setLeads(next);
                          saveLeads(next);
                        }
                      }}
                      title="Assign to me"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-[#9FB0C6]">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <LeadDrawer
        lead={drawerLead}
        open={!!drawerLead}
        onClose={closeDrawer}
        onChange={onDrawerChange}
      />
    </div>
  );
}
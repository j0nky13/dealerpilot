import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QueueCard from "../../components/QueueCard.jsx";
import LeadDrawer from "../../components/LeadDrawer.jsx";
import {
  loadLeads,
  saveLeads,
  snoozeLead,
  markDone,
} from "../../lib/leadsStorage.js";
import { getCurrentUserId, getCurrentUserRole } from "../../lib/roles.js";
import RoundRobinStrip from "../../components/RoundRobinStrip.jsx";
import { loadPools, getNextIndex } from "../../lib/roundRobinStorage.js";

export default function Today() {
  const userId = getCurrentUserId();
  const role = getCurrentUserRole();
  const canSeeAll = role === "manager" || role === "bdc" || role === "admin";

  const [viewAll, setViewAll] = useState(false);
  const [leads, setLeads] = useState(loadLeads());
  const [selected, setSelected] = useState(null);

  // Sales pool strip (unchanged)
  const pools = loadPools();
  const salesPool = pools.find((p) => p.id === "floor-sales") || pools[0];
  const nextIdx = salesPool ? getNextIndex(salesPool.id) : 0;

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  useEffect(() => {
    const handler = () => setLeads(loadLeads());
    window.addEventListener("lead:created", handler);
    return () => window.removeEventListener("lead:created", handler);
  }, []);

  // Derived queue
  const now = Date.now();
  const myLeads = useMemo(
    () => leads.filter((l) => (viewAll && canSeeAll ? true : l.assignedTo === userId)),
    [leads, userId, viewAll, canSeeAll]
  );

  const dueCounts = useMemo(() => {
    let overdue = 0,
      dueNow = 0,
      upcoming = 0;
    myLeads.forEach((l) => {
      const dueAt = l.nextAction?.dueAt;
      if (!dueAt) return;
      if (dueAt < now) overdue++;
      else if (dueAt - now < 2 * 60 * 60 * 1000) dueNow++;
      else upcoming++;
    });
    return { overdue, dueNow, upcoming };
  }, [myLeads, now]);

  const sortedQueue = useMemo(() => {
    return [...myLeads].sort((a, b) => {
      const aDue = a.nextAction?.dueAt ?? Infinity;
      const bDue = b.nextAction?.dueAt ?? Infinity;
      return aDue - bDue;
    });
  }, [myLeads]);

  const refreshLead = (updated) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleSnooze = (id, ms) => {
    const u = snoozeLead(id, ms);
    if (u) refreshLead(u);
  };

  const handleDone = (id) => {
    const u = markDone(id);
    if (u) refreshLead(u);
  };

  const openLead = (lead) => setSelected(lead);
  const closeLead = () => setSelected(null);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Today</h1>
          <p className="text-sm text-[#9FB0C6]">
            Clear your follow-ups and keep the rotation healthy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canSeeAll && (
            <button
              onClick={() => setViewAll((v) => !v)}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
              title={viewAll ? "Showing all" : "Showing mine"}
            >
              {viewAll ? "All leads" : "My leads"}
            </button>
          )}
        </div>
      </div>

      {/* Sales Round Robin strip */}
      {salesPool && (
        <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#5BE6CE]" />
              <h2 className="text-lg font-semibold">Sales Round Robin</h2>
            </div>
            <Link
              to="/app/roundrobin"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
            >
              Open full board →
            </Link>
          </div>
          <RoundRobinStrip pool={salesPool} currentUserId={userId} nextIndex={nextIdx} />
        </div>
      )}

      {/* Counters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-rose-500/10 ring-1 ring-rose-400/30 text-rose-200">
          Overdue: {dueCounts.overdue}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 ring-1 ring-amber-400/30 text-amber-200">
          Due now: {dueCounts.dueNow}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/25 text-emerald-200">
          Upcoming: {dueCounts.upcoming}
        </span>
      </div>

      {/* Queue list */}
      <div className="grid gap-3 md:grid-cols-2">
        {sortedQueue.map((lead) => (
          <QueueCard
            key={lead.id}
            lead={lead}
            onOpen={() => openLead(lead)}
            onSnooze={(ms) => handleSnooze(lead.id, ms)}
            onDone={() => handleDone(lead.id)}
          />
        ))}

        {sortedQueue.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-[#9FB0C6]">
            All clear. Nice work!
          </div>
        )}
      </div>

      {/* Lead drawer */}
      <LeadDrawer
        lead={selected}
        open={!!selected}
        onClose={closeLead}
        onChange={(updated) => {
          // persist and refresh
          const next = leads.map((l) => (l.id === updated.id ? updated : l));
          saveLeads(next);
          setLeads(next);
        }}
      />
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QueueCard from "../../components/QueueCard.jsx";
import LeadDrawer from "../../components/LeadDrawer.jsx";
import RoundRobinStrip from "../../components/RoundRobinStrip.jsx";

import { useAuth } from "../../lib/authProvider.jsx";
import {
  watchLeads,
  watchLeadsMine,
  snoozeLead as snoozeLeadApi,
  patchLead,
} from "../../lib/leadsApi.js";

import { loadPools, getNextIndex } from "../../lib/roundRobinStorage.js";

export default function Today() {
  const { user, role } = useAuth();
  const uid = user?.uid || null;
  const canSeeAll = role === "manager" || role === "bdc" || role === "admin";

  const [viewAll, setViewAll] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);

  // Sales pool strip (unchanged)
  const pools = loadPools();
  const salesPool = pools.find((p) => p.id === "floor-sales") || pools[0];
  const nextIdx = salesPool ? getNextIndex(salesPool.id) : 0;

  // Real-time leads subscription
  useEffect(() => {
    if (!uid) return;

    let unsub = () => {};
    if (canSeeAll && viewAll) {
      unsub = watchLeads({
        onChange: (rows) => setLeads(rows || []),
        take: 1000,
      });
    } else {
      unsub = watchLeadsMine(uid, {
        onChange: (rows) => setLeads(rows || []),
        take: 1000,
      });
    }
    return () => unsub();
  }, [uid, canSeeAll, viewAll]);

  // Derived queue
  const now = Date.now();
  const myLeads = useMemo(() => {
    if (!canSeeAll || !viewAll) return leads.filter((l) => l.assignedTo === uid);
    return leads;
  }, [leads, uid, canSeeAll, viewAll]);

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

  const openLead = (lead) => setSelected(lead);
  const closeLead = () => setSelected(null);

  // Actions (Firestore)
  const handleSnooze = async (id, ms) => {
    try {
      await snoozeLeadApi(id, ms, "call");
    } catch (e) {
      console.error("Snooze failed", e);
    }
  };

  const handleDone = async (id) => {
    // mark current nextAction as done => clear it
    try {
      await patchLead(id, { nextAction: null });
    } catch (e) {
      console.error("Mark done failed", e);
    }
  };

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
          <RoundRobinStrip pool={salesPool} currentUserId={uid} nextIndex={nextIdx} />
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
        onChange={() => {
          // no local save needed; Firestore watcher will refresh the list
        }}
      />
    </div>
  );
}
import { loadLeads } from "./leadsStorage.js";
import { loadAppointments } from "./appointmentsStorage.js";

export function rangeWindow(range = "7d") {
  const now = Date.now();
  const days = range === "30d" ? 30 : range === "qtd" ? 92 : 7;
  return { start: now - days * 24 * 60 * 60 * 1000, end: now };
}

export function computeReports(range = "7d") {
  const { start, end } = rangeWindow(range);
  const leads = loadLeads();
  const appts = loadAppointments();

  const inRange = (ts) => ts >= start && ts <= end;

  const leadsInRange = leads.filter((l) => inRange(l.createdAt || l.lastActivityAt || 0));
  const newLeads = leadsInRange.length;

  // First touch: we approximate as (lastActivityAt - createdAt) if createdAt exists and lastActivityAfter createdAt
  const withTimes = leadsInRange
    .map((l) => {
      const created = l.createdAt || l.lastActivityAt;
      const last = l.lastActivityAt || created;
      const deltaMin = Math.max(0, Math.round((last - created) / 60000));
      return { l, deltaMin };
    });

  const firstTouchUnder15 = withTimes.filter((x) => x.deltaMin <= 15).length;
  const firstTouchPct = newLeads ? Math.round((firstTouchUnder15 / newLeads) * 100) : 0;

  const apptSet = leads.filter((l) => l.status === "appt_set" && inRange(l.lastActivityAt || 0)).length;
  const sold = leads.filter((l) => l.status === "sold" && inRange(l.lastActivityAt || 0)).length;

  const avgFirstTouchMin = withTimes.length
    ? Math.round(withTimes.reduce((s, x) => s + x.deltaMin, 0) / withTimes.length)
    : 0;

  // Simple funnel snapshot
  const funnel = {
    new: leads.filter((l) => l.status === "new").length,
    working: leads.filter((l) => l.status === "working").length,
    appt_set: leads.filter((l) => l.status === "appt_set").length,
    showed: leads.filter((l) => l.status === "showed").length,
    sold: leads.filter((l) => l.status === "sold").length,
  };

  // Activity heat approximated by lastActivityAt frequency buckets (7x6 grid placeholder)
  const heat = Array.from({ length: 42 }).map((_, i) => {
    // crude synthetic mapping for UI placeholder
    const day = new Date(start + (i * (end - start)) / 42);
    const count = leads.filter((l) => {
      const t = l.lastActivityAt || 0;
      const sameDay =
        new Date(t).toDateString() === day.toDateString();
      return sameDay;
    }).length;
    return count;
  });

  // Appointments in range
  const apptsInRange = appts.filter((a) => inRange(a.at));
  const apptShowed = apptsInRange.filter((a) => a.status === "showed").length;

  return {
    newLeads,
    firstTouchPct,
    apptSet,
    sold,
    avgFirstTouchMin,
    funnel,
    heat,
    apptShowed,
  };
}
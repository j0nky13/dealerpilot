/**
 * Local storage stub for appointments.
 * Swap with Firestore later.
 */
const KEY = "dealerpilot.appts.v1";

const now = new Date();
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const addMinutes = (d, m) => new Date(d.getTime() + m * 60000);

const demo = (() => {
  const d0 = startOfDay(now);
  return [
    {
      id: "a1",
      leadId: "l1",
      leadName: "Jordan Avery",
      type: "sales",              // sales | service | delivery
      at: addMinutes(d0, 10 * 60).getTime(), // 10:00
      durationMin: 45,
      status: "scheduled",        // scheduled | showed | no_show | cancelled
      notes: "First visit. Interested in midsize SUV.",
      assignedTo: "u4",
    },
    {
      id: "a2",
      leadId: "l2",
      leadName: "Sam Patel",
      type: "sales",
      at: addMinutes(d0, 13 * 60 + 30).getTime(), // 13:30
      durationMin: 30,
      status: "scheduled",
      notes: "Test drive; trade appraisal.",
      assignedTo: "u6",
    },
    {
      id: "a3",
      leadId: "l3",
      leadName: "Maya Chen",
      type: "service",
      at: addMinutes(d0, 15 * 60).getTime(), // 15:00
      durationMin: 60,
      status: "scheduled",
      notes: "Service upsell check.",
      assignedTo: "u4",
    },
  ];
})();

function loadJSON(k, fb) {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fb;
    const p = JSON.parse(raw);
    return p ?? fb;
  } catch {
    return fb;
  }
}
function saveJSON(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

export function loadAppointments() {
  return loadJSON(KEY, demo);
}
export function saveAppointments(list) {
  saveJSON(KEY, list);
}

export function addAppointment(appt) {
  const list = loadAppointments();
  const id = `a_${Math.random().toString(36).slice(2, 9)}`;
  const next = [...list, { ...appt, id }];
  saveAppointments(next);
  return id;
}

export function updateAppointment(id, patch) {
  const list = loadAppointments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const nextItem = { ...list[idx], ...patch };
  const next = [...list];
  next[idx] = nextItem;
  saveAppointments(next);
  return nextItem;
}

export function deleteAppointment(id) {
  const list = loadAppointments();
  const next = list.filter((a) => a.id !== id);
  saveAppointments(next);
}
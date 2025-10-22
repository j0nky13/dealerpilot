const LEADS_KEY = "dealerpilot.leads.v1";
const ACT_KEY = "dealerpilot.activities.v1";

const now = () => Date.now();
const H = (h) => h * 60 * 60 * 1000;

const demoLeads = [
  {
    id: "l1",
    name: "Jordan Avery",
    phone: "(555) 201-9933",
    email: "jordan@example.com",
    source: "Website",
    status: "new",
    assignedTo: "u4",
    nextAction: { type: "call", dueAt: now() - H(2) },
    lastActivityAt: now() - H(26),
    createdAt: now() - H(30),
  },
  {
    id: "l2",
    name: "Sam Patel",
    email: "sam.p@example.com",
    source: "Facebook",
    status: "working",
    assignedTo: "u6",
    nextAction: { type: "sms", dueAt: now() + H(1) },
    lastActivityAt: now() - H(6),
    createdAt: now() - H(40),
  },
  {
    id: "l3",
    name: "Maya Chen",
    phone: "(555) 443-2299",
    source: "Phone",
    status: "working",
    assignedTo: "u4",
    nextAction: { type: "email", dueAt: now() + H(5) },
    lastActivityAt: now() - H(1),
    createdAt: now() - H(4),
  },
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadLeads() {
  return loadJSON(LEADS_KEY, demoLeads);
}
export function saveLeads(leads) {
  saveJSON(LEADS_KEY, leads);
}

export function addLead({ name, phone, email, source, status = "new", assignedTo, nextAction, note }) {
  const leads = loadLeads();
  const id = `l_${Math.random().toString(36).slice(2, 9)}`;
  const lead = {
    id,
    name,
    phone,
    email,
    source,
    status,
    assignedTo,
    nextAction,
    lastActivityAt: now(),
    createdAt: now(),
  };
  const next = [lead, ...leads];
  saveLeads(next);
  if (note) addActivity({ leadId: id, type: "note", note });
  return id;
}

export function getActivities(leadId) {
  const all = loadJSON(ACT_KEY, []);
  return all.filter((a) => a.leadId === leadId).sort((a, b) => b.at - a.at);
}

export function addActivity({ leadId, type, note }) {
  const all = loadJSON(ACT_KEY, []);
  const act = {
    id: `a_${Math.random().toString(36).slice(2, 9)}`,
    leadId,
    type, // call | sms | email | note | done | snooze | lead_ingested
    at: now(),
    note,
  };
  all.push(act);
  saveJSON(ACT_KEY, all);
  const leads = loadLeads().map((l) =>
    l.id === leadId ? { ...l, lastActivityAt: act.at } : l
  );
  saveLeads(leads);
  return act;
}

export function updateLead(id, patch) {
  const leads = loadLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return;
  leads[idx] = { ...leads[idx], ...patch, lastActivityAt: patch.lastActivityAt ?? leads[idx].lastActivityAt };
  saveLeads(leads);
  return leads[idx];
}

export function snoozeLead(id, ms) {
  const leads = loadLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return;
  const dueAt = Math.max(leads[idx].nextAction?.dueAt ?? now(), now()) + ms;
  leads[idx] = {
    ...leads[idx],
    nextAction: { ...(leads[idx].nextAction || { type: "followup" }), dueAt },
  };
  saveLeads(leads);
  addActivity({ leadId: id, type: "snooze", note: `Snoozed ${Math.round(ms / (60 * 1000))}m` });
  return leads[idx];
}

export function markDone(id) {
  const leads = loadLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return;
  leads[idx] = {
    ...leads[idx],
    nextAction: undefined,
    status: leads[idx].status === "new" ? "working" : leads[idx].status,
    lastActivityAt: now(),
  };
  saveLeads(leads);
  addActivity({ leadId: id, type: "done", note: "Follow-up completed" });
  return leads[idx];
}
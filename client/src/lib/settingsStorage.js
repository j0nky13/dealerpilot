// src/lib/settingsStorage.js
const ORG_KEY = "dealerpilot.org.settings.v1";
const USER_KEY = "dealerpilot.user.settings.v1";

export const defaultOrgSettings = {
  orgName: "Demo Motors",
  phone: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  brand: { primary: "#5BE6CE", logoUrl: "" },
  hours: {
    mon: { open: true, start: "09:00", end: "18:00" },
    tue: { open: true, start: "09:00", end: "18:00" },
    wed: { open: true, start: "09:00", end: "18:00" },
    thu: { open: true, start: "09:00", end: "18:00" },
    fri: { open: true, start: "09:00", end: "18:00" },
    sat: { open: true, start: "10:00", end: "16:00" },
    sun: { open: false, start: "00:00", end: "00:00" },
  },
  roundRobin: { autoAssign: true },
  pipeline: {
    statuses: ["new", "working", "appt_set", "showed", "sold", "lost"],
    sla: { firstTouchMin: 15, overdueHours: 24 },
  },
  notifications: {
    slaBreach: true,
    apptReminders: true,
  },
  leadSources: ["Website", "TradePending", "Phone", "Walk-in"],
};

export const defaultUserPrefs = {
  theme: "dark",
  compact: false,
  defaultRoute: "/app/today",
  signature: "",
  notify: {
    assignedToMe: true,
    slaBreach: true,
    apptToday: true,
  },
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const loadOrgSettings = () => load(ORG_KEY, defaultOrgSettings);
export const saveOrgSettings = (data) => save(ORG_KEY, data);
export const loadUserPrefs = () => load(USER_KEY, defaultUserPrefs);
export const saveUserPrefs = (data) => save(USER_KEY, data);

export const formatPhone = (v = "") => {
  const d = (v.match(/\d/g) || []).join("").slice(0, 10);
  if (!d) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)})-${d.slice(3)}`;
  return `(${d.slice(0, 3)})-${d.slice(3, 6)}-${d.slice(6)}`;
};
// src/lib/usersStorage.js
const KEY = "dealerpilot.users.v1";

const seed = [
  { id: "u1", name: "Morgan H.", email: "morgan@example.com", role: "bdc", dept: "BDC", active: true },
  { id: "u2", name: "Kyle R.",   email: "kyle@example.com",   role: "bdc", dept: "BDC", active: true },
  { id: "u4", name: "Jimmy W.",  email: "jimmy@example.com",  role: "sales", dept: "Sales", active: true },
  { id: "u6", name: "Tony W.",   email: "tony@example.com",   role: "sales", dept: "Sales", active: true },
  { id: "m1", name: "Dana K.",   email: "dana@example.com",   role: "manager", dept: "Sales", active: true },
];

function loadJSON(k, fb) {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; }
}
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

export function loadUsers() { return loadJSON(KEY, seed); }
export function saveUsers(arr) { saveJSON(KEY, arr); return arr; }

export function addUser({ name, email, role = "sales", dept = "Sales" }) {
  const users = loadUsers();
  const id = crypto?.randomUUID?.() || `u_${Date.now()}`;
  const next = [...users, { id, name, email, role, dept, active: true }];
  saveUsers(next);
  return id;
}
export function updateUser(id, patch) {
  const users = loadUsers();
  const i = users.findIndex(u => u.id === id);
  if (i === -1) return null;
  users[i] = { ...users[i], ...patch };
  saveUsers(users);
  return users[i];
}
export function removeUser(id) {
  const next = loadUsers().filter(u => u.id !== id);
  saveUsers(next);
  return true;
}
export function setActive(id, active) { return updateUser(id, { active: !!active }); }
export function setRole(id, role) { return updateUser(id, { role }); }
export function setDept(id, dept) { return updateUser(id, { dept }); }

// Dumb KPIs placeholder (replace with real queries)
export function userKpis(id) {
  const hash = Array.from(id).reduce((a,c)=>a+c.charCodeAt(0),0);
  const rand = (m,n)=> m + (hash % (n-m+1));
  return {
    open: rand(8,24),
    overdue: rand(0,6),
    newToday: rand(0,8),
    lastActivityMins: rand(1,30),
    apptThisWeek: rand(0,7),
    soldThisMonth: rand(0,6),
  };
}
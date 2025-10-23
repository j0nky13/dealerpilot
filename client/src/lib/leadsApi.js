// src/lib/leadsApi.js
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * If Firestore suggests indexes, add them:
 *  - assignedTo ASC, lastActivityAt DESC
 *  - status ASC,     lastActivityAt DESC
 */

// --------------------------- One-shot reads --------------------------------

export async function fetchAllLeads({ take = 500 } = {}) {
  const qy = query(
    collection(db, "leads"),
    orderBy("lastActivityAt", "desc"),
    limit(take)
  );
  const qs = await getDocs(qy);
  return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchLeadsMine(userId, { take = 500 } = {}) {
  if (!userId) return [];
  const qy = query(
    collection(db, "leads"),
    where("assignedTo", "==", userId),
    orderBy("lastActivityAt", "desc"),
    limit(take)
  );
  const qs = await getDocs(qy);
  return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchLeadsByStatus(status, { take = 500 } = {}) {
  const parts = [collection(db, "leads")];
  if (status && status !== "all") parts.push(where("status", "==", status));
  parts.push(orderBy("lastActivityAt", "desc"), limit(take));
  const qy = query(...parts);
  const qs = await getDocs(qy);
  return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getLead(id) {
  const ref = doc(db, "leads", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// --------------------------- Polling (no streaming) ------------------------
// Returns a cleanup function (clearInterval). Call it in useEffect cleanup.

export function pollAllLeads(onChange, { take = 500, intervalMs = 15000 } = {}) {
  let timer;
  const tick = async () => onChange(await fetchAllLeads({ take }));
  tick();
  timer = setInterval(tick, intervalMs);
  return () => clearInterval(timer);
}

export function pollLeadsMine(userId, onChange, { take = 500, intervalMs = 15000 } = {}) {
  if (!userId) return () => {};
  let timer;
  const tick = async () => onChange(await fetchLeadsMine(userId, { take }));
  tick();
  timer = setInterval(tick, intervalMs);
  return () => clearInterval(timer);
}

export function pollLeadsByStatus(status, onChange, { take = 500, intervalMs = 15000 } = {}) {
  let timer;
  const tick = async () => onChange(await fetchLeadsByStatus(status, { take }));
  tick();
  timer = setInterval(tick, intervalMs);
  return () => clearInterval(timer);
}

export function pollLead(id, onChange, { intervalMs = 15000 } = {}) {
  if (!id) return () => {};
  let timer;
  const tick = async () => onChange(await getLead(id));
  tick();
  timer = setInterval(tick, intervalMs);
  return () => clearInterval(timer);
}

// --------------------------- Mutations -------------------------------------

function toPhoneRaw(s) {
  const d = (s || "").replace(/\D/g, "");
  return d.length ? d : null;
}

export async function createLead(data) {
  const ref = await addDoc(collection(db, "leads"), {
    name: data.name || "Unnamed",
    phone: data.phone || null,            // formatted for UI
    phoneRaw: toPhoneRaw(data.phone),     // digits-only for SMS/integrations
    email: data.email || null,
    source: data.source || "Manual",
    status: data.status || "new",
    assignedTo: data.assignedTo || null,
    nextAction: data.nextAction || null,  // { type, dueAt }
    lastActivityAt: Date.now(),
    lastActivityAtServer: serverTimestamp(),
    createdAt: serverTimestamp(),
    createdBy: data.createdBy || null,
  });
  return ref.id;
}

export async function patchLead(id, patch) {
  const computed = {};
  if (Object.prototype.hasOwnProperty.call(patch, "phone")) {
    computed.phoneRaw = toPhoneRaw(patch.phone);
  }
  await updateDoc(doc(db, "leads", id), {
    ...patch,
    ...computed,
    lastActivityAt: Date.now(),
    lastActivityAtServer: serverTimestamp(),
  });
}

export async function reassignLead(id, userId) {
  await patchLead(id, { assignedTo: userId });
}

export async function setLeadStatus(id, status) {
  await patchLead(id, { status });
}

export async function snoozeLead(id, ms, type = "call") {
  const due = Date.now() + (Number(ms) || 0);
  await patchLead(id, { nextAction: { type, dueAt: due } });
}

export async function deleteLead(id) {
  await deleteDoc(doc(db, "leads", id));
}

// --------------------------- Compatibility shims ---------------------------
// Keep old API names working; under the hood we use polling (no onSnapshot).

export function watchLeads({ onChange, take = 500 } = {}) {
  return pollAllLeads(onChange, { take });
}

export function watchLeadsMine(userId, { onChange, take = 500 } = {}) {
  return pollLeadsMine(userId, onChange, { take });
}

export function watchLeadsByStatus(status, { onChange, take = 500 } = {}) {
  return pollLeadsByStatus(status, onChange, { take });
}

export function watchLead(id, { onChange } = {}) {
  return pollLead(id, onChange);
}
import {
  collection, query, where, orderBy, getDocs, doc, updateDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { normalizeRole } from "./roles";

/**
 * Ensure an org doc exists (optional helper if you want /orgs)
 */
export async function ensureOrg(orgId, data = {}) {
  if (!orgId) return;
  const ref = doc(db, "orgs", orgId);
  await setDoc(ref, { name: data.name || orgId, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * List users in an org
 */
export async function listUsersByOrg(orgId) {
  const q = query(
    collection(db, "users"),
    where("orgId", "==", orgId),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update a user's role (manager/admin only via Security Rules)
 */
export async function updateUserRole(uid, newRole) {
  const role = normalizeRole(newRole);
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { role, updatedAt: serverTimestamp() });
}

/**
 * (Optional) Set a user's org if missing (first login provisioning)
 */
export async function setUserOrgIfMissing(uid, orgId, defaultRole = "sales", email) {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      orgId,
      role: normalizeRole(defaultRole),
      email: email || null,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
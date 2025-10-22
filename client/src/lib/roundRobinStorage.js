/**
 * Local storage for Round Robin pools (demo-only).
 * Swap with Firestore later.
 */
const KEY = "dealerpilot.pools.v1";

// ---- Demo data (safe defaults) ----
const demoPools = [
  {
    id: "pool_bdc",
    name: "Internet BDC",
    nextIndex: 0,
    users: [
      { id: "u1", name: "Tony W.", active: true },
      { id: "u2", name: "David G.", active: true },
      { id: "u3", name: "Jimmy W..", active: true },
    ],
  },
  {
    id: "pool_sales",
    name: "Floor Sales",
    nextIndex: 0,
    users: [
      { id: "u4", name: "Jimmy W.", active: true },
      { id: "u5", name: "David G.", active: true },
      { id: "u6", name: "Tony W.", active: true },
    ],
  },
  {
    id: "pool_service_bdc",
    name: "Service BDC",
    nextIndex: 0,
    users: [
      { id: "u7", name: "Hank J.", active: true },
      { id: "u8", name: "Gina P.", active: true },
    ],
  },
];

// ---- helpers ----
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---- public API ----
export function loadPools() {
  return loadJSON(KEY, demoPools);
}
export function savePools(pools) {
  saveJSON(KEY, pools);
}

export function getPool(poolId) {
  return loadPools().find((p) => p.id === poolId) || null;
}

/** Reset the rotation pointer for a pool to 0 and persist. */
export function resetNextIndex(poolId) {
  const pools = loadPools();
  const idx = pools.findIndex((p) => p.id === poolId);
  if (idx === -1) return null;
  const updated = { ...pools[idx], nextIndex: 0 };
  const next = [...pools];
  next[idx] = updated;
  savePools(next);
  return updated;
}

/** Toggle a user's active flag inside a pool. */
export function setUserActive(poolId, userId, active) {
  const pools = loadPools();
  const idx = pools.findIndex((p) => p.id === poolId);
  if (idx === -1) return null;
  const pool = pools[idx];
  const users = (pool.users || []).map((u) =>
    u.id === userId ? { ...u, active: !!active } : u
  );
  const updated = { ...pool, users };
  const next = [...pools];
  next[idx] = updated;
  savePools(next);
  return updated;
}

/** Advance rotation pointer to the next active user. */
export function advanceNextIndex(poolId) {
  const pools = loadPools();
  const idx = pools.findIndex((p) => p.id === poolId);
  if (idx === -1) return null;
  const pool = pools[idx];
  const actives = (pool.users || []).filter((u) => u.active);
  const count = actives.length || 1;
  const nextIndex = ((pool.nextIndex || 0) + 1) % count;
  const updated = { ...pool, nextIndex };
  const next = [...pools];
  next[idx] = updated;
  savePools(next);
  return updated;
}

/** Return the current rotation pointer (safe fallback 0). */
export function getNextIndex(poolId) {
  const pool = getPool(poolId);
  return pool?.nextIndex ?? 0;
}

/** Return the next active user object based on the pointer. */
export function getNextUser(poolId) {
  const pool = getPool(poolId);
  if (!pool) return null;
  const actives = (pool.users || []).filter((u) => u.active);
  if (actives.length === 0) return null;
  const idx = getNextIndex(poolId) % actives.length;
  return actives[idx];
}
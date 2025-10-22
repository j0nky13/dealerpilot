import { useEffect, useMemo, useRef, useState } from "react";

/**
 * RoundRobinBoard
 * - Visible to everyone
 * - Editable only if `canEdit` is true (Manager/BDC)
 * - Native HTML5 drag & drop (no extra deps)
 *
 * Props:
 *  - pools: Array<{ id, name, users: Array<{ id, name, active?: boolean }> }>
 *  - canEdit: boolean
 *  - onChange: (nextPools) => void   // called after any reorder/move
 */
export default function RoundRobinBoard({ pools: initialPools, canEdit, onChange }) {
  const [pools, setPools] = useState(initialPools || []);
  const dragDataRef = useRef(null);

  useEffect(() => {
    setPools(initialPools || []);
  }, [initialPools]);

  const handleDragStart = (e, fromPoolId, userId) => {
    if (!canEdit) return;
    dragDataRef.current = { fromPoolId, userId };
    e.dataTransfer.effectAllowed = "move";
    // ghost
    const dt = e.dataTransfer;
    if (dt.setDragImage) {
      const el = document.createElement("div");
      el.style.padding = "6px 10px";
      el.style.background = "rgba(17,24,33,.9)";
      el.style.color = "white";
      el.style.borderRadius = "8px";
      el.style.position = "fixed";
      el.style.top = "-9999px";
      el.innerText = "Moving…";
      document.body.appendChild(el);
      dt.setDragImage(el, 0, 0);
      setTimeout(() => document.body.removeChild(el), 0);
    }
  };

  const handleDropOnPool = (e, toPoolId, toIndex = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canEdit) return;

    const data = dragDataRef.current;
    if (!data) return;

    const { fromPoolId, userId } = data;
    if (!userId) return;

    setPools((prev) => {
      // Deep clone
      const next = prev.map((p) => ({ ...p, users: [...p.users] }));
      const fromPool = next.find((p) => p.id === fromPoolId);
      const toPool = next.find((p) => p.id === toPoolId);
      if (!fromPool || !toPool) return prev;

      const userIdx = fromPool.users.findIndex((u) => u.id === userId);
      if (userIdx === -1) return prev;

      const [user] = fromPool.users.splice(userIdx, 1);

      // insert at target index or push to end
      if (toIndex === null || toIndex > toPool.users.length) {
        toPool.users.push(user);
      } else {
        toPool.users.splice(toIndex, 0, user);
      }
      onChange?.(next);
      return next;
    });

    dragDataRef.current = null;
  };

  const handleDragOver = (e) => {
    if (!canEdit) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Simple up/down controls (keyboard friendly) for each user row
  const bumpUser = (poolId, userId, dir) => {
    if (!canEdit) return;
    setPools((prev) => {
      const next = prev.map((p) => ({ ...p, users: [...p.users] }));
      const pool = next.find((p) => p.id === poolId);
      if (!pool) return prev;
      const idx = pool.users.findIndex((u) => u.id === userId);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= pool.users.length) return prev;
      [pool.users[idx], pool.users[target]] = [pool.users[target], pool.users[idx]];
      onChange?.(next);
      return next;
    });
  };

  const totals = useMemo(() => {
    const active = pools.reduce((acc, p) => acc + p.users.filter((u) => u.active !== false).length, 0);
    const all = pools.reduce((acc, p) => acc + p.users.length, 0);
    return { active, all };
  }, [pools]);

  return (
    <section className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Round Robin</h2>
        <p className="text-xs text-[#9FB0C6]">
          {totals.active}/{totals.all} active reps in rotation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pools.map((pool) => (
          <div
            key={pool.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnPool(e, pool.id)}
            className="rounded-2xl bg-[#111821]/70 ring-1 ring-white/10 p-4 shadow-xl backdrop-blur-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#5BE6CE]" />
                <h3 className="font-semibold">{pool.name}</h3>
              </div>
              <span className="text-xs text-[#9FB0C6]">{pool.users.length} reps</span>
            </div>

            <ul className="space-y-2">
              {pool.users.map((u, idx) => (
                <li
                  key={u.id}
                  draggable={canEdit}
                  onDragStart={(e) => handleDragStart(e, pool.id, u.id)}
                  onDragOver={(e) => {
                    // allow reordering inside pool by dropping before this index
                    handleDragOver(e);
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => handleDropOnPool(e, pool.id, idx)}
                  className={`group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 ${
                    canEdit ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                  }`}
                  title={canEdit ? "Drag to reorder or move to another pool" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        u.active === false ? "bg-rose-400" : "bg-emerald-400"
                      }`}
                      title={u.active === false ? "Paused" : "Active"}
                    />
                    <span className="text-sm">{u.name}</span>
                  </div>

                  {canEdit ? (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => bumpUser(pool.id, u.id, -1)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => bumpUser(pool.id, u.id, +1)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>

            {pool.users.length === 0 && (
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnPool(e, pool.id, 0)}
                className="mt-2 grid place-items-center rounded-xl border border-dashed border-white/15 py-6 text-sm text-[#9FB0C6]"
              >
                {canEdit ? "Drop reps here to add to this pool" : "No reps in this pool"}
              </div>
            )}
          </div>
        ))}
      </div>

      {!canEdit && (
        <p className="mt-3 text-xs text-[#9FB0C6]">
          Managers and BDC can modify the order and membership. Everyone can view the current rotation.
        </p>
      )}
    </section>
  );
}
import { useMemo } from "react";
import { ChevronRight, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * RoundRobinStrip (animated)
 * - Minimal horizontal display for a single Sales pool.
 * - Animates the "Next" user chip (pulse + slide) whenever nextIndex changes.
 *
 * Props:
 * - pool: { id, name, users: [{ id, name, active? }] }
 * - currentUserId: string
 * - nextIndex: number (index within ACTIVE users)
 * - onAdvance?: () => void
 */
export default function RoundRobinStrip({ pool, currentUserId, nextIndex = 0, onAdvance }) {
  const activeUsers = useMemo(
    () => pool.users.filter((u) => u.active !== false),
    [pool]
  );

  const nextUser =
    activeUsers.length ? activeUsers[nextIndex % activeUsers.length] : null;

  return (
    <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#5BE6CE]" />
          <h3 className="text-base font-semibold">{pool.name} • Sales Rotation</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9FB0C6]">
          <AnimatePresence mode="popLayout">
            {nextUser ? (
              <motion.div
                key={nextUser.id} // <-- change of key triggers animation
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline text-[#C7D6EA]">Next:</span>
                <motion.span
                  initial={{ boxShadow: "0 0 0 0 rgba(91,230,206,0.0)" }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(91,230,206,0.0)",
                      "0 0 0 8px rgba(91,230,206,0.12)",
                      "0 0 0 0 rgba(91,230,206,0.0)",
                    ],
                  }}
                  transition={{ duration: 0.9, times: [0, 0.5, 1], ease: "easeOut" }}
                  className="px-2 py-0.5 rounded-full bg-white/5 ring-1 ring-white/10 text-[#E6F1FF]"
                >
                  {nextUser.name}
                </motion.span>
              </motion.div>
            ) : (
              <span>No active reps</span>
            )}
          </AnimatePresence>

          {onAdvance && (
            <button
              onClick={onAdvance}
              className="ml-2 inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/15 px-2 py-1"
              title="Advance rotation"
            >
              <MoveRight className="h-3.5 w-3.5" />
              Advance
            </button>
          )}
        </div>
      </div>

      {/* Horizontal, compact pills */}
      <div className="relative overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {activeUsers.map((u) => {
            const isNext = nextUser && u.id === nextUser.id;
            const isMe = u.id === currentUserId;

            return (
              <motion.div
                layout="position"
                key={u.id}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 shadow-sm
                  ${isMe ? "bg-[#5BE6CE]/15 ring-[#5BE6CE]/30" : "bg-white/5 ring-white/10"}`}
                title={
                  isMe ? "You" : isNext ? "Next in rotation" : "Active in rotation"
                }
                initial={false}
                animate={
                  isNext
                    ? { scale: [1, 1.04, 1], backgroundColor: ["#111821", "#13202A", "#111821"] }
                    : { scale: 1 }
                }
                transition={{ duration: isNext ? 0.5 : 0.2, ease: "easeOut" }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isMe ? "bg-[#5BE6CE]" : "bg-emerald-400"
                  }`}
                />
                <span className={`${isMe ? "text-[#E6F1FF]" : "text-[#C7D6EA]"}`}>
                  {u.name}
                </span>

                <AnimatePresence>
                  {isNext && (
                    <motion.span
                      key="next-tag"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#5BE6CE] ml-1"
                    >
                      <ChevronRight className="h-3 w-3" /> next
                    </motion.span>
                  )}
                </AnimatePresence>

                {isMe && (
                  <span className="ml-1 text-[11px] text-[#5BE6CE]">(you)</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
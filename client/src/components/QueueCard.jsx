import { Phone, MessageSquare, Mail, Clock, CheckCircle2, Bell } from "lucide-react";

export default function QueueCard({ lead, onOpen, onSnooze, onDone }) {
  const dueAt = lead.nextAction?.dueAt ?? null;
  const now = Date.now();
  const overdue = dueAt && dueAt < now;
  const dueSoon = dueAt && dueAt >= now && dueAt - now < 2 * 60 * 60 * 1000; // <2h

  const nextType = lead.nextAction?.type ?? "followup";

  const fmtRel = (ts) => {
    if (!ts) return "—";
    const d = Math.round((ts - now) / 60000); // minutes
    if (d === 0) return "now";
    if (d > 0) {
      if (d < 60) return `in ${d}m`;
      return `in ${Math.round(d / 60)}h`;
    } else {
      const ad = Math.abs(d);
      if (ad < 60) return `${ad}m ago`;
      return `${Math.round(ad / 60)}h ago`;
    }
  };

  const ActionIcon =
    nextType === "call" ? Phone : nextType === "sms" ? MessageSquare : nextType === "email" ? Mail : Bell;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/7 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{lead.name}</h3>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ring-1 ${
                overdue
                  ? "bg-rose-500/15 ring-rose-400/30 text-rose-200"
                  : dueSoon
                  ? "bg-amber-500/15 ring-amber-400/30 text-amber-200"
                  : "bg-emerald-500/10 ring-emerald-400/25 text-emerald-200"
              }`}
              title="Due indicator"
            >
              {overdue ? "Overdue" : dueSoon ? "Due soon" : "Scheduled"}
            </span>
          </div>
          <p className="text-sm text-[#9FB0C6] truncate">
            {lead.phone || lead.email || lead.source || "—"}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#9FB0C6]">
            <Clock className="h-3.5 w-3.5" />
            <span>Next: {nextType}</span>
            <span className="opacity-60">•</span>
            <span>{fmtRel(dueAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15"
            title="Open details"
            onClick={onOpen}
          >
            <ActionIcon className="h-4 w-4" />
          </button>
          <button
            className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15"
            title="Snooze +2h"
            onClick={() => onSnooze(2 * 60 * 60 * 1000)}
          >
            +2h
          </button>
          <button
            className="px-2.5 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95"
            title="Mark done"
            onClick={onDone}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
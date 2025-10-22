import { CalendarClock, User, Clock, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";

export default function AppointmentCard({ appt, onOpen, onMarkShowed, onNoShow, onReschedule }) {
  const start = new Date(appt.at);
  const end = new Date(appt.at + (appt.durationMin || 30) * 60000);

  const fmtTime = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const badge = {
    scheduled: "bg-blue-500/10 ring-blue-400/25 text-blue-200",
    showed: "bg-emerald-500/10 ring-emerald-400/25 text-emerald-200",
    no_show: "bg-rose-500/10 ring-rose-400/25 text-rose-200",
    cancelled: "bg-white/10 ring-white/20 text-[#C7D6EA]",
  }[appt.status || "scheduled"];

  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 opacity-70" />
            <div className="font-semibold truncate">{appt.leadName}</div>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ring-1 ${badge}`}>
              {appt.status.replace("_", " ")}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-[#C7D6EA]">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4 opacity-70" />
              {fmtTime(start)} – {fmtTime(end)}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-4 w-4 opacity-70" /> {appt.assignedTo?.toUpperCase?.() || appt.assignedTo}
            </span>
            <span className="uppercase text-[10px] tracking-wide opacity-70">{appt.type}</span>
          </div>
          {appt.notes && (
            <div className="mt-2 text-sm text-[#9FB0C6] line-clamp-2">{appt.notes}</div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={onOpen} title="Open">
            Details
          </button>
          <button className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={onMarkShowed} title="Mark showed">
            <CheckCircle className="h-4 w-4" />
          </button>
          <button className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={onNoShow} title="Mark no-show">
            <XCircle className="h-4 w-4" />
          </button>
          <button className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={onReschedule} title="Reschedule">
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import RightDrawer from "./RightDrawer.jsx";
import { updateAppointment } from "../lib/appointmentsStorage.js";

export default function AppointmentDrawer({ appt, open, onClose, onChange }) {
  const [local, setLocal] = useState(null);

  // Keep local state in sync when appt changes
  useEffect(() => {
    setLocal(appt ?? null);
  }, [appt]);

  if (!open || !appt || !local) return null;

  const safeISO = (ts) => {
    try {
      return new Date(ts).toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = updateAppointment(local.id, {
      leadName: local.leadName ?? "",
      notes: local.notes ?? "",
      at: new Date(local.at || Date.now()).getTime(),
      durationMin: Number(local.durationMin) || 30,
      type: local.type || "sales",
      status: local.status || "scheduled",
    });
    onChange?.(updated);
    onClose?.();
  };

  return (
    <RightDrawer open={open} onClose={onClose} title="Appointment">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Lead name</label>
          <input
            value={local.leadName ?? ""}
            onChange={(e) => setLocal({ ...local, leadName: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Date & time</label>
            <input
              type="datetime-local"
              value={safeISO(local.at)}
              onChange={(e) =>
                setLocal({ ...local, at: new Date(e.target.value).getTime() })
              }
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Duration (min)</label>
            <input
              type="number"
              min={5}
              step={5}
              value={local.durationMin ?? 30}
              onChange={(e) =>
                setLocal({ ...local, durationMin: e.target.value })
              }
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              value={local.type ?? "sales"}
              onChange={(e) => setLocal({ ...local, type: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="sales">Sales</option>
              <option value="service">Service</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={local.status ?? "scheduled"}
              onChange={(e) => setLocal({ ...local, status: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="scheduled">Scheduled</option>
              <option value="showed">Showed</option>
              <option value="no_show">No-show</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            rows={3}
            value={local.notes ?? ""}
            onChange={(e) => setLocal({ ...local, notes: e.target.value })}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95 text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </RightDrawer>
  );
}
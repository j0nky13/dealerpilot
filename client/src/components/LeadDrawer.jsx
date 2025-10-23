import { useEffect, useMemo, useState } from "react";
import RightDrawer from "./RightDrawer.jsx";
// ⬇️ swap local update for Firestore API
import { patchLead } from "../lib/leadsApi.js";
import {
  loadAppointments,
  addAppointment,
  updateAppointment,
} from "../lib/appointmentsStorage.js";
import { useAuth } from "../lib/authProvider.jsx";

// --- helpers: clean & format to (XXX)-XXX-XXXX ---
function onlyDigits(v = "") {
  return (v.match(/\d/g) || []).join("").slice(0, 10);
}
function formatUSPhone(v = "") {
  const d = onlyDigits(v);
  const len = d.length;
  if (len === 0) return "";
  if (len <= 3) return `(${d}`;
  if (len <= 6) return `(${d.slice(0, 3)})-${d.slice(3)}`;
  return `(${d.slice(0, 3)})-${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function LeadDrawer({ lead, open, onClose, onChange }) {
  const { user } = useAuth();
  const me = user?.uid ?? null;

  const [local, setLocal] = useState(null);

  // sync lead -> local state
  useEffect(() => {
    setLocal(lead ?? null);
  }, [lead]);

  // existing appointment for this lead (first match by leadId)
  const existingAppt = useMemo(() => {
    if (!lead) return null;
    const appts = loadAppointments();
    return appts.find((a) => a.leadId === lead.id) || null;
  }, [lead]);

  // appointment editor state
  const [apptEnabled, setApptEnabled] = useState(false);
  const [apptAt, setApptAt] = useState("");
  const [durationMin, setDurationMin] = useState(30);

  // init appt state when drawer opens or lead changes
  useEffect(() => {
    if (!open || !lead) return;
    if (existingAppt) {
      setApptEnabled(true);
      setApptAt(new Date(existingAppt.at).toISOString().slice(0, 16));
      setDurationMin(existingAppt.durationMin || 30);
    } else {
      setApptEnabled(false);
      setApptAt(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
      setDurationMin(30);
    }
  }, [open, lead, existingAppt]);

  if (!open || !lead || !local) return null;

  // phone: live format + paste clean
  const handlePhoneChange = (e) => {
    const next = formatUSPhone(e.target.value);
    setLocal((prev) => ({ ...prev, phone: next }));
  };
  const handlePhonePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const next = formatUSPhone(pasted);
    e.preventDefault();
    setLocal((prev) => ({ ...prev, phone: next }));
  };

  const saveLeadBasics = async () => {
    const patch = {
      name: local.name ?? "",
      phone: local.phone?.trim?.() || "",
      email: local.email ?? "",
      source: local.source ?? "",
      status: local.status ?? "working",
      // Use null (not undefined) so Firestore removes/clears properly
      nextAction: local.nextAction ?? null,
    };
    await patchLead(local.id, patch);
    const updated = { ...local, ...patch, lastActivityAt: Date.now() };
    onChange?.(updated);
    return updated;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 1) Save core lead fields (Firestore)
    const updatedLead = await saveLeadBasics();

    // 2) Appointment sync (still local for now)
    if (apptEnabled) {
      const atMs = new Date(apptAt).getTime();
      if (Number.isNaN(atMs)) {
        onClose?.();
        return;
      }
      if (existingAppt) {
        const updatedAppt = updateAppointment(existingAppt.id, {
          at: atMs,
          durationMin: Number(durationMin) || 30,
          notes: existingAppt.notes || "",
          status: existingAppt.status || "scheduled",
        });
        await patchLead(updatedLead.id, {
          status: "appt_set",
          nextAction: { type: "appt", dueAt: updatedAppt.at },
        });
        onChange?.({
          ...updatedLead,
          status: "appt_set",
          nextAction: { type: "appt", dueAt: updatedAppt.at },
          lastActivityAt: Date.now(),
        });
      } else {
        addAppointment({
          leadId: updatedLead.id,
          leadName: updatedLead.name || "Unnamed",
          type: "sales",
          at: atMs,
          durationMin: Number(durationMin) || 30,
          status: "scheduled",
          assignedTo: updatedLead.assignedTo || me,
          notes: "",
        });
        await patchLead(updatedLead.id, {
          status: "appt_set",
          nextAction: { type: "appt", dueAt: atMs },
        });
        onChange?.({
          ...updatedLead,
          status: "appt_set",
          nextAction: { type: "appt", dueAt: atMs },
          lastActivityAt: Date.now(),
        });
      }
    } else if (existingAppt) {
      // if toggled off, mark existing appt cancelled and revert lead status if needed
      updateAppointment(existingAppt.id, { status: "cancelled" });
      await patchLead(updatedLead.id, {
        status: updatedLead.status === "appt_set" ? "working" : updatedLead.status,
        nextAction: null,
      });
      onChange?.({
        ...updatedLead,
        status: updatedLead.status === "appt_set" ? "working" : updatedLead.status,
        nextAction: null,
        lastActivityAt: Date.now(),
      });
    }

    onClose?.(); // smooth close handled by RightDrawer exit animation
  };

  return (
    <RightDrawer open={open} onClose={onClose} title="Lead">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Lead basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              value={local.name ?? ""}
              onChange={(e) => setLocal({ ...local, name: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Source</label>
            <input
              value={local.source ?? ""}
              onChange={(e) => setLocal({ ...local, source: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              value={local.phone ?? ""}
              onChange={handlePhoneChange}
              onPaste={handlePhonePaste}
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555)-123-4567"
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              maxLength={14}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={local.email ?? ""}
              onChange={(e) => setLocal({ ...local, email: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={local.status ?? "working"}
              onChange={(e) => setLocal({ ...local, status: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="new">New</option>
              <option value="working">Working</option>
              <option value="appt_set">Appt Set</option>
              <option value="showed">Showed</option>
              <option value="sold">Sold</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Next action (optional)</label>
            <input
              value={local.nextAction?.type ?? ""}
              onChange={(e) =>
                setLocal({
                  ...local,
                  nextAction: {
                    ...(local.nextAction || {}),
                    type: e.target.value || undefined,
                  },
                })
              }
              placeholder="call / sms / email / appt"
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Appointment editor */}
        <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={apptEnabled}
                onChange={(e) => setApptEnabled(e.target.checked)}
              />
              <span className="text-sm">Appointment</span>
            </label>
            {existingAppt && (
              <span className="text-xs text-[#9FB0C6]">
                Existing appt at {new Date(existingAppt.at).toLocaleString()}
              </span>
            )}
          </div>

          {apptEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <div className="text-xs text-[#9FB0C6] mb-1">Date & time</div>
                <input
                  type="datetime-local"
                  value={apptAt}
                  onChange={(e) => setApptAt(e.target.value)}
                  className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <div className="text-xs text-[#9FB0C6] mb-1">Duration (min)</div>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            </div>
          )}
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
import { useState } from "react";
import Modal from "./Modal.jsx";
import { addLead } from "../lib/leadsStorage.js";
import { addAppointment } from "../lib/appointmentsStorage.js";
import { getCurrentUserId } from "../lib/roles.js";

// --- helpers: clean & format to (XXX)-XXX-XXXX ---
function onlyDigits(v = "") {
  return (v.match(/\d/g) || []).join("").slice(0, 10); // cap at 10 digits
}
function formatUSPhone(digits) {
  const d = onlyDigits(digits);
  const len = d.length;
  if (len === 0) return "";
  if (len <= 3) return `(${d}`;
  if (len <= 6) return `(${d.slice(0, 3)})-${d.slice(3)}`;
  return `(${d.slice(0, 3)})-${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function QuickAddLeadModal({ open, onClose, onCreated }) {
  const me = getCurrentUserId();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    note: "",
  });
  const [scheduleNow, setScheduleNow] = useState(false);
  const [apptAt, setApptAt] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [durationMin, setDurationMin] = useState(30);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhoneChange = (e) => {
    const next = formatUSPhone(e.target.value);
    setForm((f) => ({ ...f, phone: next }));
  };
  const handlePhonePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const next = formatUSPhone(pasted);
    e.preventDefault();
    setForm((f) => ({ ...f, phone: next }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const hasAnyContact =
      form.name.trim() || form.email.trim() || form.phone.trim();
    if (!hasAnyContact) return;

    setSaving(true);

    // 1) Create the lead
    const id = addLead({
      name: form.name.trim() || "Unnamed",
      phone: form.phone.trim() || undefined, // stored formatted; swap to onlyDigits(form.phone) if you want raw
      email: form.email.trim() || undefined,
      source: form.source.trim() || "Manual",
      status: scheduleNow ? "appt_set" : "new",
      assignedTo: me,
      nextAction: scheduleNow
        ? { type: "appt", dueAt: new Date(apptAt).getTime() }
        : { type: "call", dueAt: Date.now() + 2 * 60 * 60 * 1000 },
      note: form.note.trim() || undefined,
    });

    // 2) Optional appointment
    if (scheduleNow) {
      addAppointment({
        leadId: id,
        leadName: form.name.trim() || "Unnamed",
        type: "sales",
        at: new Date(apptAt).getTime(),
        durationMin: Number(durationMin) || 30,
        status: "scheduled",
        assignedTo: me,
        notes: form.note?.trim() || "",
      });
    }

    setSaving(false);
    onCreated?.(id);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Quick add lead">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-[#9FB0C6] mb-1">Name</div>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Full name"
              autoFocus
            />
          </label>

          <label className="block">
            <div className="text-xs text-[#9FB0C6] mb-1">Source</div>
            <input
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Website / TradePending / Walk-in"
            />
          </label>

          <label className="block">
            <div className="text-xs text-[#9FB0C6] mb-1">Phone</div>
            <input
              value={form.phone}
              onChange={handlePhoneChange}
              onPaste={handlePhonePaste}
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555)-123-4567"
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              maxLength={14} // (XXX)-XXX-XXXX
            />
          </label>

          <label className="block">
            <div className="text-xs text-[#9FB0C6] mb-1">Email</div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="customer@example.com"
              autoComplete="email"
            />
          </label>
        </div>

        <label className="block">
          <div className="text-xs text-[#9FB0C6] mb-1">Note</div>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Context for the first touch (optional)"
          />
        </label>

        {/* Appointment toggle + inputs */}
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 space-y-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={scheduleNow}
              onChange={(e) => setScheduleNow(e.target.checked)}
            />
            <span className="text-sm">Schedule appointment now</span>
          </label>

          {scheduleNow && (
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

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95 text-sm disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
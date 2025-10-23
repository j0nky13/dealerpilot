import { useState } from "react";
import Modal from "./Modal.jsx";
import { createLead } from "../lib/leadsApi.js";
import { addAppointment } from "../lib/appointmentsStorage.js";
import { useAuth } from "../lib/authProvider.jsx";

// helpers: format UI, keep raw for DB
function onlyDigits(v = "") {
  return (v.match(/\d/g) || []).join("").slice(0, 10);
}
function formatUSPhone(digits = "") {
  const d = onlyDigits(digits);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0,3)})-${d.slice(3)}`;
  return `(${d.slice(0,3)})-${d.slice(3,6)}-${d.slice(6)}`;
}

export default function QuickAddLeadModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    note: "",
  });
  const [scheduleNow, setScheduleNow] = useState(false);
  const [apptAt, setApptAt] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [durationMin, setDurationMin] = useState(30);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhoneChange = (e) => setForm((f) => ({ ...f, phone: formatUSPhone(e.target.value) }));
  const handlePhonePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    e.preventDefault();
    setForm((f) => ({ ...f, phone: formatUSPhone(pasted) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // Require at least one identifier
    const hasAnyContact = form.name.trim() || form.email.trim() || form.phone.trim();
    if (!hasAnyContact) {
      setErr("Enter a name, email, or phone.");
      return;
    }

    // Optional: prevent creating invisible leads when signed out
    // If you prefer to allow, we’ll mark as unassigned.
    const assignedTo = uid || null;
    const status = scheduleNow ? "appt_set" : (assignedTo ? "new" : "unassigned");

    setSaving(true);
    try {
      const phoneDigits = onlyDigits(form.phone);
      const emailNorm = form.email.trim().toLowerCase();

      // 1) Create the lead in Firestore (raw digits for search; UI keeps formatted)
      const id = await createLead({
        name: form.name.trim() || "Unnamed",
        phone: phoneDigits || undefined,
        email: emailNorm || undefined,
        source: form.source.trim() || "Manual",
        status,
        assignedTo,                 // null if no session; managers can claim
        nextAction: scheduleNow
          ? { type: "appt", dueAt: new Date(apptAt).getTime() }
          : { type: "call", dueAt: Date.now() + 2 * 60 * 60 * 1000 },
        note: form.note.trim() || undefined,
        createdBy: uid || null,
      });

      // 2) Optional appointment (still local for now; later we’ll move to Firestore)
      if (scheduleNow) {
        const atMs = new Date(apptAt).getTime();
        if (!Number.isNaN(atMs)) {
          addAppointment({
            leadId: id,
            leadName: form.name.trim() || "Unnamed",
            type: "sales",
            at: atMs,
            durationMin: Number(durationMin) || 30,
            status: "scheduled",
            assignedTo: assignedTo,
            notes: form.note?.trim() || "",
            createdBy: uid || null,
            createdAt: Date.now(),
          });
        }
      }

      // Optional: notify legacy listeners
      window.dispatchEvent(new CustomEvent("lead:created", { detail: { id } }));

      // Reset form for quick successive entries
      setForm({ name: "", phone: "", email: "", source: "", note: "" });
      setScheduleNow(false);
      setApptAt(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
      setDurationMin(30);

      onCreated?.(id);
      onClose?.();
    } catch (ex) {
      console.error(ex);
      setErr(ex.message || "Failed to save lead");
    } finally {
      setSaving(false);
    }
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
              maxLength={14} // UI format length
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

        {err && <p className="text-sm text-red-400">{err}</p>}

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
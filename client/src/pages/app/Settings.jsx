// src/pages/app/Settings.jsx
import { useEffect, useState } from "react";
import {
  Building2,
  RotateCcw,
  Bell,
  Calendar,
  Link2,
  Shield,
  Paintbrush,
  Users,
  Sun,
  Moon,
  Settings2,
  ListChecks, // valid icon for Pipeline/SLA
} from "lucide-react";

import HoursEditor from "../../components/HoursEditor.jsx";
import {
  loadOrgSettings,
  saveOrgSettings,
  loadUserPrefs,
  saveUserPrefs,
  formatPhone,
} from "../../lib/settingsStorage.js";
import { loadPools, resetNextIndex } from "../../lib/roundRobinStorage.js";

export default function Settings() {
  // org-wide + per-user settings
  const [org, setOrg] = useState(loadOrgSettings());
  const [prefs, setPrefs] = useState(loadUserPrefs());

  // round robin pools (local storage demo)
  const [pools, setPools] = useState(loadPools());

  // persist on change (local for now; Firestore later)
  useEffect(() => saveOrgSettings(org), [org]);
  useEffect(() => saveUserPrefs(prefs), [prefs]);

  const onResetPool = (id) => {
    if (!confirm("Reset rotation pointer for this pool?")) return;
    resetNextIndex(id);
    setPools(loadPools());
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Settings2 className="h-6 w-6 text-[#5BE6CE]" />
        Settings
      </h1>

      {/* Business Info */}
      <Section title="Business Info" icon={Building2}>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Dealership name">
            <input
              value={org.orgName}
              onChange={(e) => setOrg({ ...org, orgName: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone">
            <input
              value={org.phone}
              onChange={(e) => setOrg({ ...org, phone: formatPhone(e.target.value) })}
              placeholder="(555)-123-4567"
              maxLength={14}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Time zone">
            <input
              value={org.timezone}
              onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </Section>

      {/* Branding & Preferences */}
      <Section title="Branding & Preferences" icon={Paintbrush}>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Primary color">
            <input
              type="color"
              value={org.brand?.primary || "#5BE6CE"}
              onChange={(e) =>
                setOrg({
                  ...org,
                  brand: { ...(org.brand || {}), primary: e.target.value },
                })
              }
              className="h-9 w-14 bg-white/5 ring-1 ring-white/10 rounded-lg p-1"
            />
          </Field>
          <Field label="Logo URL">
            <input
              value={org.brand?.logoUrl || ""}
              onChange={(e) =>
                setOrg({
                  ...org,
                  brand: { ...(org.brand || {}), logoUrl: e.target.value },
                })
              }
              placeholder="https://…"
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Theme (my preference)">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, theme: "dark" })}
                className={`px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 flex items-center gap-2 ${
                  prefs.theme === "dark" ? "ring-1 ring-[#5BE6CE]" : ""
                }`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, theme: "light" })}
                className={`px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 flex items-center gap-2 ${
                  prefs.theme === "light" ? "ring-1 ring-[#5BE6CE]" : ""
                }`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
            </div>
          </Field>
        </div>
      </Section>

      {/* Business Hours */}
      <Section title="Business Hours" icon={Calendar}>
        <HoursEditor
          value={org.hours}
          onChange={(v) => setOrg({ ...org, hours: v })}
        />
      </Section>

      {/* Round Robin */}
      <Section title="Round Robin Settings" icon={RotateCcw}>
        <div className="mb-3">
          <Toggle
            label="Auto-assign new leads"
            value={!!org.roundRobin?.autoAssign}
            onChange={(v) =>
              setOrg({
                ...org,
                roundRobin: { ...(org.roundRobin || {}), autoAssign: v },
              })
            }
          />
        </div>

        <div className="space-y-2">
          {pools.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-white/5 ring-1 ring-white/10 rounded-lg p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-[#9FB0C6]">
                  next index: {p.nextIndex ?? 0}
                </span>
              </div>
              <button
                onClick={() => onResetPool(p.id)}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15"
              >
                Reset Rotation
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Lead Pipeline & SLA */}
      <Section title="Lead Pipeline & SLA" icon={ListChecks}>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Statuses (comma separated)">
            <input
              value={(org.pipeline?.statuses || []).join(",")}
              onChange={(e) =>
                setOrg({
                  ...org,
                  pipeline: {
                    ...(org.pipeline || {}),
                    statuses: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Time to first contact (min)">
            <input
              type="number"
              min={1}
              value={org.pipeline?.sla?.firstTouchMin ?? 15}
              onChange={(e) =>
                setOrg({
                  ...org,
                  pipeline: {
                    ...(org.pipeline || {}),
                    sla: {
                      ...(org.pipeline?.sla || {}),
                      firstTouchMin: Number(e.target.value) || 15,
                    },
                  },
                })
              }
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Overdue after (hours)">
            <input
              type="number"
              min={1}
              value={org.pipeline?.sla?.overdueHours ?? 24}
              onChange={(e) =>
                setOrg({
                  ...org,
                  pipeline: {
                    ...(org.pipeline || {}),
                    sla: {
                      ...(org.pipeline?.sla || {}),
                      overdueHours: Number(e.target.value) || 24,
                    },
                  },
                })
              }
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </Section>

      {/* Lead Sources */}
      <Section title="Lead Sources" icon={Link2}>
        <TagEditor
          values={org.leadSources || []}
          onChange={(vals) => setOrg({ ...org, leadSources: vals })}
        />
      </Section>

      {/* Notifications (org toggles) */}
      <Section title="Notifications" icon={Bell}>
        <div className="grid md:grid-cols-3 gap-3">
          <Toggle
            label="SLA breach alerts"
            value={!!org.notifications?.slaBreach}
            onChange={(v) =>
              setOrg({
                ...org,
                notifications: { ...(org.notifications || {}), slaBreach: v },
              })
            }
          />
          <Toggle
            label="Appointment reminders"
            value={!!org.notifications?.apptReminders}
            onChange={(v) =>
              setOrg({
                ...org,
                notifications: {
                  ...(org.notifications || {}),
                  apptReminders: v,
                },
              })
            }
          />
        </div>
      </Section>

      {/* My Preferences (per-user) */}
      <Section title="My Preferences" icon={Users}>
        <div className="grid md:grid-cols-3 gap-3">
          <Toggle
            label="Compact mode"
            value={!!prefs.compact}
            onChange={(v) => setPrefs({ ...prefs, compact: v })}
          />
          <Field label="Default route">
            <input
              value={prefs.defaultRoute || "/app/today"}
              onChange={(e) =>
                setPrefs({ ...prefs, defaultRoute: e.target.value })
              }
              placeholder="/app/today"
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Email signature">
            <textarea
              rows={3}
              value={prefs.signature || ""}
              onChange={(e) => setPrefs({ ...prefs, signature: e.target.value })}
              className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Best,\nJordan"
            />
          </Field>
        </div>
      </Section>

      {/* Security (placeholder) */}
      <Section title="Security & Access" icon={Shield}>
        <p className="text-sm text-[#9FB0C6]">
          Coming soon: 2FA, API keys, SSO domains, session limits.
        </p>
      </Section>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-6 space-y-4">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#5BE6CE]" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-[#9FB0C6] mb-1">{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}

function TagEditor({ values, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || values.includes(v)) return;
    onChange([...(values || []), v]);
    setInput("");
  };
  const remove = (v) => onChange((values || []).filter((x) => x !== v));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {(values || []).map((v) => (
          <span
            key={v}
            className="text-xs bg-white/10 rounded-full px-2 py-1 flex items-center gap-2"
          >
            {v}
            <button
              className="opacity-70 hover:opacity-100"
              onClick={() => remove(v)}
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add source (Enter to add)"
          className="flex-1 bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={add}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}
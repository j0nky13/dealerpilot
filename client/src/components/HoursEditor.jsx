// src/components/HoursEditor.jsx
export default function HoursEditor({ value, onChange }) {
  const days = [
    ["mon", "Mon"],
    ["tue", "Tue"],
    ["wed", "Wed"],
    ["thu", "Thu"],
    ["fri", "Fri"],
    ["sat", "Sat"],
    ["sun", "Sun"],
  ];

  const update = (k, patch) =>
    onChange?.({ ...value, [k]: { ...(value[k] || {}), ...patch } });

  return (
    <div className="space-y-2">
      {days.map(([key, label]) => {
        const d = value[key] || { open: false, start: "09:00", end: "17:00" };
        return (
          <div
            key={key}
            className="flex items-center justify-between gap-3 bg-white/5 ring-1 ring-white/10 rounded-lg p-3"
          >
            <div className="w-14 text-sm">{label}</div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={d.open}
                onChange={(e) => update(key, { open: e.target.checked })}
              />
              <span>Open</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={d.start}
                onChange={(e) => update(key, { start: e.target.value })}
                disabled={!d.open}
                className="bg-white/5 ring-1 ring-white/10 rounded-lg px-2 py-1 text-sm"
              />
              <span className="text-[#9FB0C6]">to</span>
              <input
                type="time"
                value={d.end}
                onChange={(e) => update(key, { end: e.target.value })}
                disabled={!d.open}
                className="bg-white/5 ring-1 ring-white/10 rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
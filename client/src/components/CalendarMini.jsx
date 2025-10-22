/**
 * Minimal month picker with day selection.
 * Props:
 *  - value: Date (selected day)
 *  - onChange: (Date) => void
 */
export default function CalendarMini({ value, onChange }) {
  const monthStart = new Date(value.getFullYear(), value.getMonth(), 1);
  const month = monthStart.getMonth();
  const start = new Date(monthStart);
  start.setDate(1 - ((monthStart.getDay() + 6) % 7)); // week starts Monday

  const days = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const prevMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() - 1, Math.min(value.getDate(), 28)));
  const nextMonth = () => onChange(new Date(value.getFullYear(), value.getMonth() + 1, Math.min(value.getDate(), 28)));

  return (
    <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <button className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10 hover:bg-white/8" onClick={prevMonth}>
          ←
        </button>
        <div className="text-sm font-semibold">
          {value.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10 hover:bg-white/8" onClick={nextMonth}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-[#9FB0C6] mb-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="text-center">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === month;
          const selected = isSameDay(d, value);
          return (
            <button
              key={i}
              onClick={() => onChange(d)}
              className={`h-8 rounded-lg ring-1 text-sm
                ${selected ? "bg-white/15 ring-white/30 text-white" : "bg-white/5 ring-white/10 hover:bg-white/8"}
                ${inMonth ? "" : "opacity-50"}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import Panel from "../../components/Panel.jsx";
import StatCard from "../../components/StatCard.jsx";
import { Users, PhoneCall, CalendarCheck2, Handshake, TimerReset, Activity } from "lucide-react";
import { computeReports } from "../../lib/reportsLogic.js";

export default function Reports() {
  const [range, setRange] = useState("7d");
  const [stats, setStats] = useState(() => computeReports(range));

  useEffect(() => {
    setStats(computeReports(range));
  }, [range]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="qtd">Quarter to date</option>
          </select>
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Export CSV</button>
        </div>
      </div>

      {/* KPI row (now dynamic) */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="New Leads" value={stats.newLeads} />
        <StatCard icon={PhoneCall} label="First Touch ≤ 15m" value={`${stats.firstTouchPct}%`} />
        <StatCard icon={CalendarCheck2} label="Appointments Set" value={stats.apptSet} />
        <StatCard icon={Handshake} label="Sold" value={stats.sold} />
        <StatCard icon={TimerReset} label="Avg. First Touch" value={`${stats.avgFirstTouchMin}m`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Funnel snapshot */}
        <Panel title="Funnel" className="lg:col-span-2">
          <div className="grid grid-cols-5 gap-3 items-end h-56">
            {["new","working","appt_set","showed","sold"].map((key, i) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-white/10 to-white/20"
                  style={{ height: `${Math.min(95, 15 + (stats.funnel[key] || 0) * 6)}%` }}
                  title={`${key}: ${stats.funnel[key] || 0}`}
                />
                <div className="text-[11px] text-[#9FB0C6]">{key.replace("_", " ")}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* SLA trend placeholder */}
        <Panel title="SLA (Time to First Touch)">
          <div className="h-56 relative">
            <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(255,255,255,.06),transparent)]" />
            <div className="absolute inset-4 grid place-items-center text-sm text-[#9FB0C6]">
              Trend chart placeholder — will use real times when activities are wired.
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Heatmap */}
        <Panel title="Activity Volume (Calls/SMS/Emails)">
          <div className="grid grid-cols-7 gap-1">
            {stats.heat.map((v, i) => (
              <div
                key={i}
                className="h-8 rounded bg-white/10"
                style={{ opacity: 0.25 + Math.min(0.6, v * 0.08) }}
                title={`Count: ${v}`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#9FB0C6]">
            <Activity className="h-3.5 w-3.5" />
            <span>Higher opacity indicates more activity.</span>
          </div>
        </Panel>

        {/* Top performers placeholder */}
        <Panel title="Top Performers" className="lg:col-span-2">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-6 text-sm text-[#9FB0C6]">
            This will rank reps by set appts / show rate / sold once we wire user activity.
          </div>
        </Panel>
      </div>
    </div>
  );
}
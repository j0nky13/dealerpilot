// src/pages/app/MyStats.jsx
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ---------- MOCK DATA (replace with Firestore later) ----------
const mockLeads = [
  { day: "Mon", leads: 6, sold: 1, response: 8 },
  { day: "Tue", leads: 8, sold: 2, response: 11 },
  { day: "Wed", leads: 4, sold: 0, response: 6 },
  { day: "Thu", leads: 9, sold: 3, response: 12 },
  { day: "Fri", leads: 5, sold: 1, response: 9 },
  { day: "Sat", leads: 7, sold: 2, response: 10 },
  { day: "Sun", leads: 2, sold: 0, response: 7 },
];

// ---------- PAGE ----------
export default function MyStats() {
  const [tab, setTab] = useState("overview"); // 'overview' | 'commissions'

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Stats</h1>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabButton>
        <TabButton active={tab === "commissions"} onClick={() => setTab("commissions")}>
          Commissions
        </TabButton>
      </div>

      {tab === "overview" ? <OverviewSection /> : <CommissionSection />}
    </div>
  );
}

// ---------- OVERVIEW ----------
function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card label="Total Leads" value="41" />
        <Card label="Appointments Set" value="10" />
        <Card label="Appointments Showed" value="7" />
        <Card label="Vehicles Sold" value="4" />
        <Card label="Response Time" value="12m avg" />
        <Card label="Conversion Rate" value="9.7%" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads vs Sold */}
        <Panel title="Leads & Sales This Week">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockLeads}>
              <XAxis dataKey="day" stroke="#9FB0C6" />
              <YAxis stroke="#9FB0C6" />
              <Tooltip
                contentStyle={{
                  background: "#0D131B",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="leads" fill="#5BE6CE" radius={[6, 6, 0, 0]} />
              <Bar dataKey="sold" fill="#ffffff33" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Response time */}
        <Panel title="Avg. Response Time (Minutes)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="day" stroke="#9FB0C6" />
              <YAxis stroke="#9FB0C6" />
              <Tooltip
                contentStyle={{
                  background: "#0D131B",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="response" stroke="#5BE6CE" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Recent Activity Table */}
      <Panel title="Recent Leads">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#9FB0C6] border-b border-white/10">
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Source</th>
              <th className="py-2">Follow Up</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "John Miller", status: "Working", src: "Website", followUp: "Tomorrow" },
              { name: "Sarah King", status: "Sold", src: "Walk-in", followUp: "Done" },
              { name: "James Carter", status: "New", src: "TradePending", followUp: "Today" },
              { name: "Emily Ross", status: "Appointment Set", src: "Phone", followUp: "2 Days" },
            ].map((lead, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2">{lead.name}</td>
                <td className="py-2 text-[#5BE6CE]">{lead.status}</td>
                <td className="py-2">{lead.src}</td>
                <td className="py-2">{lead.followUp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

// ---------- COMMISSIONS ----------
function CommissionSection() {
  const [units, setUnits] = useState(4);
  const [frontGross, setFrontGross] = useState(3500); // total front gross for the period
  const [backGross, setBackGross] = useState(1800);   // finance/ products gross total
  const [perUnitFlat, setPerUnitFlat] = useState(150); // spiff/flat per unit
  const [frontPct, setFrontPct] = useState(0.25);     // 25% of front
  const [backPct, setBackPct] = useState(0.10);       // 10% of back-end
  const [draw, setDraw] = useState(0);                // optional draw to subtract
  const [bonus, setBonus] = useState(0);              // manual bonuses

  const results = useMemo(() => {
    const safeUnits = Math.max(0, Number(units) || 0);
    const fg = Math.max(0, Number(frontGross) || 0);
    const bg = Math.max(0, Number(backGross) || 0);
    const flat = Math.max(0, Number(perUnitFlat) || 0);
    const fp = Math.max(0, Number(frontPct) || 0);
    const bp = Math.max(0, Number(backPct) || 0);
    const dr = Math.max(0, Number(draw) || 0);
    const bn = Math.max(0, Number(bonus) || 0);

    const frontComm = fg * fp;
    const backComm = bg * bp;
    const flatComm = safeUnits * flat;
    const grossComm = frontComm + backComm + flatComm;
    const total = Math.max(0, grossComm + bn - dr);

    return { frontComm, backComm, flatComm, grossComm, total };
  }, [units, frontGross, backGross, perUnitFlat, frontPct, backPct, draw, bonus]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Panel title="Commission Inputs">
        <div className="grid md:grid-cols-3 gap-3">
          <Field label="Units Sold">
            <NumberInput value={units} onChange={setUnits} min={0} />
          </Field>
          <Field label="Front Gross (total)">
            <CurrencyInput value={frontGross} onChange={setFrontGross} />
          </Field>
          <Field label="Back-End Gross (total)">
            <CurrencyInput value={backGross} onChange={setBackGross} />
          </Field>
          <Field label="Per-Unit Flat / Spiff">
            <CurrencyInput value={perUnitFlat} onChange={setPerUnitFlat} />
          </Field>
          <Field label="Front % (e.g., 0.25 = 25%)">
            <PercentInput value={frontPct} onChange={setFrontPct} />
          </Field>
          <Field label="Back-End % (e.g., 0.10 = 10%)">
            <PercentInput value={backPct} onChange={setBackPct} />
          </Field>
          <Field label="Bonus (manual)">
            <CurrencyInput value={bonus} onChange={setBonus} />
          </Field>
          <Field label="Draw (to subtract)">
            <CurrencyInput value={draw} onChange={setDraw} />
          </Field>
        </div>
      </Panel>

      {/* Results */}
      <Panel title="Commission Summary">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Front Commission" value={fmt(results.frontComm)} />
          <Stat label="Back-End Commission" value={fmt(results.backComm)} />
          <Stat label="Flat / Spiffs" value={fmt(results.flatComm)} />
          <Stat label="Gross Commission" value={fmt(results.grossComm)} />
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-xs text-[#9FB0C6]">Bonus</div>
            <div className="text-xl font-semibold">{fmt(Number(bonus) || 0)}</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="text-xs text-[#9FB0C6]">Draw</div>
            <div className="text-xl font-semibold">-{fmt(Number(draw) || 0)}</div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#9FB0C6]">Estimated Commission</div>
            <div className="text-3xl font-semibold">{fmt(results.total)}</div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95"
          >
            Print
          </button>
        </div>
      </Panel>
    </div>
  );
}

// ---------- UI HELPERS ----------
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active ? "bg-white/10 text-white" : "text-[#9FB0C6] hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-[#0D131B] rounded-2xl ring-1 ring-white/10 p-6">
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      {children}
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-[#0D131B] ring-1 ring-white/10 rounded-xl p-4">
      <div className="text-xs text-[#9FB0C6]">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
      <div className="text-xs text-[#9FB0C6]">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
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

function NumberInput({ value, onChange, min = 0 }) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
    />
  );
}

function CurrencyInput({ value, onChange }) {
  return (
    <input
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
      placeholder="0.00"
    />
  );
}

function PercentInput({ value, onChange }) {
  return (
    <input
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm"
      placeholder="0.25"
    />
  );
}

const fmt = (n) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, delta, up = true }) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center gap-3">
      <div className="grid place-items-center h-9 w-9 rounded-lg bg-[#5BE6CE]/10">
        <Icon className="h-4 w-4 text-[#5BE6CE]" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-[#9FB0C6]">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold">{value}</div>
          {typeof delta === "number" && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full ring-1
                ${up
                  ? "text-emerald-200 bg-emerald-500/10 ring-emerald-400/25"
                  : "text-rose-200 bg-rose-500/10 ring-rose-400/25"}`}
            >
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
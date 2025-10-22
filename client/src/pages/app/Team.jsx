import { useState } from "react";
import Panel from "../../components/Panel.jsx";
import TeamMemberDrawer from "../../components/TeamMemberDrawer.jsx";

const dummyTeam = [
  { id: "u4", name: "Jimmy W.", role: "Sales", open: 15, overdue: 3, newToday: 4, lastActivityMins: 12, apptThisWeek: 5 },
  { id: "u6", name: "Tony W.", role: "Sales", open: 11, overdue: 1, newToday: 2, lastActivityMins: 5, apptThisWeek: 3 },
  { id: "u1", name: "Morgan H.", role: "BDC", open: 22, overdue: 6, newToday: 8, lastActivityMins: 28, apptThisWeek: 7 },
  { id: "u2", name: "Kyle R.", role: "BDC", open: 17, overdue: 2, newToday: 5, lastActivityMins: 9, apptThisWeek: 4 },
];

export default function Team() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const handleView = (rep) => {
    setSelected(rep);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Team</h1>
        <div className="flex items-center gap-2">
          <select className="bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-sm">
            <option>All</option>
            <option>Sales</option>
            <option>BDC</option>
          </select>
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Export CSV</button>
        </div>
      </div>

      <Panel title="Team Health">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#9FB0C6]">
                <th className="py-2 pr-4">Rep</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Open Leads</th>
                <th className="py-2 pr-4">Overdue Actions</th>
                <th className="py-2 pr-4">New Today</th>
                <th className="py-2 pr-4">Last Activity</th>
                <th className="py-2 pr-4">Appts (Wk)</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyTeam.map((r, idx) => (
                <tr key={r.id} className={`border-t border-white/10 ${idx % 2 ? "bg-white/[0.03]" : ""}`}>
                  <td className="py-3 pr-4 font-medium">{r.name}</td>
                  <td className="py-3 pr-4">{r.role}</td>
                  <td className="py-3 pr-4">{r.open}</td>
                  <td className="py-3 pr-4">{r.overdue}</td>
                  <td className="py-3 pr-4">{r.newToday}</td>
                  <td className="py-3 pr-4">{r.lastActivityMins}m ago</td>
                  <td className="py-3 pr-4">{r.apptThisWeek}</td>
                  <td className="py-3 pr-0 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                      onClick={() => handleView(r)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Notes" className="bg-[#111821]/70">
        <p className="text-sm text-[#9FB0C6]">
          Clicking “View” opens the right drawer with rep metrics and quick actions.
        </p>
      </Panel>

      {/* Drawer instance */}
      <TeamMemberDrawer open={open} onClose={() => setOpen(false)} member={selected} />
    </div>
  );
}
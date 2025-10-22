// src/components/TeamMemberDrawer.jsx
import RightDrawer from "./RightDrawer.jsx";

export default function TeamMemberDrawer({ open, onClose, member }) {
  if (!member) return null;
  return (
    <RightDrawer open={open} onClose={onClose} title={member.name}>
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <Info label="Role" value={member.role} />
          <Info label="Open Leads" value={member.open} />
          <Info label="Overdue" value={member.overdue} />
          <Info label="New Today" value={member.newToday} />
          <Info label="Appts (Week)" value={member.apptThisWeek} />
          <Info label="Last Activity" value={`${member.lastActivityMins}m ago`} />
        </div>

        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
          <h3 className="font-medium mb-2">Recent Activity</h3>
          <ul className="space-y-1 text-[#9FB0C6]">
            <li>Called Jordan A. • left VM</li>
            <li>Texted Maya C. • waiting reply</li>
            <li>Set appt with Sarah M. • Fri 2:30 PM</li>
          </ul>
        </div>

        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">View Queue</button>
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">Message</button>
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">Open full profile</button>
          </div>
        </div>
      </div>
    </RightDrawer>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wide text-[#9FB0C6]">{label}</div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
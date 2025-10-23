import { useMemo, useState } from "react";
import CalendarMini from "../../components/CalendarMini.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import AppointmentDrawer from "../../components/AppointmentDrawer.jsx";
import {
  loadAppointments,
  saveAppointments,
  updateAppointment,
} from "../../lib/appointmentsStorage.js";
import { useAuth } from "../../lib/authProvider.jsx";

function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0); }

export default function Appointments() {
  const { user, role } = useAuth();
  const me = user?.uid || "u1";
  const canSeeAll = role === "manager" || role === "bdc" || role === "admin";

  const [selectedDay, setSelectedDay] = useState(new Date());
  const [list, setList] = useState(loadAppointments());
  const [drawerAppt, setDrawerAppt] = useState(null);
  const [showAll, setShowAll] = useState(true);

  const dayStart = startOfDay(selectedDay).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const todays = useMemo(() => {
    return list
      .filter((a) => a.at >= dayStart && a.at < dayEnd)
      .filter((a) => (canSeeAll && showAll ? true : a.assignedTo === me))
      .sort((a, b) => a.at - b.at);
  }, [list, dayStart, dayEnd, canSeeAll, showAll, me]);

  const openAppt = (a) => setDrawerAppt(a);
  const closeDrawer = () => setDrawerAppt(null);

  const setStatus = (a, status) => {
    const updated = updateAppointment(a.id, { status });
    setList(prev => {
      const next = prev.map((x) => (x.id === a.id ? updated : x));
      saveAppointments(next);
      return next;
    });
  };

  const reschedule = (a, minutes = 60) => {
    const updated = updateAppointment(a.id, { at: a.at + minutes * 60000 });
    setList(prev => {
      const next = prev.map((x) => (x.id === a.id ? updated : x));
      saveAppointments(next);
      return next;
    });
  };

  const onDrawerChange = (updated) => {
    setList((prev) => {
      const next = prev.map((x) => (x.id === updated.id ? updated : x));
      saveAppointments(next);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <div className="flex items-center gap-2">
          {canSeeAll && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
            >
              {showAll ? "All" : "Mine"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: month picker */}
        <div className="lg:col-span-1">
          <CalendarMini value={selectedDay} onChange={setSelectedDay} />
          <div className="mt-3 rounded-2xl bg-[#111821]/70 ring-1 ring-white/10 p-4">
            <div className="text-sm text-[#9FB0C6]">
              Selected day:{" "}
              <span className="text-[#E6F1FF] font-medium">
                {selectedDay.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: agenda list */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-[#0D131B] ring-1 ring-white/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Day agenda</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                  onClick={() => setSelectedDay(new Date())}
                >
                  Today
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                  onClick={() => setList(loadAppointments())}
                >
                  Reload demo
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {todays.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appt={a}
                  onOpen={() => openAppt(a)}
                  onMarkShowed={() => setStatus(a, "showed")}
                  onNoShow={() => setStatus(a, "no_show")}
                  onReschedule={() => reschedule(a, 60)}
                />
              ))}

              {todays.length === 0 && (
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-sm text-[#9FB0C6]">
                  No appointments scheduled for this day.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <AppointmentDrawer
        appt={drawerAppt}
        open={!!drawerAppt}
        onClose={closeDrawer}
        onChange={onDrawerChange}
      />
    </div>
  );
}
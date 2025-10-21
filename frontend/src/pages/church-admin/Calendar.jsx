import { useMemo, useState } from "react";
import dayjs from "dayjs";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";
import { EVENTS } from "../../components/church-admin/events";

const badge =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";

function EventPill({ title, muted }) {
  return (
    <span
      className={
        muted
          ? "bg-slate-100 text-slate-500 rounded px-2 py-0.5 text-[12px]"
          : "bg-orange-100 text-orange-700 rounded px-2 py-0.5 text-[12px]"
      }
    >
      {title.length > 18 ? `${title.slice(0, 18)}…` : title}
    </span>
  );
}
const Icon = ({ file, className = "h-4 w-4 opacity-70", alt = "" }) => (
  <img
    src={`/src/assets/icons/${file}.svg`}
    alt={alt || file}
    className={className}
    draggable="false"
  />
);
export default function ParishCalendar() {
  const [selected, setSelected] = useState(
    EVENTS.find((e) => e.date === "2024-07-07") || null
  );


  const viewMonth = useMemo(() => dayjs("2024-07-01"), []);
  const startOfMonth = viewMonth.startOf("month");
  const endOfMonth = viewMonth.endOf("month");


  const startGrid = startOfMonth.startOf("week");
  const days = Array.from({ length: 42 }).map((_, i) =>
    startGrid.add(i, "day")
  );

  const byDate = useMemo(() => {
    const map = new Map();
    for (const e of EVENTS) map.set(e.date, (map.get(e.date) || []).concat(e));
    return map;
  }, []);

  return (
   <div className="min-h-screen bg-[#FBF7F3]">
  <AdminSidebar />


  <AdminHeader className="pl-[232px]" />


  <div className="pl-[232px] pt-[64px] min-h-screen">

        <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6">
  
          <section className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
     
            <div className="flex items-center justify-between px-6 h-14 border-b border-slate-200">
              <button className="p-2 rounded-lg hover:bg-slate-100">
       
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-slate-800">July 2024</h2>
              <button className="p-2 rounded-lg hover:bg-slate-100">
              
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
                </svg>
              </button>
            </div>

        
            <div className="grid grid-cols-7 text-center text-slate-500 text-[13px] py-3">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

        
            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-slate-200">
              {days.map((d, i) => {
                const inMonth = d.isAfter(startOfMonth.subtract(1, "day")) && d.isBefore(endOfMonth.add(1, "day"));
                const isToday = false;
                const key = d.format("YYYY-MM-DD");
                const evts = byDate.get(key) || [];

                return (
                  <div
                    key={i}
                    className={`min-h-[112px] bg-white p-2 text-sm relative ${
                      inMonth ? "" : "bg-slate-50 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] ${inMonth ? "text-slate-600" : ""}`}>
                        {d.date()}
                      </span>
                      {isToday && (
                        <span className={`${badge} bg-blue-100 text-blue-700`}>Today</span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {evts.map((e, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelected(e)}
                          className="block text-left"
                        >
                          <EventPill title={e.title} muted={e.muted} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

       
            <div className="h-3" />
          </section>

   
       <aside className="col-span-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Event Details</h3>

          {selected ? (
            <>
      
              <div className="rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[16px] font-semibold text-slate-800 truncate">
                        {selected.title}
                      </h4>
                      <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px]">
                        {selected.tag || "Worship"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-[14px] text-slate-700">
                      <div className="flex items-center gap-2">
             
                       <Icon file="icon-clock" className="h-4 w-4 opacity-70" />
                        <span className="truncate">{selected.time || "10:00 AM - 11:30 AM"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                 
                     <Icon file="icon-location" className="h-4 w-4 opacity-70" />
                        <span className="truncate">{selected.location || "Main Sanctuary"}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-[14px] leading-6 text-slate-700">
                      {selected.desc ||
                        "Join us for our weekly Sunday worship service with hymns, scripture readings, and a sermon from Pastor Michael."}
                    </p>
                  </div>

             
                  <div className="shrink-0">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  
                     <Icon file="icon-camera" className="h-5 w-5 opacity-80" />
                    </div>
                  </div>
                </div>

           
                <div className="mt-4 space-y-3">
                  <button className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2">
                    Edit Event
                  </button>
                  <button className="w-full rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-50 py-2">
                    Delete Event
                  </button>
                </div>
              </div>

       
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-medium text-slate-800">Events Completed</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-2xl font-semibold text-slate-900">10</div>
               
                <Icon file="icon-badge-check" className="h-5 w-5" />
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Select a date to view its event details.</p>
          )}
        </div>
      </aside>

        </div>
      </div>
    </div>
  );
}

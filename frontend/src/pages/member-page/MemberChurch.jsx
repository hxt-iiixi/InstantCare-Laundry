import React, { useState, useMemo } from 'react';
import Navbar from '../../components/member-pages/Navbar';  // Import Navbar component
import dayjs from 'dayjs';

// Placeholder images for assets
import placeholderCover from '../../assets/images/cover-member.png'; // Placeholder cover image
import eventImage from '../../assets/images/event-image.png'; // Placeholder for event image

// Sample events data
const EVENTS = [
  { date: "2024-07-07", title: "Sunday Worship", muted: false },
  { date: "2024-07-14", title: "Bible Study", muted: true },
  { date: "2024-07-21", title: "Choir Practice", muted: false },
  { date: "2024-07-28", title: "Prayer Group", muted: true },
];

// Event pill component for rendering events
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

const MemberChurch = () => {
  // Ensure useState is properly imported and used
  const [selected, setSelected] = useState(
    EVENTS.find((e) => e.date === "2024-07-07") || null
  );

  const viewMonth = useMemo(() => dayjs("2024-07-01"), []);
  const startOfMonth = viewMonth.startOf("month");
  const endOfMonth = viewMonth.endOf("month");

  const startGrid = startOfMonth.startOf("week");
  const days = Array.from({ length: 42 }).map((_, i) => startGrid.add(i, "day"));

  const byDate = useMemo(() => {
    const map = new Map();
    for (const e of EVENTS) map.set(e.date, (map.get(e.date) || []).concat(e));
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      {/* Navbar */}
      <Navbar />

      {/* Cover Section with Text */}
      <header className="relative">
        <img
          src={placeholderCover}
          alt="Church cover"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h1 className="text-4xl font-semibold">St. Joseph Parish</h1>
            <p className="mt-2 text-lg">St. Joseph Parish is committed to fostering faith, service, and spiritual growth.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pl-[232px] pt-[64px] min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6">
          {/* Calendar Section */}
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
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-slate-200">
              {days.map((d, i) => {
                const inMonth =
                  d.isAfter(startOfMonth.subtract(1, "day")) && d.isBefore(endOfMonth.add(1, "day"));
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
          </section>

          {/* Event Details Section */}
          <aside className="col-span-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              {/* Image on top of the event details */}
              <img
                src={eventImage} // Placeholder for the event image
                alt="Event"
                className="w-full h-[200px] object-cover rounded-t-xl"
              />
              <h3 className="text-lg font-semibold text-slate-800 mb-4 mt-4">Event Details</h3>

              {selected ? (
                <div className="rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[16px] font-semibold text-slate-800 truncate">
                          {selected.title}
                        </h4>
                      </div>

                      <div className="mt-3 space-y-2 text-[14px] text-slate-700">
                        <p className="mt-3 text-[14px] leading-6 text-slate-700">
                          {selected.desc ||
                            "Join us for our weekly Sunday worship service with hymns, scripture readings, and a sermon from Pastor Michael."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <button className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2">
                      View Details
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Select a date to view its event details.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MemberChurch;

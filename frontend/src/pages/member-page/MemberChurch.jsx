import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { api } from "../../lib/api";
import Navbar from "../../components/member-pages/Navbar";

import placeholderCover from "../../assets/images/cover-member.png";
import eventImage from "../../assets/images/event-image.png";

// point api to your API
api.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// small pill component
function EventPill({ title, muted }) {
  return (
    <span
      className={
        muted
          ? "bg-slate-100 text-slate-500 rounded px-2 py-0.5 text-[12px]"
          : "bg-orange-100 text-orange-700 rounded px-2 py-0.5 text-[12px]"
      }
      title={title}
    >
      {title.length > 18 ? `${title.slice(0, 18)}…` : title}
    </span>
  );
}

export default function MemberChurch() {
  const [church, setChurch] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // month navigation
  const [viewMonth, setViewMonth] = useState(dayjs());
  const startOfMonth = viewMonth.startOf("month");
  const endOfMonth = viewMonth.endOf("month");
  const startGrid = startOfMonth.startOf("week");
  const days = Array.from({ length: 42 }).map((_, i) => startGrid.add(i, "day"));

  // index events by date (YYYY-MM-DD)
  const byDate = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = dayjs(e.date).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || []).concat(e));
    });
    return map;
  }, [events]);

  // fetch member’s church
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/members/me/church", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setChurch(data?.church || null);
      } catch (e) {
        console.error("member church fetch failed:", e?.response?.data || e);
      }
    })();
  }, []);

  // fetch events for that church
  useEffect(() => {
    (async () => {
      if (!church?.id) return;
      try {
        const { data } = await api.get("/api/events", {
          params: { churchId: church.id },
        });
        setEvents(data || []);
        // preselect first upcoming event in the current month (optional)
        const todayKey = dayjs().format("YYYY-MM-DD");
        const upcoming =
          data.find((e) => dayjs(e.date).format("YYYY-MM-DD") >= todayKey) || data[0] || null;
        setSelectedEvent(upcoming);
      } catch (e) {
        console.error("events fetch failed:", e?.response?.data || e);
      }
    })();
  }, [church?.id]);

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <Navbar />

      {/* Cover */}
      <header className="relative">
        <img src={placeholderCover} alt="Church cover" className="w-full h-[300px] object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <h1 className="text-4xl font-semibold">
              {church?.name || "Your Church"}
            </h1>
            <p className="mt-2 text-lg">
              Stay updated with parish events and activities.
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="pt-[24px] min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6">
          {/* Calendar */}
          <section className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 h-14 border-b border-slate-200">
              <button
                onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-slate-800">
                {viewMonth.format("MMMM YYYY")}
              </h2>
              <button
                onClick={() => setViewMonth(viewMonth.add(1, "month"))}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
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
                  d.isAfter(startOfMonth.subtract(1, "day")) &&
                  d.isBefore(endOfMonth.add(1, "day"));
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
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedEvent(e);
                          }}
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

          {/* Event Details */}
          <aside className="col-span-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <img
                src={eventImage}
                alt="Event"
                className="w-full h-[200px] object-cover rounded-t-xl"
              />
              <h3 className="text-lg font-semibold text-slate-800 mb-4 mt-4">Event Details</h3>

              {selectedEvent ? (
                <div className="rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[16px] font-semibold text-slate-800 truncate">
                        {selectedEvent.title}
                      </h4>

                      <div className="mt-3 space-y-2 text-[14px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 3h14v18H5z" />
                          </svg>
                          <span className="truncate">
                            {selectedEvent.time || "Time TBA"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 3H5v18h14z" />
                          </svg>
                          <span className="truncate">
                            {selectedEvent.location || "Location TBA"}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-[14px] leading-6 text-slate-700">
                        {selectedEvent.description ||
                          "Details coming soon."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Select an event to view its details.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

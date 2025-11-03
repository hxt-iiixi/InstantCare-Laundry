import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { api } from "../../lib/api";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

/* ------------------------------- axios base ------------------------------- */
api.defaults.baseURL = "http://localhost:4000";
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* --------------------------------- UI bits -------------------------------- */
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

/* ------------------------------ main component ----------------------------- */
export default function ParishCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // single event view
  const [selectedDateKey, setSelectedDateKey] = useState(null); // list view by day
  const [newDate, setNewDate] = useState(null); // for create modal

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    location: "",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [churchAppId, setChurchAppId] = useState(null);

  const currentDate = dayjs();
  const [viewMonth, setViewMonth] = useState(currentDate);
  const startOfMonth = viewMonth.startOf("month");
  const endOfMonth = viewMonth.endOf("month");
  const startGrid = startOfMonth.startOf("week");
  const days = Array.from({ length: 42 }).map((_, i) => startGrid.add(i, "day"));

  /* ---------------------------- index events by day ---------------------------- */
  const byDate = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = dayjs(e.date).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || []).concat(e));
    });
    return map;
  }, [events]);

  const evtsForSelectedDate = useMemo(
    () =>
      selectedDateKey
        ? (byDate.get(selectedDateKey) || []).sort((a, b) =>
            (a.time || "").localeCompare(b.time || "")
          )
        : [],
    [selectedDateKey, byDate]
  );

  /* ----------------------- fetch church id for this admin ---------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/church-admin/me/church", {
          headers: authHeaders(),
        });
        setChurchAppId(res.data?.church?.id || null);
      } catch (e) {
        console.error("fetch church id failed:", e);
      }
    })();
  }, []);

  /* ------------------------------ fetch events ------------------------------ */
  useEffect(() => {
    (async () => {
      if (!churchAppId) return;
      try {
        const res = await api.get("/api/events", {
          params: { churchId: churchAppId },
          headers: authHeaders(),
        });
        setEvents(res.data || []);
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    })();
  }, [churchAppId]);

  /* --------------------------------- actions -------------------------------- */
  const handleSaveEvent = async () => {
    if (!churchAppId) return;
    const payload = {
      ...newEvent,
      date: newDate, // "YYYY-MM-DD"
      churchRef: churchAppId,
    };
    try {
      const { data } = await api.post("/api/events", payload, {
        headers: authHeaders(),
      });
      setEvents((prev) => [...prev, data]);
      const key = dayjs(data.date).format("YYYY-MM-DD");
      setSelectedDateKey(key);
      setSelectedEvent(null);
      setShowModal(false);
      setNewEvent({ title: "", time: "", location: "", description: "" });
    } catch (error) {
      console.error("Error saving event:", error?.response?.data || error);
    }
  };

  const handleEditEvent = async () => {
    try {
      const { data } = await api.put(
        `/api/events/${editingEvent._id}`,
        newEvent,
        { headers: authHeaders() }
      );
      setEvents((prev) => prev.map((e) => (e._id === data._id ? data : e)));
      const key = dayjs(data.date).format("YYYY-MM-DD");
      setSelectedDateKey(key);
      setSelectedEvent((se) => (se && se._id === data._id ? data : se));
      setShowModal(false);
      setEditingEvent(null);
      setNewEvent({ title: "", time: "", location: "", description: "" });
    } catch (error) {
      console.error("Error editing event:", error?.response?.data || error);
    }
  };

  const handleDeleteEvent = async (id) => {
    const targetId = id || selectedEvent?._id || editingEvent?._id;
    if (!targetId) return;
    try {
      await api.delete(`/api/events/${targetId}`, { headers: authHeaders() });
      setEvents((prev) => prev.filter((e) => e._id !== targetId));
      if (selectedEvent && selectedEvent._id === targetId) setSelectedEvent(null);
      setEditingEvent(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting event:", error?.response?.data || error);
    }
  };

  const handleDateClick = (date) => {
    const k = date.format("YYYY-MM-DD");
    setSelectedDateKey(k);
    setNewDate(k);
    const evts = byDate.get(k);
    if (!evts?.length) {
      setSelectedEvent(null);
      setShowModal(true);
    } else {
      setSelectedEvent(null);
    }
  };

  /* ---------------------------------- JSX ---------------------------------- */
  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" />

      <div className="pl-[232px] pt-[64px] min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6">
          {/* ----------------------------- Calendar ----------------------------- */}
          <section className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-slate-200">
              <button
                onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
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
                  <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
                </svg>
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-slate-200">
              {days.map((d, i) => {
                const inMonth =
                  d.isAfter(startOfMonth.subtract(1, "day")) &&
                  d.isBefore(endOfMonth.add(1, "day"));
                const isToday = d.isSame(dayjs(), "day");
                const key = d.format("YYYY-MM-DD");
                const evts = byDate.get(key) || [];
                const show = evts.slice(0, 3);

                return (
                  <div
                    key={i}
                    className={`min-h-[112px] p-2 text-sm relative cursor-pointer ${
                      inMonth ? "bg-white" : "bg-slate-50 text-slate-300"
                    } ${isToday ? "ring-2 ring-orange-400" : ""}`}
                    onClick={() => handleDateClick(d)}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[12px] ${
                          inMonth ? "text-slate-600" : ""
                        } ${
                          isToday
                            ? "inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500 text-white font-semibold"
                            : ""
                        }`}
                      >
                        {d.date()}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      {show.map((e) => (
                        <button
                          key={e._id}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedEvent(e);
                            setSelectedDateKey(key);
                          }}
                          className="block text-left"
                        >
                          <EventPill title={e.title} muted={e.muted} />
                        </button>
                      ))}
                      {evts.length > 3 && (
                        <div className="text-[11px] text-slate-500">
                          +{evts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* --------------------------- Sidebar details --------------------------- */}
          <aside className="col-span-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Event Details</h3>

              {selectedEvent ? (
                <div className="rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[16px] font-semibold text-slate-800 truncate">
                          {selectedEvent.title}
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px]">
                          {selectedEvent.tag || "Worship"}
                        </span>
                      </div>

                      {/* NEW: date line */}
                      <div className="mt-2 flex items-center gap-2 text-[14px] text-slate-700">
                        <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M7 2v3M17 2v3M3 9h18M5 22h14a2 2 0 0 0 2-2V7H3v13a2 2 0 0 0 2 2z" />
                        </svg>
                        <span>{dayjs(selectedEvent.date).format("MMM D, YYYY")}</span>
                      </div>

                      <div className="mt-2 space-y-2 text-[14px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 3h14v18H5z"></path>
                          </svg>
                          <span className="truncate">{selectedEvent.time || "Time TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 3H5v18h14z"></path>
                          </svg>
                          <span className="truncate">{selectedEvent.location || "Location TBA"}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[14px] leading-6 text-slate-700">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <button
                      className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2"
                      onClick={() => {
                        setEditingEvent(selectedEvent);
                        setNewEvent({
                          title: selectedEvent.title,
                          time: selectedEvent.time,
                          location: selectedEvent.location,
                          description: selectedEvent.description,
                        });
                        setShowModal(true);
                      }}
                    >
                      Edit Event
                    </button>
                    <button
                      className="w-full rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-50 py-2"
                      onClick={() => handleDeleteEvent(selectedEvent._id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ) : selectedDateKey ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      Events on {dayjs(selectedDateKey).format("MMM D, YYYY")}
                    </h4>
                    <button
                      className="text-sm px-2 py-1 bg-orange-500 text-white rounded"
                      onClick={() => {
                        setEditingEvent(null);
                        setNewEvent({
                          title: "",
                          time: "",
                          location: "",
                          description: "",
                        });
                        setShowModal(true);
                      }}
                    >
                      Add Event
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {evtsForSelectedDate.map((e) => (
                      <li key={e._id} className="border rounded p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{e.title}</div>
                            <div className="text-sm text-slate-600 truncate">
                              {(e.time || "").trim()} {e.location ? `• ${e.location}` : ""}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              className="text-sm px-2 py-1 bg-slate-100 rounded"
                              onClick={() => setSelectedEvent(e)}
                            >
                              View
                            </button>
                            <button
                              className="text-sm px-2 py-1 bg-orange-500 text-white rounded"
                              onClick={() => {
                                setEditingEvent(e);
                                setNewEvent({
                                  title: e.title,
                                  time: e.time,
                                  location: e.location,
                                  description: e.description,
                                });
                                setShowModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded"
                              onClick={() => handleDeleteEvent(e._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {!evtsForSelectedDate.length && (
                      <p className="text-slate-500 text-sm">No events yet for this day.</p>
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-slate-500 text-sm">Select a date to view its event(s).</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* --------------------------- Add/Edit Modal --------------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold">{editingEvent ? "Edit Event" : "Add Event"}</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border border-slate-200 p-2 w-full my-2 rounded"
            />
            <input
              type="text"
              placeholder="Event Time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="border border-slate-200 p-2 w-full my-2 rounded"
            />
            <input
              type="text"
              placeholder="Event Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="border border-slate-200 p-2 w-full my-2 rounded"
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="border border-slate-200 p-2 w-full my-2 rounded"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-orange-500 text-white py-2 px-4 rounded"
                onClick={editingEvent ? handleEditEvent : handleSaveEvent}
              >
                {editingEvent ? "Save Changes" : "Save Event"}
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

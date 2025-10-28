import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { api } from "../../lib/api";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";


api.defaults.baseURL = "http://localhost:4000";
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

export default function ParishCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // for the details pane
  const [newDate, setNewDate] = useState(null);             // for the add-event modal

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", location: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [churchAppId, setChurchAppId] = useState(null);

  const currentDate = dayjs();
  const [viewMonth, setViewMonth] = useState(currentDate);
  const startOfMonth = viewMonth.startOf('month');
  const endOfMonth = viewMonth.endOf('month');
  const startGrid = startOfMonth.startOf('week');
  const days = Array.from({ length: 42 }).map((_, i) => startGrid.add(i, 'day'));

  const byDate = useMemo(() => {
    
    const map = new Map();
    events.forEach((e) => {
      const key = dayjs(e.date).format("YYYY-MM-DD");
      map.set(key, (map.get(key) || []).concat(e));
    });
    return map;
  }, [events]);

  // 1) fetch church id for the logged-in admin
  useEffect(() => {
    (async () => {
      try {
        // include auth header if your /me/church route is protected
        const token = localStorage.getItem("token");
        const res = await api.get("/api/church-admin/me/church", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setChurchAppId(res.data?.church?.id || null);
      } catch (e) {
        console.error("fetch church id failed:", e);
      }
    })();
  }, []);

  // 2) fetch events for that church
  useEffect(() => {
    (async () => {
      if (!churchAppId) return;
      try {
        const res = await api.get("/api/events", { params: { churchId: churchAppId } });
        setEvents(res.data || []);
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    })();
  }, [churchAppId]);

  const handleSaveEvent = async () => {
    if (!churchAppId) return; // guard
    const payload = {
      ...newEvent,
      // store date as YYYY-MM-DD (server converts to Date)
      date: newDate,
      churchRef: churchAppId,
    };
    try {
      const { data } = await api.post("/api/events", payload);
      setEvents((prev) => [...prev, data]);
       setSelectedEvent(data);
      setShowModal(false);
      setNewEvent({ title: "", time: "", location: "", description: "" });
    } catch (error) {
      console.error("Error saving event:", error?.response?.data || error);
    }
  };

  const handleEditEvent = async () => {
    try {
      const { data } = await api.patch(`/api/events/${editingEvent._id}`, newEvent);
      setEvents((prev) => prev.map((e) => (e._id === data._id ? data : e)));
      setSelectedEvent(se => (se && se._id === data._id ? data : se));
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
     await api.delete(`/api/events/${targetId}`);
     setEvents((prev) => prev.filter((e) => e._id !== targetId));
     setSelectedEvent(se => (se && se._id === targetId ? null : se));
     setSelectedEvent(null);
     setEditingEvent(null);
     setShowModal(false);
   } catch (error) {
     console.error("Error deleting event:", error?.response?.data || error);
   }
 };
  const handleDateClick = (date) => {
    const k = date.format("YYYY-MM-DD");
    const evts = byDate.get(k);
    if (evts?.length) {
      setSelectedEvent(evts[0]);
    } else {
      setSelectedEvent(null);
      setNewDate(k);    
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" />

      <div className="pl-[232px] pt-[64px] min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-12 gap-6">
          <section className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-slate-200">
              <button onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))} className="p-2 rounded-lg hover:bg-slate-100">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-slate-800">{viewMonth.format('MMMM YYYY')}</h2>
              <button onClick={() => setViewMonth(viewMonth.add(1, 'month'))} className="p-2 rounded-lg hover:bg-slate-100">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-700">
                  <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-slate-200">
              {days.map((d, i) => {
                const inMonth = d.isAfter(startOfMonth.subtract(1, 'day')) && d.isBefore(endOfMonth.add(1, 'day'));
                const key = d.format("YYYY-MM-DD");
                const evts = byDate.get(key) || [];

                return (
                  <div
                    key={i}
                    className={`min-h-[112px] bg-white p-2 text-sm relative ${inMonth ? "" : "bg-slate-50 text-slate-300"}`}
                    onClick={() => handleDateClick(d)}  // Handle date click
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[12px] ${inMonth ? "text-slate-600" : ""}`}>{d.date()}</span>
                    </div>

                    <div className="mt-2 space-y-1">
                     {evts.map((e, idx) => (
                        <button key={idx} onClick={() => setSelectedEvent(e)} className="block text-left">
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
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Event Details</h3>

              {selectedEvent  ? (
                <div className="rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[16px] font-semibold text-slate-800 truncate">
                          {selectedEvent.title}
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[11px]">
                          {setSelectedEvent.tag || "Worship"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-[14px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 3h14v18H5z"></path>
                          </svg>
                          <span className="truncate">{selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 3H5v18h14z"></path>
                          </svg>
                          <span className="truncate">{selectedEvent.location}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[14px] leading-6 text-slate-700">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <button className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2" onClick={() => {
                      setEditingEvent(selectedEvent);
                      setNewEvent({
                        title: selectedEvent.title,
                        time: selectedEvent.time,
                        location: selectedEvent.location,
                        description: selectedEvent.description
                      });
                      setShowModal(true);
                    }}>
                      Edit Event
                    </button>
                    <button className="w-full rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-50 py-2" onClick={() => handleDeleteEvent(selectedEvent._id)}>
                      Delete Event
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

      {/* Modal for Adding New Event */}
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
};


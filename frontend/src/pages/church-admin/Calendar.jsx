import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios'; 
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

// Sample events data, this will be managed in state
let EVENTS = [
  { date: "2025-10-23", title: "Sunday Worship", time: "10:00 AM - 11:30 AM", location: "Main Sanctuary", description: "Join us for our weekly Sunday worship service." },
  { date: "2025-10-24", title: "Bible Study", time: "2:00 PM - 3:30 PM", location: "Library", description: "Bible study session with Pastor Michael." },
];

const badge = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";

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

export default function ParishCalendar() {
  const [events, setEvents] = useState(EVENTS); // Manage events in state
  const [selected, setSelected] = useState(null); // Track selected event
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", location: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null); // Track the event being edited
  const [churchAppId, setChurchAppId] = useState(null);
  const currentDate = dayjs();
  const [viewMonth, setViewMonth] = useState(currentDate); // Start with the current month

  const startOfMonth = viewMonth.startOf('month');
  const endOfMonth = viewMonth.endOf('month');
  const startGrid = startOfMonth.startOf('week');
  
  const days = Array.from({ length: 42 }).map((_, i) => startGrid.add(i, 'day')); // 6 rows, 7 columns

  // Group events by date for easy rendering
  const byDate = useMemo(() => {
  const map = new Map();
  events.forEach((e) => {
    map.set(e.date, (map.get(e.date) || []).concat(e));
  });
  return map;
}, [events]); // Recalculate when events change


const handleSaveEvent = async () => {
  const newEventWithDate = {
    ...newEvent,
    date: dayjs(selected).format("YYYY-MM-DD"),  // Ensure 'selected' is a valid date
    churchRef: churchAppId, // Send the church reference
  };

  try {
    const response = await axios.post("/api/events", newEventWithDate);  // Change URL to relative
    setEvents((prevEvents) => [...prevEvents, response.data]);  // Update state with new event
    setShowModal(false);
    setNewEvent({ title: "", time: "", location: "", description: "" });
  } catch (error) {
    console.error("Error saving event:", error);
  }
};




 const handleEditEvent = async () => {
  const updatedEvent = { ...editingEvent, ...newEvent };

  try {
    const response = await axios.patch(`/api/events/${editingEvent._id}`, updatedEvent);
    setEvents((prevEvents) => prevEvents.map((event) => (event._id === response.data._id ? response.data : event)));
    setShowModal(false);
    setEditingEvent(null);
    setNewEvent({ title: "", time: "", location: "", description: "" });
  } catch (error) {
    console.error("Error editing event:", error);
  }
};


const handleDeleteEvent = async () => {
  try {
    await axios.delete(`/api/events/${editingEvent._id}`);
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== editingEvent._id));  // Remove the event from state
    setShowModal(false);
    setEditingEvent(null);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};


  // When clicking on a date, show the event details if an event exists
  const handleDateClick = (date) => {
    const eventOnDate = byDate.get(date.format("YYYY-MM-DD"));
    if (eventOnDate && eventOnDate.length > 0) {
      setSelected(eventOnDate[0]); // Set selected event
    } else {
      setSelected(null);
      setShowModal(true); // Show the modal if no event
    }
  };

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/events/${churchAppId}`);
      setEvents(response.data);  // Update state with events from the backend
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  if (churchAppId) fetchEvents();
}, [churchAppId]);  // fetch events when churchAppId is set


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
                        <button key={idx} onClick={() => setSelected(e)} className="block text-left">
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

              {selected ? (
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
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 3h14v18H5z"></path>
                          </svg>
                          <span className="truncate">{selected.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 3H5v18h14z"></path>
                          </svg>
                          <span className="truncate">{selected.location}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[14px] leading-6 text-slate-700">
                        {selected.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <button className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2" onClick={() => {
                      setEditingEvent(selected);
                      setNewEvent({
                        title: selected.title,
                        time: selected.time,
                        location: selected.location,
                        description: selected.description
                      });
                      setShowModal(true);
                    }}>
                      Edit Event
                    </button>
                    <button className="w-full rounded-lg bg-white border border-red-100 text-red-600 hover:bg-red-50 py-2" onClick={handleDeleteEvent}>
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


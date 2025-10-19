import React, { useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "tailwindcss/tailwind.css";

// Sample events for demonstration
const events = [
  {
    date: "2024-07-07",
    title: "Sunday Worship Service",
    description: "Join us for our weekly Sunday worship service with hymns, scripture readings, and a sermon from Pastor Michael.",
    time: "10:00 AM - 11:30 AM",
    location: "Main Sanctuary"
  },
  {
    date: "2024-07-11",
    title: "Bible Study",
    description: "An in-depth study of the Scriptures, focusing on the Book of Romans.",
    time: "7:00 PM - 8:30 PM",
    location: "Church Hall"
  },
  // Add more events as needed
];

export default function ParishCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle event click to display details
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const currentMonth = dayjs().month(6); // July (0-based, 6 = July)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Add flex-col here */}
  {/* Sidebar (fixed and sticky) */}
  <div className="w-64 bg-white p-6 shadow-md fixed top-0 left-0 h-screen">
    <div className="mb-6 flex items-center justify-start space-x-2">
      <img src="/path/to/am-power-logo.png" alt="AmPower Logo" className="h-8" />
      <span className="text-xl font-bold">Admin Dashboard</span>
    </div>
    <ul>
      <li><Link to="/parish-calendar" className="block py-2 text-gray-800 hover:text-orange-500">Parish Calendar</Link></li>
      <li><Link to="/ministry-monitoring" className="block py-2 text-gray-800 hover:text-orange-500">Ministry Monitoring</Link></li>
      <li><Link to="/parishioner-engagement" className="block py-2 text-gray-800 hover:text-orange-500">Parishioner Engagement</Link></li>
      <li><Link to="/spiritual-growth-journal" className="block py-2 text-gray-800 hover:text-orange-500">Spiritual Growth Journal</Link></li>
    </ul>
    <div className="mt-auto">
      <button className="block w-full py-2 text-gray-700 mt-4 hover:bg-gray-200">Settings</button>
      <button className="block w-full py-2 text-red-500 mt-2 hover:bg-red-100">Logout</button>
    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 p-6 ml-64"> {/* Added ml-64 to create space for the sidebar */}
    {/* Top Navigation */}
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* AmPower Logo */}
      <div className="flex items-center space-x-4">
        <img src="/path/to/am-power-logo.png" alt="AmPower Logo" className="h-8" />
      </div>
      {/* Parish Calendar Title */}
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-bold">Parish Calendar</h1>
      </div>
      {/* Profile and Settings */}
      <div className="flex items-center space-x-4">
        <img
          src="/path/to/profile-picture.jpg"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <button className="bg-gray-200 p-2 rounded-full">
          <span className="material-icons">settings</span>
        </button>
      </div>
    </div>

    {/* Calendar and Event Details Side-by-Side */}
    <div className="flex space-x-6 mt-6">
      {/* Calendar */}
      <div className="w-2/3 p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-7 gap-4 text-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="font-bold">{dayjs().day(i).format("ddd")}</div>
          ))}
          {Array.from({ length: currentMonth.daysInMonth() }).map((_, i) => {
            const date = currentMonth.date(i + 1);
            const event = events.find((e) => e.date === date.format("YYYY-MM-DD"));
            return (
              <div
                key={i}
                className={`cursor-pointer ${event ? "bg-yellow-200" : ""} p-4 rounded-lg hover:bg-yellow-100`}
                onClick={() => event && handleEventClick(event)}
              >
                {date.date()}
                {event && <div className="text-xs text-gray-600 mt-1">{event.title}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details */}
      <div className="w-1/3 p-6 bg-white rounded-lg shadow-md">
        {selectedEvent ? (
          <>
            <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{selectedEvent.time} | {selectedEvent.location}</p>
            <p className="mt-4">{selectedEvent.description}</p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">Edit Event</button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Delete Event</button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Click a date to see event details.</p>
        )}
      </div>
    </div>
  </div>

  {/* Bottom Navigation */}
  <div className="w-full bg-white p-4 shadow-md mt-auto flex justify-center space-x-6">
    <Link to="/quick-links" className="text-gray-800 hover:text-orange-500">Quick Links</Link>
    <Link to="/resources" className="text-gray-800 hover:text-orange-500">Resources</Link>
    <Link to="/legal" className="text-gray-800 hover:text-orange-500">Legal</Link>
    {/* Social Media Icons */}
    <div className="flex items-center space-x-4">
      <a href="https://facebook.com" className="text-gray-800 hover:text-blue-600">
        <i className="fab fa-facebook-square text-xl"></i> {/* Font Awesome */}
      </a>
      <a href="https://twitter.com" className="text-gray-800 hover:text-blue-400">
        <i className="fab fa-twitter text-xl"></i> {/* Font Awesome */}
      </a>
      <a href="https://linkedin.com" className="text-gray-800 hover:text-blue-600">
        <i className="fab fa-linkedin text-xl"></i> {/* Font Awesome */}
      </a>
      <a href="https://instagram.com" className="text-gray-800 hover:text-pink-600">
        <i className="fab fa-instagram text-xl"></i> {/* Font Awesome */}
      </a>
    </div>
  </div>
</div>
  );
}

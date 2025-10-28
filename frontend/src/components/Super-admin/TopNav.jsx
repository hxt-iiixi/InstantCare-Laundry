import React from "react";
import { NavLink } from "react-router-dom";

const SEARCH = "/src/assets/icons/Search.svg";
import ampowerLogo from "/src/assets/icons/ampower.svg";
import test from "/src/assets/images/jc.jpg";

const TopNav = () => {
  return (
    <div className="bg-white text-white p-4 flex justify-between items-center border-b w-full fixed top-0 left-0 z-10">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <img
          src={ampowerLogo}
          alt="Logo"
          className="h-15 mr-4" // Adjust height as needed
        />
      </div>

      {/* Center - Navigation Links */}
      <div className="flex space-x-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-zinc-900 hover:text-gray-400"
          }
        >
          Dashboard Overview
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-zinc-900 hover:text-gray-400"
          }
        >
          Account Control
        </NavLink>
        <NavLink
          to="/SystemManagement"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-zinc-900 hover:text-gray-400"
          }
        >
          System Management
        </NavLink>
      </div>

      {/* Right side - Search Bar, Button, Profile */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="flex items-center bg-white p-2 rounded-md border-2 border-gray-300">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-black focus:outline-none w-48 pl-2"
          />
        </div>

        {/* Search Button */}
        <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
          <img src={SEARCH} alt="Search Icon" className="h-5 w-5" />
        </button>

        {/* Profile Icon */}
        <div className="relative">
          <button>
            <img
              src={test}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

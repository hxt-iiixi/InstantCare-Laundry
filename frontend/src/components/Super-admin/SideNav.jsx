import React from "react";
import { NavLink } from "react-router-dom";

// Custom Icons
import dashboardIcon from "/src/assets/icons/dashboard.svg";
import accountIcon from "/src/assets/icons/account.svg";
import systemIcon from "/src/assets/icons/system.svg";
import userRolesIcon from "/src/assets/icons/user-roles.svg";

const SideNav = () => {
  return (
    <div className="w-64 bg-white text-zinc-900 p-6 mt-16 fixed left-0 top-5 h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-8">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 p-2 bg-gray-200 text-orange-500 font-semibold rounded-md"
                  : "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
              }
            >
              <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
              Dashboard Overview
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/account"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 p-2 bg-gray-200 text-orange-500 font-semibold rounded-md"
                  : "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
              }
            >
              <img src={accountIcon} alt="Account Control" className="w-6 h-6" />
              Account Control
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/SystemManagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 p-2 bg-gray-200 text-orange-500 font-semibold rounded-md"
                  : "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
              }
            >
              <img src={systemIcon} alt="System Management" className="w-6 h-6" />
              System Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;

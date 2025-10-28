import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Custom Icons
import dashboardIcon from "/src/assets/icons/dashboard.svg";
import accountIcon from "/src/assets/icons/account.svg";
import systemIcon from "/src/assets/icons/system.svg";

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear anything auth-related you cache
    localStorage.removeItem("token");
    localStorage.removeItem("churchAppId");
    // add other keys if you use them (e.g., "churchName")
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white text-zinc-900 shadow-lg flex flex-col">
      {/* Top: title + links */}
      <div className="p-6">
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

      {/* Bottom: logout */}
      <div className="mt-auto p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
        >
          {/* inline logout icon to avoid extra asset */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeWidth="2" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path strokeWidth="2" d="M10 17l5-5-5-5" />
            <path strokeWidth="2" d="M15 12H3" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
};

export default SideNav;

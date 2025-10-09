import React from "react";
import { Link } from "react-router-dom";

// Custom Icons
import dashboardIcon from "/src/assets/icons/dashboard.svg";  // Replace with your icon paths
import accountIcon from "/src/assets/icons/account.svg";      // Replace with your icon paths
import systemIcon from "/src/assets/icons/system.svg";        // Replace with your icon paths
import userRolesIcon from "/src/assets/icons/user-roles.svg"; // Replace with your icon paths

const SideNav = () => {
  return (
    <div className="w-64 bg-white text-zinc-900 p-6 mt-16 fixed left-0 top-5 h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-8">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-4 flex items-center">
            <img src={dashboardIcon} alt="Dashboard" className="mr-3 w-6 h-6" /> {/* Custom Icon */}
            <Link to="/" className="hover:text-gray-400">Dashboard Overview</Link>
          </li>
          <li className="mb-4 flex items-center">
            <img src={accountIcon} alt="Account Control" className="mr-3 w-6 h-6" /> {/* Custom Icon */}
            <Link to="/account" className="hover:text-gray-400">Account Control</Link>
          </li>
          <li className="mb-4 flex items-center">
            <img src={systemIcon} alt="System Management" className="mr-3 w-6 h-6" /> {/* Custom Icon */}
            <Link to="/system-management" className="hover:text-gray-400">System Management</Link>
          </li>
          <li className="flex items-center">
            <img src={userRolesIcon} alt="User Roles" className="mr-3 w-6 h-6" /> {/* Custom Icon */}
            <Link to="/user-roles" className="hover:text-gray-400">User Roles</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;

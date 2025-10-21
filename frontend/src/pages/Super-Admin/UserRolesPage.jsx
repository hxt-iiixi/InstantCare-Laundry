import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SideNav from "../../components/Super-admin/SideNav";
import TopNav from "../../components/Super-admin/TopNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";

const UserRolesPage = () => {
  const navigate = useNavigate();

  // Default selected role
  const [roleName, setRoleName] = useState("Parishoner");
  const [roleDescription, setRoleDescription] = useState(
    "Basic user with access to general church services and updates."
  );

  const [permissions] = useState({
    manageSystemSettings: {
      enabled: false,
      description: "Can change global application settings.",
    },
    manageRolesPermissions: {
      enabled: false,
      description: "Can create, edit, and delete roles and assign permissions.",
    },
    approveRejectRegistrations: {
      enabled: false,
      description: "Can approve or reject new church registrations.",
    },
    sendNotifications: {
      enabled: true,
      description: "Can send messages to church members.",
    },
    viewActivityLogs: {
      enabled: false,
      description: "Can view church-related activity logs.",
    },
    deactivateAccounts: {
      enabled: false,
      description: "Can enable or disable church accounts.",
    },
  });

  const handleRoleChange = (value) => {
    setRoleName(value);
    if (value === "Parishoner") {
      setRoleDescription(
        "Basic user with access to general church services and updates."
      );
    } else if (value === "Moderator") {
      setRoleDescription("Can assist in managing members and church content.");
    }
  };

  const handleSaveChanges = () => {
    console.log("Changes saved for role:", roleName);
  };

  // Role cards (left side)
  const roles = [
    { name: "Super Admin", users: 1, active: false },
    { name: "Church Admin", users: 12, active: false },
    { name: "Moderator", users: 5, active: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16 flex-col">
      <SideNav />
      <div className="flex-1 bg-white p-8 ml-64">
        <TopNav />

        <div className="container mx-auto p-6">
          {/* === User Roles Management Section === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* ===== Left Section: Manage Roles ===== */}
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Manage Roles</h2>

              <div className="space-y-3">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    onClick={() => handleRoleChange(role.name)}
                    className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                      role.active
                        ? "bg-orange-50 border-orange-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {role.users} Users
                      </p>
                    </div>
                    <ArrowRight className="text-gray-500" size={18} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/add-role")}
                className="mt-6 w-full border border-dashed border-gray-400 rounded-lg py-2 text-gray-600 hover:bg-gray-50 transition"
              >
                Add New Role
              </button>
            </div>

            {/* ===== Right Section: Edit Role ===== */}
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Edit Role</h2>
              <div className="space-y-6">
                {/* Role Name (Dropdown) */}
                <div className="space-y-2">
                  <label className="font-semibold">Role Name</label>
                  <select
                    value={roleName}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full p-4 border rounded-md bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  >
                    <option value="Parishoner">Parishoner/Member</option>
                    <option value="Moderator">Moderator/Assistant</option>
                  </select>
                </div>

                {/* Role Description */}
                <div className="space-y-2">
                  <label className="font-semibold">Description</label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="w-full p-4 border rounded-md"
                  />
                </div>

                {/* Permissions Section (no checkboxes) */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Permissions</h3>
                  {Object.keys(permissions).map((permission, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border ${
                        permissions[permission].enabled
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <span className="font-semibold block capitalize">
                        {permission.replace(/([A-Z])/g, " $1")}
                      </span>
                      <p className="text-sm text-gray-500">
                        {permissions[permission].description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save / Cancel Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => navigate("/user-roles")}
                  className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default UserRolesPage;

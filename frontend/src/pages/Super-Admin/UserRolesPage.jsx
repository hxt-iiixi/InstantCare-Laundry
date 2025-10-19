import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Super-admin/SideNav"; // SideNav component
import TopNav from "../../components/Super-admin/TopNav"; // TopNav component
import Footer from "../../components/Home-Page/ChurchInfoFooter"; // Footer component

const UserRolesPage = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("Super Admin");
  const [roleDescription, setRoleDescription] = useState("Full control over all system functionalities and user management.");
  const [permissions, setPermissions] = useState({
    manageSystemSettings: { enabled: true, description: "Can change global application settings." },
    manageRolesPermissions: { enabled: true, description: "Can create, edit, and delete roles and assign permissions." },
    approveRejectRegistrations: { enabled: true, description: "Can approve or reject new church registrations." },
    sendNotifications: { enabled: true, description: "Can send messages to all users and church admins." },
    viewActivityLogs: { enabled: true, description: "Can view all system activity and login logs." },
    deactivateAccounts: { enabled: true, description: "Can enable or disable any user or church account." },
  });

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        enabled: !prev[permission].enabled,
      },
    }));
  };

  const handleSaveChanges = () => {
    // Handle saving the role changes (e.g., making API call)
    console.log("Changes saved for role:", roleName);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16 flex-col">
      <SideNav />
      <div className="flex-1 bg-white p-8 ml-64">
        <TopNav />
        <div className="container mx-auto p-6">
          {/* User Roles Management Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Section: Manage Roles */}
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Manage Roles</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Super Admin</span>
                  <span>1 User</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Church Admin</span>
                  <span>12 Users</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Moderator</span>
                  <span>5 Users</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/add-role")}
                className="mt-6 bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 w-full"
              >
                Add New Role
              </button>
            </div>

            {/* Right Section: Edit Role */}
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Edit Role</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-semibold">Role Name</label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full p-4 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold">Description</label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="w-full p-4 border rounded-md"
                  />
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Permissions</h3>
                  {Object.keys(permissions).map((permission, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={permissions[permission].enabled}
                        onChange={() => handlePermissionChange(permission)}
                        className="h-5 w-5"
                      />
                      <div>
                        <span className="font-semibold">{permission.replace(/([A-Z])/g, " $1")}</span>
                        <p className="text-sm text-gray-500">{permissions[permission].description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
      </div>

    </div>
  );
};

export default UserRolesPage;

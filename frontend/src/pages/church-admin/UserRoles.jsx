import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SideNav from "../../components/Super-admin/SideNav";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

const UserRolesPage = () => {
  const navigate = useNavigate();
  const [churchAppId, setChurchAppId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const rolePermissions = {
    Moderator: {
      manageSystemSettings: { 
        enabled: true,
        description: "Can manage event and service configurations.",
      },
      approveRejectMembers: {
        enabled: true,
        description: "Can approve or reject new member requests.",
      },
      sendMessages: {
        enabled: true,
        description: "Can send messages to all members.",
      },
      manageEvents: {
        enabled: true,
        description: "Can create, edit, or announce church events.",
      },
    },

    Parishoner: {
      viewEvents: {
        enabled: true,
        description: "Can view upcoming and past church events.",
      },
      viewAnnouncements: {
        enabled: true,
        description: "Can read church announcements and updates.",
      },
      viewDevotions: {
        enabled: true,
        description: "Can view daily devotions and prayer reflections.",
      },
    },
  };

  // === Default Role State ===
  const [roleName, setRoleName] = useState("Parishoner");
  const [roleDescription, setRoleDescription] = useState(
    "Basic user with access to general church services and updates."
  );
  const [permissions, setPermissions] = useState(rolePermissions["Parishoner"]);

  // === Handle Role Change ===
  const handleRoleChange = (value) => {
    setRoleName(value);

    if (value === "Parishoner") {
      setRoleDescription(
        "Basic user with access to general church services and updates."
      );
    } else if (value === "Moderator") {
      setRoleDescription("Can assist in managing members and church content.");
    }

    setPermissions(rolePermissions[value]);
  };

  const handleSaveChanges = () => {
    console.log("Changes saved for role:", roleName);
  };
   const ensureChurchId = async () => {
    if (churchAppId) return churchAppId;
    const { data } = await api.get("/api/church-admin/me/church");
    const id = data?.church?.id || null;
    setChurchAppId(id);
    return id;
  };

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const id = await ensureChurchId();
      if (!id) {
        setMembers([]);
        setLoadingMembers(false);
        return;
      }
      const { data } = await api.get("/api/church-admin/members", { params: { churchId: id } });
      setMembers(data?.users || []);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);
  // === Role cards (only Moderator and Parishoner) ===
 const moderatorCount = 0; // (add later if you’ll have real “moderator” users)
const parishionerCount = members.length;

const roles = [
  { name: "Moderator", users: moderatorCount },
  { name: "Parishoner", users: parishionerCount },
];
  // === Parishioner Data (Sample) ===
  const parishioners = [
    { id: 1, name: "John Smith", role: "Parishioner" },
    { id: 2, name: "Sarah Johnson", role: "Parishioner" },
    { id: 3, name: "Michael Brown", role: "Parishioner" },
    { id: 4, name: "Emily Davis", role: "Parishioner" },
    { id: 5, name: "David Lee", role: "Parishioner" },
    { id: 6, name: "John Smith", role: "Parishioner" },
    { id: 7, name: "Sarah Johnson", role: "Parishioner" },
    { id: 8, name: "Michael Brown", role: "Parishioner" },
    { id: 9, name: "Emily Davis", role: "Parishioner" },
    { id: 10, name: "David Lee", role: "Parishioner" },
    { id: 11, name: "John Smith", role: "Parishioner" },
    { id: 12, name: "Sarah Johnson", role: "Parishioner" },
    { id: 13, name: "Michael Brown", role: "Parishioner" },
    { id: 14, name: "Emily Davis", role: "Parishioner" },
    { id: 15, name: "David Lee", role: "Parishioner" },
  ];
const churchName = localStorage.getItem("churchName")
  return (
   <div className="min-h-screen bg-[#FBF7F3]">
        <AdminSidebar />
        <AdminHeader className="pl-[232px]" />
      <div className="flex-1 bg-white p-8 ml-64">
      
        <div className="container mx-auto p-6">
          {/* === Parishioners Section === */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800">
             {churchName}{" "}
              <span className="font-[cursive] text-black">
                Parishioners/Members
              </span>
            </h2>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {loadingMembers && (
                <div className="col-span-full text-sm text-gray-500">Loading members…</div>
              )}

              {!loadingMembers && members.length === 0 && (
                <div className="col-span-full text-sm text-gray-500">
                  No members have joined with this church code yet.
                </div>
              )}

              {!loadingMembers && members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center space-x-3 bg-white rounded-md border border-gray-200 shadow-sm p-3"
                >
                  <img
                    src={m.avatar || "/src/assets/images/user-avatar.png"}
                    alt={m.name || m.username || "Member"}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {m.name || m.username || m.email}
                    </p>
                    <span className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                      Parishioner
                    </span>
                  </div>
                </div>
                ))}
            </div>
          </div>

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
                      roleName === role.name
                        ? "bg-orange-50 border-orange-400 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h3
                        className={`font-semibold ${
                          roleName === role.name
                            ? "text-orange-600"
                            : "text-gray-800"
                        }`}
                      >
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {role.users} Users
                      </p>
                    </div>
                    <ArrowRight
                      className={`transition-colors ${
                        roleName === role.name
                          ? "text-orange-500"
                          : "text-gray-500"
                      }`}
                      size={18}
                    />
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
                {/* Role Name Dropdown */}
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

                {/* Permissions Section */}
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
      </div>
    </div>
  );
};

export default UserRolesPage;
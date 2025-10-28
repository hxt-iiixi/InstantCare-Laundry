import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../lib/api";
import AdminHeader from "../../components/church-admin/AdminHeader";
import AdminSidebar from "../../components/church-admin/AdminSidebar";

// tiny helpers
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
      <div>
        <div className="text-slate-600 text-sm">{label}</div>
        <div className="text-3xl font-semibold text-slate-900 mt-1">{value}</div>
        <div className="text-emerald-600 text-xs mt-2">↑ auto-updates</div>
      </div>
      <div className="text-orange-500">{icon}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const active = status === "active";
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function ParishEngagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // load current church members for this admin
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await api.get("/api/church-admin/members", { headers });
        setMembers(data?.users || []);
      } catch (e) {
        console.error("load members error:", e?.response?.data || e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeMembers = useMemo(() => members.filter(m => m.status === "active"), [members]);
  const inactiveMembers = useMemo(() => members.filter(m => m.status !== "active"), [members]);

  const setStatus = async (userId, next) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // optimistic
      setMembers(prev => prev.map(m => (m._id === userId ? { ...m, status: next } : m)));
      await api.patch(`/api/church-admin/members/${userId}/status`, { status: next }, { headers });
    } catch (e) {
      console.error("update status error:", e?.response?.data || e);
      // revert on fail
      setMembers(prev => prev.map(m => (m._id === userId ? { ...m, status: next === "active" ? "inactive" : "active" } : m)));
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" />

      <main className="pl-[232px] pt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-6 py-6">
          {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Parishioner’s Engagements</h1>
              <p className="mt-3 text-slate-600 leading-6">
                Parishioner engagement refers to how actively and meaningfully members of a church
                (the parishioners) participate in the life, mission, and activities of their parish community.
              </p>
            </div>
            <div className="justify-self-end hidden md:block">
              {/* put your illustration img here if you have one */}
              <div className="w-[320px] h-[180px] rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                👨‍👩‍👧‍👦
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">  
            <StatCard label="Active Parishioners" value={activeMembers.length} icon={<svg width="28" height="28"><rect x="6" y="6" width="16" height="16" fill="currentColor" /></svg>} />
            <StatCard label="Inactive Parishioners" value={inactiveMembers.length} icon={<svg width="28" height="28"><circle cx="14" cy="14" r="10" fill="currentColor" /></svg>} />
          </div>

          {/* Table */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Active Parishioners</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 bg-slate-50">
                    <th className="px-6 py-3">Parishioner/Members</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Emails</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Birthday</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? Array.from({ length: 5 }).map((_, i) => ({ _id: i })) : members)
                    .filter(m => m.status === "active")
                    .map((m) => (
                      <tr key={m._id} className="border-t border-slate-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.avatar || "/src/assets/images/user-avatar.png"}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                            <div className="font-medium text-slate-800">{m.name || m.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{m.phone || "—"}</td>
                        <td className="px-6 py-4">{m.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs">
                            {m.role || "Parishioner"}
                          </span>
                        </td>
                        <td className="px-6 py-4">{m.dob ? dayjs(m.dob).format("MMMM D, YYYY") : "—"}</td>
                        <td className="px-6 py-4"><StatusPill status={m.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setStatus(m._id, "inactive")}
                            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Set Inactive
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional: a separate table for inactive (if you want to manage there too) */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Inactive Parishioners</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 bg-slate-50">
                    <th className="px-6 py-3">Parishioner/Members</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Emails</th>
                    <th className="px-6 py-3">Birthday</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.filter(m => m.status !== "active").map(m => (
                    <tr key={m._id} className="border-t border-slate-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar || "/src/assets/images/user-avatar.png"}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div className="font-medium text-slate-800">{m.name || m.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{m.phone || "—"}</td>
                      <td className="px-6 py-4">{m.email}</td>
                      <td className="px-6 py-4">{m.dob ? dayjs(m.dob).format("MMMM D, YYYY") : "—"}</td>
                      <td className="px-6 py-4"><StatusPill status={m.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setStatus(m._id, "active")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Set Active
                        </button>
                      </td>
                    </tr>
                  ))}
                  {inactiveMembers.length === 0 && (
                    <tr><td className="px-6 py-6 text-slate-500" colSpan={6}>No inactive parishioners.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

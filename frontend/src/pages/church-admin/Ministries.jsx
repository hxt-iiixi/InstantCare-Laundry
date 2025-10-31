import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

const TABS = [
  { key: "all",          label: "All" },
  { key: "pending",      label: "Join Request" },
  { key: "leave-pending",label: "Leave Request" },
  { key: "approved",     label: "Approved" },
  { key: "rejected",     label: "Rejected" },
];

export default function MinistriesAdmin() {
  const [churchId, setChurchId] = useState(null);
  const [tab, setTab] = useState("pending");
  const [rows, setRows] = useState([]);
  const [roster, setRoster] = useState({});

  const headers = () => {
    const t = localStorage.getItem("token");
    return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
  };

  const loadChurch = async () => {
    const { data } = await api.get("/api/church-admin/mine", headers());
    setChurchId(data.id);
    return data.id;
  };

  const loadRequests = async (id, status = tab) => {
    const { data } = await api.get("/api/church-admin/ministries/requests", {
      ...headers(),
      params: { churchId: id, status },
    });
    setRows(data.items || []);
  };

  const loadRoster = async (id) => {
    const { data } = await api.get("/api/ministries/roster", { ...headers(), params: { churchId: id } });
    setRoster(data.roster || {});
  };

  useEffect(() => {
    (async () => {
      const id = await loadChurch();
      await loadRequests(id, tab);
      await loadRoster(id);
    })();
  }, [tab]);

  const act = async (id, action) => {
    await api.patch(`/api/church-admin/ministries/requests/${id}`, { action }, headers());
    await loadRequests(churchId, tab);
    await loadRoster(churchId);
  };

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" title="Ministries" />
      <main className="pl-[232px] pt-[64px] px-6">
        {/* Tabs */}
        <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ministries Request</h2>
          <div className="flex gap-2 mb-3">
            {TABS.map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-sm rounded-full px-3 py-1.5 ${tab===t.key ? "bg-orange-500 text-white":"bg-slate-100 text-slate-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Member</th>
                  <th className="px-3 py-2 text-left">Ministry</th>
                  <th className="px-3 py-2 text-left">Request Type</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img src={r.member.avatar || "/src/assets/images/user-avatar.png"} className="h-6 w-6 rounded-full" />
                        <span className="truncate">{r.member.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 capitalize">{r.ministry}</td>
                    <td className="px-3 py-2 capitalize">{r.requestType}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs rounded px-2 py-0.5 ${r.status==="approved"?"bg-green-100 text-green-700":
                        r.status==="pending"?"bg-orange-100 text-orange-700":
                        r.status==="leave-pending"?"bg-amber-100 text-amber-700":
                        r.status==="rejected"?"bg-red-100 text-red-700":"bg-slate-100 text-slate-600"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => act(r.id, "approve")} className="px-3 py-1.5 text-sm rounded bg-green-600 text-white">Approve</button>
                        <button onClick={() => act(r.id, "reject")}  className="px-3 py-1.5 text-sm rounded bg-red-600 text-white">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roster below */}
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {["music","youth","education","community","outreach"].map(key => (
            <div key={key} className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold capitalize text-slate-800">{key} Ministry <span className="text-sm text-slate-500">Members</span></h3>
              <ol className="mt-3 space-y-2 text-sm">
                {(roster[key] || []).map((u, i) => (
                  <li key={u.id} className="flex items-center gap-2">
                    <span className="text-slate-400 w-5 text-right">{i+1}.</span>
                    <img src={u.avatar || "/src/assets/images/user-avatar.png"} className="h-5 w-5 rounded-full" />
                    <span className="truncate">{u.name}</span>
                  </li>
                ))}
                {(!roster[key] || roster[key].length===0) && <li className="text-slate-500">No members yet.</li>}
              </ol>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

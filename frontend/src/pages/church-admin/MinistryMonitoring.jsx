// src/pages/church-admin/MinistryMonitoring.jsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

const SAMPLE = [
  { ministry: "Music Ministry", activity: "Choir Practice", date: "2024-07-28" },
  { ministry: "Youth People Ministry", activity: "Summer Camp Registration", date: "2024-07-27" },
  { ministry: "Education Ministry", activity: "Bible Study Session", date: "2024-07-25" },
  { ministry: "Community Ministry", activity: "Senior Citizen Outreach Visit", date: "2024-07-24" },
  { ministry: "Outreach Ministry", activity: "Homeless Shelter Volunteering", date: "2024-07-23" },
];

/* ---------- sample data for the ministries requests (bottom card) ---------- */
const TABS = ["All", "Join Request", "Leave Request", "Pending", "Approved", "Reject"];

const MOCK_DATA = [
  {
    id: 1,
    member: "Kennedy",
    ministry: "Music Ministry",
    type: "Join Request",
    status: "Pending",
    notes: "Available Sundays. Prefers vocal section.",
  },
  {
    id: 2,
    member: "Avril Joii",
    ministry: "Outreach Ministry",
    type: "Leave Request",
    status: "Pending",
    notes: "Moving out of town next month.",
  },
  {
    id: 3,
    member: "Dambo",
    ministry: "Youth Ministry",
    type: "Join Request",
    status: "Approved",
    notes: "Completed orientation.",
  },
  {
    id: 4,
    member: "Dambo",
    ministry: "Youth Ministry",
    type: "Join Request",
    status: "Approved",
    notes: "Already assisting weekly.",
  },
  {
    id: 5,
    member: "Avril Joii",
    ministry: "Outreach Ministry",
    type: "Leave Request",
    status: "Pending",
    notes: "Requested leave for 3 months.",
  },
];

/* ---------- small status badge used by bottom table ---------- */
function StatusBadge({ status }) {
  const base = "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium select-none";
  switch ((status || "").toLowerCase()) {
    case "pending":
      return <span className={`${base} bg-orange-100 text-orange-700`}>Pending</span>;
    case "approved":
      return <span className={`${base} bg-emerald-100 text-emerald-700`}>Approved</span>;
    case "reject":
    case "rejected":
      return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
}

/* ---------- MinistriesRequest component (bottom card) ---------- */
function MinistriesRequest({ data = MOCK_DATA }) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((row) => {
      if (activeTab !== "All") {
        if (activeTab === "Pending" && row.status !== "Pending") return false;
        if (activeTab === "Approved" && row.status !== "Approved") return false;
        if (activeTab === "Reject" && !/reject|rejected/i.test(row.status)) return false;
        if (activeTab === "Join Request" && row.type !== "Join Request") return false;
        if (activeTab === "Leave Request" && row.type !== "Leave Request") return false;
      }
      if (!q) return true;
      return (
        row.member.toLowerCase().includes(q) ||
        row.ministry.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q)
      );
    });
  }, [activeTab, query, data]);

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-3xl font-semibold text-gray-900">Ministries Request</h2>
        <p className="text-sm text-gray-500 mt-1">Lead and provide music for services.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive ? "bg-orange-500 text-white shadow" : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by member name or ministry"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-4 rounded-tl-md">Members</th>
              <th className="px-6 py-4">Ministry</th>
              <th className="px-6 py-4">Request Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-md">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-white/50">
                  <td className="px-6 py-4 text-gray-800">{row.member}</td>
                  <td className="px-6 py-4 text-gray-600">{row.ministry}</td>
                  <td className="px-6 py-4 text-gray-600">{row.type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelected(row)}
                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:opacity-95"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          toast.success(`Approved ${row.member}`);
                        }}
                        className="px-3 py-2 text-sm rounded-md border border-green-200 text-green-700 hover:bg-green-50"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selected.member}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selected.ministry}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="mt-5">
                <h4 className="text-sm text-gray-600 uppercase tracking-wide">Request Type</h4>
                <p className="mt-1 text-gray-800">{selected.type}</p>

                <h4 className="mt-4 text-sm text-gray-600 uppercase tracking-wide">Notes</h4>
                <p className="mt-1 text-gray-800">{selected.notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-md text-sm border hover:bg-gray-50">
                Close
              </button>
              <button
                onClick={() => {
                  toast.success(`Approved ${selected.member}`);
                  setSelected(null);
                }}
                className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  toast.error(`Rejected ${selected.member}`);
                  setSelected(null);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- final combined page (default export) ---------- */
export default function MinistryMonitoring() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-30 h-16 bg-white border-b">
        <TopNav />
      </header>

      <div className="pt-16 flex flex-1">
        {/* Side nav */}
        <aside className="hidden md:block w-64 shrink-0 border-r bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <SideNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10 space-y-6">
          {/* Top section: left table + right panel */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left card (table) */}
            <section className="xl:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed">
                  <thead>
                    <tr className="bg-slate-700 text-white text-sm">
                      <th className="py-4 px-6 font-medium rounded-tl-lg">Ministry</th>
                      <th className="py-4 px-6 font-medium">Activity</th>
                      <th className="py-4 px-6 text-center font-medium">Date</th>
                      <th className="py-4 px-6 text-center font-medium rounded-tr-lg">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE.map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                        <td className="py-6 px-6 text-slate-800">{row.ministry}</td>
                        <td className="py-6 px-6 text-slate-700">{row.activity}</td>
                        <td className="py-6 px-6 text-center text-slate-700">{row.date}</td>
                        <td className="py-6 px-6 text-center">
                          <button className="px-3 py-1.5 rounded-md bg-orange-500 text-white text-sm hover:bg-orange-600">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right panel */}
            <aside className="xl:col-span-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-slate-800">Ministry Activities</h2>
                  <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600">+</button>
                </div>

                <p className="text-slate-600 text-sm mb-4">Latest Ministry in your church</p>

                <ol className="list-decimal pl-6 space-y-3 text-slate-700 text-sm">
                  {SAMPLE.map((s, idx) => (
                    <li key={idx} className="leading-6">{s.ministry}</li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          {/* Bottom section: Ministries Request (full-width card) */}
          <div className="max-w-7xl mx-auto">
            <MinistriesRequest />
          </div>J

          {/* Footer */}
          <footer className="max-w-7xl mx-auto">
          </footer>
        </main>
      </div>
    </div>
  );
}

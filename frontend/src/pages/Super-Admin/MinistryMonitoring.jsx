// src/pages/super-admin/SystemManagementPage.jsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import TopNav from "../../components/Super-admin/TopNav";
import SideNav from "../../components/Super-admin/SideNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
import { api } from "../../lib/api"; // keep for later use

// Import your icon (bell.png or another relevant icon)
import bell from "../../assets/icons/bell.png";

/* ======================================================
  Inline MinistriesRequest component (combined file)
  You can later move this into its own file if preferred.
   ====================================================== */

const TABS = [
  "All",
  "Join Request",
  "Leave Request",
  "Pending",
  "Approved",
  "Reject",
];

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

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium select-none";
  switch ((status || "").toLowerCase()) {
    case "pending":
      return <span className={`${base} bg-orange-100 text-orange-700`}>Pending</span>;
    case "approved":
      return <span className={`${base} bg-emerald-100 text-emerald-700`}>Approved</span>;
    case "reject":
    case "rejected":
      return <span className={`${base} bg-red-100 text-red-700`}>Reject</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
}

/* MinistriesRequest component — inlined */
function MinistriesRequest({ data = MOCK_DATA }) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // for View modal

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((row) => {
      // Tab filtering
      if (activeTab !== "All") {
        if (activeTab === "Pending" && row.status !== "Pending") return false;
        if (activeTab === "Approved" && row.status !== "Approved") return false;
        if (activeTab === "Reject" && !/reject|rejected/i.test(row.status)) return false;
        if (activeTab === "Join Request" && row.type !== "Join Request") return false;
        if (activeTab === "Leave Request" && row.type !== "Leave Request") return false;
      }
      // Search filtering
      if (!q) return true;
      return (
        row.member.toLowerCase().includes(q) ||
        row.ministry.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q)
      );
    });
  }, [activeTab, query, data]);

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white border rounded-lg shadow-card p-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900">
            Ministries Request
          </h1>
          <p className="text-sm text-gray-500 mt-1">Lead and provide music for services.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow"
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
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
                    <td className="px-6 py-6 align-middle text-gray-800">{row.member}</td>
                    <td className="px-6 py-6 text-gray-600">{row.ministry}</td>
                    <td className="px-6 py-6 text-gray-600">{row.type}</td>
                    <td className="px-6 py-6">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-6">
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
                            // call api to approve when available
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
      </div>

      {/* Modal: View */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selected.member}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selected.ministry}</p>
                </div>
                <div>
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600 uppercase tracking-wide">Request Type</h3>
                  <p className="mt-1 text-gray-800">{selected.type}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 uppercase tracking-wide">Notes</h3>
                  <p className="mt-1 text-gray-800">{selected.notes}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-md text-sm border hover:bg-gray-50"
              >
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

/* ======================================================
  SystemManagementPage — main page that uses announcements
  and the inlined MinistriesRequest below it.
   ====================================================== */

export default function SystemManagementPage() {
  // announcement states
  const [announcementContent, setAnnouncementContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const handlePublishAnnouncement = async () => {
    try {
      // Example: call your API to publish
      // await api.post('/announcements', { content: announcementContent, audience: targetAudience })
      console.log("Announcement Published:", announcementContent, targetAudience);
      setAnnouncementContent("");
      setTargetAudience("");
      toast.success("Announcement published successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish announcement.");
    }
  };

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
          {/* Announcement Section */}
          <section className="bg-stone-100 rounded-xl border border-zinc-200 p-5 lg:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <img src={bell} alt="Bell Icon" className="h-5 w-5" />
                <h1 className="text-2xl md:text-[26px] font-semibold text-zinc-900">
                  System Management{" "}
                  <span className="font-guthen text-3xl tracking-wide text-stone-800">
                    Announcement
                  </span>
                </h1>
              </div>
              <p className="text-sm md:text-[14px] text-zinc-600 mt-2 max-w-3xl">
                Efficiently manage system-wide settings and announcements to keep every church informed
                and connected. Ensure important updates, news, and notifications are delivered
                seamlessly across the platform.
              </p>
            </div>

            {/* Announcement Management Section */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-zinc-900">Manage Announcements</h2>
                <button
                  className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                  onClick={() => toast.info("New Announcement functionality coming soon!")}
                >
                  + New Announcement
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="font-semibold">Announcement Content</label>
                  <textarea
                    className="w-full p-4 border rounded-md"
                    rows="5"
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    placeholder="Share important news, updates, or events..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold">Target Audience</label>
                  <input
                    className="w-full p-4 border rounded-md"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., All Church Admins, Specific Regional Admins"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePublishAnnouncement}
                    className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                  >
                    Publish Announcement
                  </button>
                  <button
                    onClick={() => {
                      setAnnouncementContent("");
                      setTargetAudience("");
                    }}
                    className="py-2 px-4 rounded-md border hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Ministries Request (combined below announcements) */}
          <section>
            <MinistriesRequest />
          </section>

          {/* Footer (optional) */}
          <footer className="mt-6">
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
}

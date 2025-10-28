// src/pages/super-admin/SystemManagementPage.jsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import TopNav from "../../components/Super-admin/TopNav";
import SideNav from "../../components/Super-admin/SideNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
import { api } from "../../lib/api"; // keep for later use
import bell from "../../assets/icons/bell.png";
import { useGlobalAnnouncement } from "../../lib/useGlobalAnnouncement";
const TABS = ["All", "Join Request", "Leave Request", "Pending", "Approved", "Reject"];

const MOCK_DATA = [
  { id: 1, member: "Kennedy", ministry: "Music Ministry", type: "Join Request", status: "Pending", notes: "Available Sundays. Prefers vocal section." },
  { id: 2, member: "Avril Joii", ministry: "Outreach Ministry", type: "Leave Request", status: "Pending", notes: "Moving out of town next month." },
  { id: 3, member: "Dambo", ministry: "Youth Ministry", type: "Join Request", status: "Approved", notes: "Completed orientation." },
  { id: 4, member: "Dambo", ministry: "Youth Ministry", type: "Join Request", status: "Approved", notes: "Already assisting weekly." },
  { id: 5, member: "Avril Joii", ministry: "Outreach Ministry", type: "Leave Request", status: "Pending", notes: "Requested leave for 3 months." },
];

function StatusBadge({ status }) {
  const base = "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium select-none";
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


export default function SystemManagementPage() {
  const [announcementContent, setAnnouncementContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  useGlobalAnnouncement();
 const handlePublishAnnouncement = async () => {
  try {
    const payload = {
      content: announcementContent.trim(),
      audience: (targetAudience || "all").trim().toLowerCase(), // "all" | "member" | "church-admin" | "superadmin"
    };
    if (!payload.content) return toast.error("Write an announcement first.");

    await api.post("/api/announcements", payload);
    toast.success("Announcement published! Live users are notified.");

    setAnnouncementContent("");
    setTargetAudience("");
  } catch (error) {
    console.error(error);
    toast.error("Failed to publish announcement.");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav — removed the extra header wrapper that was covering content */}
      <TopNav />

      {/* main wrapper with top padding to avoid nav overlap */}
      <div className="pt-16 flex flex-1">
        <aside className="hidden md:block w-64 shrink-0 border-r bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <SideNav />
        </aside>

        <main className="flex-1 p-6 lg:p-10 space-y-6">
          <section className="bg-stone-100 rounded-xl border border-zinc-200 p-5 lg:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <img src={bell} alt="Bell Icon" className="h-5 w-5" />
                <h1 className="text-2xl md:text-[26px] font-semibold text-zinc-900">
                  System Management <span className="font-guthen text-3xl tracking-wide text-stone-800">Announcement</span>
                </h1>
              </div>
              <p className="text-sm md:text-[14px] text-zinc-600 mt-2 max-w-3xl">
                Efficiently manage system-wide settings and announcements to keep every church informed and connected.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-zinc-900">Manage Announcements</h2>
                <button className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600" onClick={() => toast.info("New Announcement coming soon!")}>+ New Announcement</button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="font-semibold">Announcement Content</label>
                  <textarea className="w-full p-4 border rounded-md" rows="5" value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} placeholder="Share important news, updates, or events..." />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold">Target Audience</label>
                  <input className="w-full p-4 border rounded-md" type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., All Church Admins, Specific Regional Admins" />
                </div>

                <div className="flex gap-3">
                  <button onClick={handlePublishAnnouncement} className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600">Publish Announcement</button>
                  <button onClick={() => { setAnnouncementContent(""); setTargetAudience(""); }} className="py-2 px-4 rounded-md border hover:bg-gray-50">Reset</button>
                </div>
              </div>
            </div>
          </section>
          <section>
          </section>
          <footer className="mt-6">
          </footer>
        </main>
      </div>
    </div>
  );
}

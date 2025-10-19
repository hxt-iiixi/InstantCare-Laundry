import React, { useState } from "react";
import { toast } from "sonner";
import TopNav from "../../components/Super-admin/TopNav";
import SideNav from "../../components/Super-admin/SideNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
import { api } from "../../lib/api";

// Import your icon (bell.png or another relevant icon)
import bell from "../../assets/icons/bell.png"; 

export default function SystemManagementPage() {
  const [announcementContent, setAnnouncementContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const handlePublishAnnouncement = async () => {
    try {
      // Publish announcement logic
      console.log("Announcement Published:", announcementContent, targetAudience);
      toast.success("Announcement published successfully!");
    } catch (error) {
      toast.error("Failed to publish announcement.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="fixed inset-x-0 top-0 z-30 h-16 bg-white border-b">
        <TopNav />
      </header>

      <div className="pt-16 flex flex-1">
        <aside className="hidden md:block w-64 shrink-0 border-r bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <SideNav />
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <section className="bg-stone-100 rounded-xl border border-zinc-200 p-5 lg:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                {/* Bell Icon beside the System Management title */}
                <img src={bell} alt="Bell Icon" className="h-5 w-5" />
                <h1 className="text-2xl md:text-[26px] font-semibold text-zinc-900">
                  System Management{" "}
                  <span className="font-normal italic">Announcement</span>
                </h1>
              </div>
              <p className="text-sm md:text-[14px] text-zinc-600 mt-2 max-w-3xl">
                Efficiently manage system-wide settings and announcements to keep every church informed and connected. Ensure important updates, news, and notifications are delivered seamlessly across the platform.
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

                <button
                  onClick={handlePublishAnnouncement}
                  className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                >
                  Publish Announcement
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>


    </div>
  );
}

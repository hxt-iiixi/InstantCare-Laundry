import { useLocation } from "react-router-dom";
import { useGlobalAnnouncement } from "../../lib/useGlobalAnnouncement";
const MAP = {
  "/church-dash": "Admin Dashboard",
  "/parish-calendar": "Parish Calendar",
  "/ministry-monitoring": "Ministry Monitoring",
  "/parishioner-engagement": "Parishioner Engagement",
  "/daily-devotion": "Daily Devotion",
  "/user-roles": "Members/User Roles",
  "/settings": "Settings",
};

function toTitleCase(s) {
  return s.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getTitle(pathname) {
  // exact or prefix match
  for (const key of Object.keys(MAP)) {
    if (pathname === key || pathname.startsWith(key + "/")) return MAP[key];
  }
  // fallback: last segment → Title Case
  const seg = pathname.split("/").filter(Boolean).pop() || "Home";
  return toTitleCase(seg);
}

export default function AdminHeader({ className = "" }) {
  const { pathname } = useLocation();
  const title = getTitle(pathname);
  useGlobalAnnouncement();
  // Retrieve church name from localStorage
  const churchName = localStorage.getItem("churchName") || "St Joseph Parish";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="h-[64px] w-full px-4 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-2">
          <img src="/src/assets/icons/ampower.svg" alt="AmPower" className="h-15 w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 text-center">{title}</h1>

        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-slate-600">{churchName}</span> {/* Dynamically display church name */}
          <img src="/src/assets/images/profile.png" alt="Profile" className="h-9 w-9 rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
}

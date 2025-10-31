// src/pages/church-admin/AdminDashboard.jsx
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";
import { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Icon = ({ file, className = "h-4 w-4", alt = "" }) => (
  <img
    src={`/src/assets/icons/${file}.svg`}
    alt={alt || file}
    className={className}
    draggable="false"
  />
);

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-700">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- helpers to build monthly series from Mongo ObjectId timestamps ---
function objectIdToDate(id) {
  // first 8 hex chars are seconds since epoch
  const ts = parseInt(String(id).slice(0, 8), 16) * 1000;
  return new Date(ts);
}
function monthBucketsLastN(n = 6) {
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      start,
      end,
    });
  }
  return out;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    churchName: "",
    joinCode: null,
    totalParishioners: 0,
    activeMembers: 0,
    inactiveMembers: 0,
  });
  const [churchAppId, setChurchAppId] = useState(localStorage.getItem("churchAppId") || null);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);

  // NEW: raw members for chart
  const [members, setMembers] = useState([]);

  const ensureChurchId = async () => {
  const { data } = await api.get("/api/church-admin/mine", authHeaders());
  if (data?.id) {
    localStorage.setItem("churchAppId", data.id);
    if (churchAppId !== data.id) setChurchAppId(data.id);
    return data.id;
  }
  localStorage.removeItem("churchAppId");
  setChurchAppId(null);
  return null;
};

  const loadStats = async () => {
    const id = await ensureChurchId();
    const { data } = await api.get(`/api/church-admin/applications/${id}/stats`, authHeaders());
    setStats((s) => ({ ...s, ...data }));
  };

  const loadUpcomingEvents = async () => {
    const id = await ensureChurchId();
    const { data: evts = [] } = await api.get("/api/events", {
      ...authHeaders(),
      params: { churchId: id },
    });
    const now = new Date();
    setUpcomingEventsCount(evts.filter((e) => e?.date && new Date(e.date) > now).length);
  };

  // NEW: members fetch (needs created time; we’ll derive from ObjectId)
  const loadMembers = async () => {
    const id = await ensureChurchId();
    const { data } = await api.get("/api/church-admin/members", {
      ...authHeaders(),
      params: { churchId: id },
    });
    setMembers(data?.users || []);
  };

  const handleGenerateCode = async () => {
    if (stats.joinCode) return;
    const id = await ensureChurchId();
    await api.post(`/api/church-admin/applications/${id}/join-code`, {}, authHeaders());
    await loadStats();
  };

  useEffect(() => {
    (async () => {
      await loadStats();
      await loadUpcomingEvents();
      await loadMembers(); // ← pull members for chart
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build 6-month chart data dynamically from members
  const chartData = useMemo(() => {
    const buckets = monthBucketsLastN(6);
    const actives = members.filter((m) => m?.status === "active");

    return buckets.map((b) => {
      // New members this month (by ObjectId timestamp)
      const newlyJoined =
        members.filter((m) => {
          const created = objectIdToDate(m?._id);
          return created >= b.start && created <= b.end;
        }).length || 0;

      // Active-to-date headcount by month-end (approx: active now & joined on/before end)
      const activeToDate =
        actives.filter((m) => objectIdToDate(m?._id) <= b.end).length || 0;

      return {
        month: b.label,
        New: newlyJoined,
        Active: activeToDate,
      };
    });
  }, [members]);

  const Header = (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-slate-900">
        Welcome, <span className="font-semibold">{stats.churchName || "Your Parish"}</span>!
      </h2>
      <div className="flex items-center gap-3">
        {stats.joinCode && (
          <span className="rounded-md bg-white border border-slate-200 px-3 py-2 text-sm font-semibold tracking-widest">
            Code: <span className="text-orange-600">{stats.joinCode}</span>
          </span>
        )}
        <button
          onClick={stats.joinCode ? undefined : handleGenerateCode}
          disabled={Boolean(stats.joinCode)}
          className={`inline-flex items-center gap-2 rounded-md text-white text-sm font-medium px-3.5 py-2 shadow-sm
            ${stats.joinCode ? "bg-slate-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
          title={stats.joinCode ? "A code has already been generated for this church." : "Generate a join code"}
        >
          <Icon file={stats.joinCode ? "check" : "plus"} className="h-4 w-4" />
          {stats.joinCode ? "Code Generated" : "Generate Code"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" title="Admin Dashboard" />
      <main className="pl-[232px] pt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
          {Header}

          {/* KPI cards — 2 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Total Parishioners</div>
                <Icon file="kpi-dots" className="h-4 w-4 opacity-60" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-orange-500">
                {stats.totalParishioners ?? 0}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Upcoming Events</div>
                <Icon file="kpi-dots" className="h-4 w-4 opacity-60" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-orange-500">
                {upcomingEventsCount}
              </div>
            </div>
          </div>

          {/* Dynamic Recharts line chart — full width */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-slate-800 font-medium">Parishioner Growth</div>
            <div className="text-xs text-slate-500 mt-0.5">
              New and active parishioners over the last 6 months.
            </div>

            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="New"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Active"
                    stroke="#0F172A"
                    strokeOpacity={0.7}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* legend badges to match your style (optional) */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                New Parishioners
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-700" />
                Active Parishioners
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

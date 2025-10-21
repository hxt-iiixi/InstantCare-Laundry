// src/pages/church-admin/AdminDashboard.jsx
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";

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

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      {/* Full-width fixed header */}
      <AdminHeader className="pl-[232px]" title="Admin Dashboard" />

      {/* Content offset for sidebar & header */}
      <main className="pl-[232px] pt-[64px]">
        <div className="max-w-7xl mx-auto w-full px-6 py-6">
          {/* Top row: welcome + button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome, <span className="font-semibold">St. Joseph Parish</span>!
            </h2>

            <button className="inline-flex items-center gap-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3.5 py-2 shadow-sm">
              <Icon file="plus" className="h-4 w-4" /> Generate Code
            </button>
          </div>

          {/* KPI cards */}
          <div className="mt-5 grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Total Parishioners</div>
                  <Icon file="kpi-dots" className="h-4 w-4 opacity-60" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-orange-500">0</div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Active Members</div>
                  <Icon file="kpi-dots" className="h-4 w-4 opacity-60" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-orange-500">0</div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Upcoming Events</div>
                  <Icon file="kpi-dots" className="h-4 w-4 opacity-60" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-orange-500">0</div>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className="mt-6 grid grid-cols-12 gap-5">
            {/* Parishioner Growth */}
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-slate-800 font-medium">Parishioner Growth</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  New and active parishioners over the last 6 months.
                </div>

                {/* Safe SVG line chart placeholder */}
                <div className="mt-4 h-[220px] rounded-lg bg-white border border-slate-100 relative">
                  {/* faint horizontal grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-t border-slate-100"
                      style={{ top: `${(i + 1) * 36}px` }}
                    />
                  ))}

                  <svg viewBox="0 0 600 220" className="absolute inset-0">
                    {/* Active Parishioners (dark line) */}
                    <path
                      d="M20,140 C120,130 200,120 300,115 C400,110 500,95 580,85"
                      fill="none"
                      stroke="#0F172A"
                      strokeOpacity="0.28"
                      strokeWidth="2"
                    />
                    {/* New Parishioners (orange line) */}
                    <path
                      d="M20,190 C160,188 330,184 580,182"
                      fill="none"
                      stroke="#F97316"
                      strokeOpacity="0.85"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* x labels */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-[11px] text-slate-500">
                    <span>Jan</span><span>Feb</span><span>Mar</span>
                    <span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>

                {/* legend */}
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

     
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-slate-800 font-medium">Ministry Engagement</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Distribution of activity across ministries.
                </div>

                <div className="mt-2 flex items-center gap-6">
            
                  <div className="relative h-[220px] w-[220px]">
                    <svg viewBox="0 0 220 220" className="h-full w-full">
                      <circle cx="110" cy="110" r="80" stroke="#F59E0B" strokeWidth="28" fill="none" strokeDasharray="140 400" strokeLinecap="round"/>
                      <circle cx="110" cy="110" r="80" stroke="#FB7185" strokeWidth="28" fill="none" strokeDasharray="90 400" strokeDashoffset="-150" strokeLinecap="round"/>
                      <circle cx="110" cy="110" r="80" stroke="#C084FC" strokeWidth="28" fill="none" strokeDasharray="70 400" strokeDashoffset="-240" strokeLinecap="round"/>
                      <circle cx="110" cy="110" r="80" stroke="#34D399" strokeWidth="28" fill="none" strokeDasharray="50 400" strokeDashoffset="-310" strokeLinecap="round"/>
                      <circle cx="110" cy="110" r="52" fill="#FFFFFF"/>
                    </svg>
                  </div>

                 
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <LegendDot color="bg-orange-500"  label="Worship Ministry" />
                    <LegendDot color="bg-pink-500"    label="Outreach Programs" />
                    <LegendDot color="bg-purple-400"  label="Education & Formation" />
                    <LegendDot color="bg-emerald-400" label="Youth & Children" />
                    <LegendDot color="bg-slate-700"   label="Pastoral Care" />
                    <LegendDot color="bg-amber-600"   label="Administration" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

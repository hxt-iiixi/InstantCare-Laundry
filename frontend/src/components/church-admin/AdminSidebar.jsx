import { NavLink, Link } from "react-router-dom";

const itemBase =
  "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[15px] transition";
const idle = "text-slate-600 hover:text-orange-600 hover:bg-orange-50";
const active = "bg-orange-100 text-orange-700 font-semibold";

export default function AdminSidebar() {
  return (
    // Sidebar now sits *below* the header height (64px)
    <aside className="fixed left-0 top-[64px] z-30 h-[calc(100vh-64px)] w-[232px] bg-white border-r border-slate-200">
      
      
      
      <nav className="px-3 py-4 space-y-1">
        <NavLink
          to="/church-dash"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
          {/* Left-side icon */}
           <img
            src="/src/assets/icons/system.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Admin Dashboard
        </NavLink>

        <NavLink
          to="/parish-calendar"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
          {/* Left-side icon */}
           <img
            src="/src/assets/icons/calendar.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Parish Calendar
        </NavLink>
 
        <NavLink
          to="/ministry-monitoring"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
             <img
            src="/src/assets/icons/hands.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Ministry Monitoring
        </NavLink>

        <NavLink
          to="/parishioner-engagement"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
             <img
            src="/src/assets/icons/heart.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Parishioner Engagement
        </NavLink>

        <NavLink
          to="/daily-devotion"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
             <img
            src="/src/assets/icons/book.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Daily Devotion
        </NavLink>

        <NavLink
          to="/user-roles"
          className={({ isActive }) => `${itemBase} ${isActive ? active : idle}`}
        >
             <img
            src="/src/assets/icons/user.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          User Roles
        </NavLink>
      </nav>

      <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
        <Link
          to="/settings"
          className="flex items-center gap-2 text-slate-600 hover:text-orange-600 text-[15px] px-3 py-2 rounded-lg hover:bg-orange-50"
        >
             <img
            src="/src/assets/icons/system.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Settings
        </Link>

        <button className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-[#D33131] text-[#FFFFFF] hover:bg-red-100 py-2 text-[15px]">
             <img
            src="/src/assets/icons/logout.svg"
            alt="AmPower"
            className="h-[20px] w-[20px]"
          />
          Logout
        </button>
      </div>
    </aside>
  );
}

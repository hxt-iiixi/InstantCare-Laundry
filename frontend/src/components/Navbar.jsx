import { NavLink } from "react-router-dom";
import logo from "../assets/icons/ampower.svg"; // ✅ import from src

const linkBase = "px-4 py-2 text-sm md:text-base text-gray-300 hover:text-white transition-colors";
const linkActive = "text-white border-b-2 border-white";

export default function Navbar() {
  return (
    <header className="bg-black text-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 md:h-16 grid grid-cols-3 items-center">
          <div className="flex items-center">
            <img src={logo} alt="AmPower!" className="h-7 md:h-8 w-auto" />
          </div>

          <div className="hidden md:flex items-center justify-center gap-1">
            {[
              ["Home", "/Home"], ["About", "/about"], ["Events", "/events"],
              ["Contact", "/contact"], ["Calendar", "/calendar"],
            ].map(([label, to]) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div />
        </div>
      </nav>
    </header>
  );
}

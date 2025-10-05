import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/ampower.svg";

export default function Navbar() {
  return (
    <header className="w-full bg-[#FBF7F3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-5">
          {/* Left: Logo (bigger) */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="AmPower!"
              className="h-10 md:h-15 lg:h-20 w-auto"  
            />
          </Link>

          {/* Center: Nav */}
          <nav className="flex items-center justify-center gap-8 text-[17px]">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "font-semibold text-black" : "text-zinc-600 hover:text-black"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: CTAs */}
          <div className="flex items-center justify-end gap-3">
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:shadow"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl bg-[#FF7A2F] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import logo from "/src/assets/icons/ampower.svg";

export default function Navbar() {
  const prefersReduce = useReducedMotion();

  const row = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: -10, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 0.82, 0.2, 1] } },
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <motion.header
        className="w-full bg-[#FBF7F3]"
        variants={row}
        initial="hidden"
        animate="show"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center py-5">
            {/* Left: Logo */}
            <motion.div variants={item}>
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="AmPower!" className="h-10 lg:h-16 w-auto" />
              </Link>
            </motion.div>

            {/* Center: Nav */}
            <motion.nav
              className="flex items-center justify-center gap-8 text-[17px]"
              variants={row}
            >
              {links.map((itemDef) => (
                <motion.div key={itemDef.to} variants={item}>
                  <NavLink
                    to={itemDef.to}
                    className={({ isActive }) =>
                      `relative pb-1 transition-colors ${
                        isActive ? "font-semibold text-black" : "text-zinc-600 hover:text-black"
                      }`
                    }
                  >
                    {itemDef.label}
                    {/* active underline */}
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded bg-black/80 opacity-0 data-[active=true]:opacity-100 transition"
                          data-active={location.pathname === itemDef.to} />
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            {/* Right: CTAs */}
            <motion.div className="flex items-center justify-end gap-3" variants={row}>
              <motion.div variants={item}>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-black/5 hover:shadow"
                >
                  Log In
                </Link>
              </motion.div>
              <motion.div variants={item}>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-xl bg-[#FF7A2F] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition"
                >
                  Join Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>
    </MotionConfig>
  );
}

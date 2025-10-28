import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import logo from "/src/assets/icons/ampower.svg";
import { FaCaretDown } from 'react-icons/fa'; // Dropdown icon
import userAvatar from "/src/assets/images/user-avatar.png"; // Sample avatar image
import { toast } from "sonner";


function getDisplayNameFromStorage() {
  return (
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    (localStorage.getItem("prefillEmail") || localStorage.getItem("email") || "").split("@")[0] ||
    "User"
  );
}
function getAvatarFromStorage(defaultAvatar) {
  return localStorage.getItem("avatar") || defaultAvatar;
}



export default function NavbarAndHero() {
  const prefersReduce = useReducedMotion();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);  // To toggle the dropdown menu
  const [userName, setUserName] = useState(() => getDisplayNameFromStorage());
  const [avatar, setAvatar]   = useState(() => getAvatarFromStorage(userAvatar));

  useEffect(() => {
  const refreshFromStorage = () => {
    setUserName(getDisplayNameFromStorage());
    setAvatar(getAvatarFromStorage(userAvatar));
  };

  // will NOT fire in same tab — but keep for multi-tab updates
  window.addEventListener("storage", refreshFromStorage);
  // custom event we’ll dispatch after login/logout
  window.addEventListener("auth:update", refreshFromStorage);

  // also refresh once on mount (in case localStorage was set just before)
  refreshFromStorage();

  return () => {
    window.removeEventListener("storage", refreshFromStorage);
    window.removeEventListener("auth:update", refreshFromStorage);
  };
}, []);

  const row = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: -10, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.22, 0.82, 0.2, 1] },
    },
  };

  const links = [
    { to: "/memberdash", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/events", label: "Events" },
    { to: "/contact", label: "Contact" },
    { to: "/calendar", label: "Calendar" },
    { to: "/church", label: "My Church" },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("avatar");
    localStorage.removeItem("churchName"); // Also clear church name if stored
    window.dispatchEvent(new Event("auth:update"));
    // Show toast and redirect to login page
    toast.success("You have logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      {/* Navbar Section */}
      <motion.header
        className="w-full bg-[#FBF7F3] shadow-md z-[9999]"  // Ensure the navbar has a higher z-index
        variants={row}
        initial="hidden"
        animate="show"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center py-5">
            {/* Left: Logo */}
            <motion.div variants={item}>
              <Link to="/memberdash" className="flex items-center gap-2">
                <img src={logo} alt="AmPower!" className="h-10 lg:h-16 w-auto" />
              </Link>
            </motion.div>

            {/* Center: Nav */}
            <motion.nav className="flex items-center justify-center gap-8 text-[17px]" variants={row}>
              {links.map((itemDef) => (
                <motion.div key={itemDef.to} variants={item}>
                  <NavLink
                    to={itemDef.to}
                    className={({ isActive }) =>
                      `relative pb-1 transition-colors whitespace-nowrap ${
                        isActive ? "font-semibold text-black" : "text-zinc-600 hover:text-black "
                      }`
                    }
                  >
                    {itemDef.label}
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded bg-black/80 opacity-0 data-[active=true]:opacity-100 transition" data-active={location.pathname === itemDef.to} />
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            {/* Right: Profile Avatar and Dropdown */}
            <motion.div className="flex items-center justify-end gap-3" variants={row}>
              {/* User Avatar */}
              <motion.div variants={item} className="relative z-[10001]">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}  // Toggle dropdown
                  className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm ring-1 ring-black/5"
                >
                  <img src={avatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                  <span className="text-sm text-black">{userName}</span>
                  <FaCaretDown className="text-sm text-gray-500" />
                </button>
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white shadow-lg rounded-lg border ring-1 ring-black/10 z-[10000]">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100 z-9999">Profile</Link>
                    <button
                      onClick={handleLogout} // Call logout function on button click
                      className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-x-visible overflow-y-visible bg-[#FBF7F3] pb-56 lg:pb-64 z-[1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pl-14 xl:pl-24 pt-10 lg:pt-14 z-0">
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="relative lg:col-span-6 lg:translate-x-4">
              <motion.img
                src="/src/assets/icons/cross.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute z-30 top-0 transform-gpu
                  left-[-120px] sm:left-[-100px] lg:left-[-58px] xl:left-[-190px] 2xl:left-[-220px]
                  h-56 sm:h-64 lg:h-72 xl:h-80 w-auto sm:scale-100 scale-[0.92]"
                style={{ willChange: "transform" }}
                animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                transition={{ y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" } }}
              />

              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
              >
                <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[52px] font-black tracking-tight text-black">
                  <motion.span className="block" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } } }}>Empowering Faith,</motion.span>
                  <motion.span className="block" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } } }}>Building Community,</motion.span>
                  <motion.span className="block" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } } }}>Lead with Clarity.</motion.span>
                </h1>

                <motion.p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-zinc-700" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } } }}>
                  A place where faith grows, community flourishes, and lives are touched by God’s love. Join us in worship, service, and fellowship as we walk together and shine His light.
                </motion.p>

                <motion.div className="mt-8" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } } }}>
                  <Link
                    to="/join"
                    className="inline-flex items-center rounded-xl bg-[#FF7A2F] px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    Join Now
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <div className="relative lg:col-span-6">
              <motion.img
                src="/src/assets/icons/family-church.svg"
                alt="Family walking from church"
                className="ml-auto h-auto w-full max-w-[460px] lg:max-w-[500px] relative z-0"
                variants={{ hidden: { opacity: 0, x: 24, y: 8, scale: 0.98 }, show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1], delay: 0.15 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                style={{ willChange: "transform" }}
              />
            </div>
          </div>
        </div>

        <motion.img
          src="/src/assets/icons/arrow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute z-20 transform-gpu w-[520px] max-w-[78vw] h-auto left-[28%] sm:left-[30%] lg:left-[32%] bottom-0 sm:bottom-2 lg:bottom-4"
          style={{ willChange: "transform" }}
          animate={{ y: [0, -8, 0], rotate: [0, -0.6, 0] }}
          transition={{ y: { duration: 9, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
        />
      </section>
    </MotionConfig>
  );
}

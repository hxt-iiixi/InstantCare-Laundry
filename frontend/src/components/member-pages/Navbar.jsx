  import React, { useState, useEffect } from "react";
  import { Link, NavLink, useNavigate } from "react-router-dom";
  import { motion, MotionConfig, useReducedMotion } from "framer-motion";
  import logo from "/src/assets/icons/ampower.svg";
  import { FaCaretDown } from 'react-icons/fa'; // Dropdown icon
  import userAvatar from "/src/assets/images/user-avatar.png"; // Sample avatar image
  import { toast } from "sonner";
  import { api } from "../../lib/api";
import { useGlobalAnnouncement } from "../../lib/useGlobalAnnouncement";

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
    useGlobalAnnouncement();
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
   
      { to: "/MembersContact", label: "Contact" },
      { to: "/church", label: "My Church" },
    ];

   const handleLogout = () => {
  // Close dropdown
  setDropdownOpen(false);

  // Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("avatar");
  localStorage.removeItem("churchName");
    window.dispatchEvent(new Event("auth:update"));
  // 🔑 Clear axios auth header so future calls are truly logged-out
  if (api?.defaults?.headers?.common) {
    delete api.defaults.headers.common.Authorization;
  }

  // Update local UI immediately (no refresh needed)
  setUserName("User");
  setAvatar(userAvatar);

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
                              isActive ? "font-semibold text-black" : "text-zinc-600 hover:text-black"
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
          </MotionConfig>
    );
  }

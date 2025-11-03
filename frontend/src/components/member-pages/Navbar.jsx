import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import logo from "/src/assets/icons/ampower.svg";
import { FaCaretDown } from "react-icons/fa";
import userAvatar from "/src/assets/images/user (3).png";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useGlobalAnnouncement } from "../../lib/useGlobalAnnouncement";

function getDisplayNameFromStorage() {
  return (
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    (localStorage.getItem("prefillEmail") || localStorage.getItem("email") || "")
      .split("@")[0] ||
    "User"
  );
}
function getAvatarFromStorage(defaultAvatar) {
  return localStorage.getItem("avatar") || defaultAvatar;
}
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function NavbarAndHero() {
  const prefersReduce = useReducedMotion();
  const navigate = useNavigate();
  useGlobalAnnouncement();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(() => getDisplayNameFromStorage());
  const [avatar, setAvatar] = useState(() => getAvatarFromStorage(userAvatar));

  // ——— Hydrate from API so we always have the latest avatar/name
  const hydrateFromAPI = async () => {
    try {
      const { data } = await api.get("/api/members/me/profile", {
        headers: authHeaders(),
      });
      const u = data?.user || {};
      if (u?.name) {
        localStorage.setItem("name", u.name);
        setUserName(
          u.name ||
            getDisplayNameFromStorage() // fallback
        );
      }
      if (u?.avatar) {
        localStorage.setItem("avatar", u.avatar);
        setAvatar(u.avatar);
      }
    } catch {
      // silent: user may be logged out or endpoint not available yet
    }
  };

  useEffect(() => {
    // make sure axios has the latest token header (optional)
    const token = localStorage.getItem("token");
    if (token && api?.defaults?.headers?.common) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    const refreshFromStorage = () => {
      setUserName(getDisplayNameFromStorage());
      setAvatar(getAvatarFromStorage(userAvatar));
    };

    // Initial pass
    refreshFromStorage();
    hydrateFromAPI();

    // Intra-tab custom events you can dispatch after profile changes
    const refetch = () => {
      refreshFromStorage();
      hydrateFromAPI();
    };

    window.addEventListener("storage", refreshFromStorage); // other tabs
    window.addEventListener("auth:update", refetch);
    window.addEventListener("profile:update", refetch);
    window.addEventListener("avatar:update", refetch);

    return () => {
      window.removeEventListener("storage", refreshFromStorage);
      window.removeEventListener("auth:update", refetch);
      window.removeEventListener("profile:update", refetch);
      window.removeEventListener("avatar:update", refetch);
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
    setDropdownOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("avatar");
    localStorage.removeItem("churchName");

    // Let other components refresh immediately
    window.dispatchEvent(new Event("auth:update"));

    if (api?.defaults?.headers?.common) {
      delete api.defaults.headers.common.Authorization;
    }

    setUserName("User");
    setAvatar(userAvatar);

    toast.success("You have logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      {/* Navbar Section */}
      <motion.header
        className="w-full bg-[#FBF7F3] shadow-md z-[9999]"
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
            <motion.nav
              className="flex items-center justify-center gap-8 text-[17px]"
              variants={row}
            >
              {links.map((itemDef) => (
                <motion.div key={itemDef.to} variants={item}>
                  <NavLink
                    to={itemDef.to}
                    className={({ isActive }) =>
                      `relative pb-1 transition-colors whitespace-nowrap ${
                        isActive
                          ? "font-semibold text-black"
                          : "text-zinc-600 hover:text-black"
                      }`
                    }
                  >
                    {itemDef.label}
                    <span
                      className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded bg-black/80 opacity-0 data-[active=true]:opacity-100 transition"
                      data-active={location.pathname === itemDef.to}
                    />
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            {/* Right: Profile Avatar and Dropdown */}
            <motion.div className="flex items-center justify-end gap-3" variants={row}>
              <motion.div variants={item} className="relative z-[10001]">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm ring-1 ring-black/5"
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = userAvatar;
                      // if the stored URL is broken, clear it so we don't keep reloading
                      if (localStorage.getItem("avatar")) {
                        localStorage.removeItem("avatar");
                      }
                    }}
                  />
                  <span className="text-sm text-black">{userName}</span>
                  <FaCaretDown className="text-sm text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white shadow-lg rounded-lg border ring-1 ring-black/10 z-[10000]">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100 z-9999"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
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

// src/pages/auth/RoleSelectPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "/src/components/Navbar";
import LeadershipTeam from "/src/components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "/src/components/Home-Page/ChurchInfoFooter";

import leftDecor from "/src/assets/icons/cross.png";
import rightDecor from "/src/assets/icons/family-church.svg";
import heroIllustration from "/src/assets/images/signup-choir-illustration.png";

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // "member" | "church-admin"
  const [error, setError] = useState("");

  const handleStart = (e) => {
    e.preventDefault();
    if (!role) return setError("Please choose a role to continue.");

    // 👉 route mapping
    const routes = {
      member: "/register/member",           // create this page if you haven't yet
      "church-admin": "/register/church-admin", // already created in previous step
    };

    navigate(routes[role]);
  };

  return (
    <>
      <Navbar />
      <section className="relative bg-[#F7F3EF] overflow-hidden">
        <div className="h-16 sm:h-20" aria-hidden />

        {/* Decorative images (same as Register page) */}
        <img
          src={leftDecor}
          alt=""
          className="pointer-events-none select-none hidden md:block absolute left-8 md:left-10 lg:left-16 top-24 md:top-28 lg:top-32 md:h-56 lg:h-72 xl:h-80 w-auto opacity-90 drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]"
          draggable="false"
        />
        <img
          src={rightDecor}
          alt=""
          className="pointer-events-none select-none hidden md:block absolute right-6 md:right-10 lg:right-16 top-40 md:top-44 lg:top-48 md:h-64 lg:h-80 xl:h-[360px] 2xl:h-[420px] w-auto opacity-90 drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]"
          draggable="false"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="mx-auto w-full rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Illustration */}
              <div className="relative p-8 sm:p-10 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-[420px]">
                  <div className="absolute inset-0 -z-10 mx-auto my-auto h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-[#F7F3EF]" />
                  <img
                    src={heroIllustration}
                    alt=""
                    className="relative mx-auto block h-64 sm:h-72 w-auto object-contain"
                    draggable="false"
                  />
                </div>
              </div>

              {/* Right: Role select */}
              <div className="border-t md:border-t-0 md:border-l border-black/5 p-8 sm:p-10 md:p-12">
                <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[#1F2937]">
                  Sign Up
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Join AmPower and strengthen your ministry.
                </p>

                <form onSubmit={handleStart} className="mt-6 space-y-5">
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Role Selection
                    </span>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value);
                          if (error) setError("");
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent appearance-none"
                        aria-label="Choose your role"
                      >
                        <option value="" disabled>
                          What is your role?
                        </option>
                        <option value="member">Parishioner/Member</option>
                        <option value="church-admin">Church/Clergy Admin</option>
                      </select>

                      {/* caret icon via CSS */}
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ▾
                      </span>
                    </div>
                  </label>

                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!role}
                    className="w-full rounded-md bg-[#F28C52] py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition disabled:opacity-60"
                  >
                    Start
                  </button>
                </form>

                <p className="text-center mt-4 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#F28C52] hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <LeadershipTeam />
      <ChurchInfoFooter />
    </>
  );
};

export default RoleSelectPage;

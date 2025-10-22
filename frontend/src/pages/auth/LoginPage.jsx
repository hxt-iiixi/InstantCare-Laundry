// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { getDefaultRouteByRole } from "../../utils/auth.js";

import leftDecor from "/src/assets/icons/cross.png";
import rightDecor from "/src/assets/icons/family-church.svg";
import heroIllustration from "/src/assets/images/login-illustration.png";

import iconMail from "/src/assets/icons/Mail.png";
import iconLock from "/src/assets/icons/Lock.png";

import LeadershipTeam from "../../components/Home-Page/LeadershipTeam.jsx";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter.jsx";
import Navbar from "../../components/Navbar";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Toast if redirected from register
  useEffect(() => {
    if (location.state?.fromRegister) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post("http://localhost:4000/api/login", { email, password });

    // Save token, role, name, and church name in localStorage
    localStorage.setItem("token", data.token);
    if (data?.user?.role) localStorage.setItem("role", data.user.role);
    if (data?.user?.name) localStorage.setItem("name", data.user.name);  // Save user name
    if (data?.user?.churchName) localStorage.setItem("churchName", data.user.churchName);  // Save church name for church admins

    // Route by role
    const dest = getDefaultRouteByRole(data?.user?.role);
    toast.success("Welcome back!");
    navigate(dest, { replace: true });
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";

    if (status === 403 && err?.response?.data?.code === "UNDER_REVIEW") {
      setError("");
      toast.info("Your church admin application is under review. We’ll email you once it’s approved.");
      return;
    }

    if (status === 403 && msg.toLowerCase().includes("verify your email")) {
      setError("");
      toast.info("Please verify your email first. We’ve sent you a verification code.");
      return;
    }

    setError(msg);
  }
};
  return (
    <>
      <Navbar />
      {/* ===== Login Section ===== */}
      <section className="relative bg-[#F7F3EF] overflow-hidden">
        <div className="h-16 sm:h-20" aria-hidden />

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
                <div className="relative w-full max-w-[460px]">
                  <div className="absolute inset-0 -z-10 mx-auto my-auto h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-[#F7F3EF]" />
                  <img
                    src={heroIllustration}
                    alt=""
                    className="relative mx-auto block h-64 sm:h-72 w-auto object-contain"
                    draggable="false"
                  />
                </div>
              </div>

              {/* Right: Form */}
              <div className="border-t md:border-t-0 md:border-l border-black/5 p-8 sm:p-10 md:p-12">
                <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[#1F2937]">Log In</h1>
                <p className="mt-1 text-sm text-[#6B7280]">Reconnect with your ministry and stay empowered.</p>

                {showToast && (
                  <div className="mt-4 rounded-md bg-green-500/10 text-green-700 border border-green-200 px-3 py-2 text-sm">
                    Account created successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Email */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">Email Address</span>
                    <div className="relative">
                      <img
                        src={iconMail}
                        alt=""
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  {/* Password */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">Password</span>
                    <div className="relative">
                      <img
                        src={iconLock}
                        alt=""
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                  {/* Actions row */}
                  <div className="flex items-center justify-between text-xs">
                    <label className="inline-flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="accent-[#F28C52]"
                      />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forget-password" className="text-[#6B7280] hover:text-[#F28C52]">
                      Forgot Password
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full rounded-md bg-[#F28C52] py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition"
                  >
                    Login
                  </button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="w-full">
                  <GoogleLogin
                    onSuccess={async (res) => {
                      try {
                        const credential = res?.credential;
                        const { data } = await api.post("/api/auth/google/login", { credential });

                        // Save token + role
                        localStorage.setItem("token", data.token);
                        
                        if (data?.user?.role) localStorage.setItem("role", data.user.role);
                        if (data?.user?.name) localStorage.setItem("name", data.user.name);  
                        if (data?.user?.email) localStorage.setItem("prefillEmail", data.user.email);

                        toast.success("Welcome back!");
                        const dest = getDefaultRouteByRole(data?.user?.role);
                        navigate(dest, { replace: true });
                      } catch (e) {
                        const status = e?.response?.status;
                        const code = e?.response?.data?.code;
                        const msg = e?.response?.data?.message;

                        if (status === 403 && code === "UNDER_REVIEW") {
                          toast.info(
                            "Your church admin application is under review. We’ll email you once it’s approved."
                          );
                          return;
                        }
                        if (status === 404) {
                          toast.error("No account found for this Google email. Please register first.");
                          navigate("/register", { replace: true });
                          return;
                        }
                        if (status === 401) {
                          toast.error("Google sign-in failed. Check OAuth Client ID and authorized origins.");
                          return;
                        }
                        toast.error(msg || "Google sign-in failed.");
                      }
                    }}
                    onError={() => toast.error("Google sign-in cancelled")}
                    ux_mode="popup"
                    text="continue_with"
                    shape="pill"
                    size="large"
                  />
                </div>

                <p className="text-center mt-4 text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-[#F28C52] hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Follow-up sections */}
      <LeadershipTeam />
      <ChurchInfoFooter />
    </>
  );
};

export default LoginPage;

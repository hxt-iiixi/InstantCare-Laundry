// pages/RegisterPage.jsx
import React, { useState } from "react";
import { api } from "../../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GoogleButton from "../../components/GoogleButton.jsx";


import leftDecor from "/src/assets/icons/cross.png";
import rightDecor from "/src/assets/icons/family-church.svg";
import heroIllustration from "/src/assets/images/signup-choir-illustration.png";


import iconMail from "/src/assets/icons/Mail.png";
import iconLock from "/src/assets/icons/Lock.png";
import iconChevron from "/src/assets/icons/chevron-down.png";


import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import Navbar from "../../components/Navbar";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [churchCode, setChurchCode] = useState("");
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    await api.post("http://localhost:4000/api/register", {
      username,
      email,
      password,
      churchCode, // REQUIRED now
    });
    navigate("/verify-otp-registration", { state: { email, role: "member" } });
  } catch (err) {
    setError(err?.response?.data?.message || "Something went wrong!");
  }
};

const handleVerify = async () => {
  if (!otp.trim() || otp.length < 4) return toast.error("Enter the OTP code.");
  setLoading(true);
  try {
    // Use the registration OTP verification route here
    await api.post("/api/verify-otp-registration", { email: emailState, otp });
    toast.success("OTP verified successfully.");
    navigate("/dashboard", { replace: true }); // Navigate to dashboard after successful verification
  } catch (err) {
    toast.error(err?.response?.data?.message || "OTP verification failed.");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <>
      <Navbar />
        <section className="relative bg-[#F7F3EF] overflow-hidden">
        {/* top nav gap if you have a fixed navbar */}
        <div className="h-16 sm:h-20" aria-hidden />

        {/* LEFT: Cross — bigger, with soft shadow */}
        <img
          src={leftDecor}
          alt=""
          className="
            pointer-events-none select-none hidden md:block
            absolute left-8 md:left-10 lg:left-16
            top-24 md:top-28 lg:top-32
            md:h-56 lg:h-72 xl:h-80 w-auto
            opacity-90
            drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]
          "
          draggable="false"
        />

        {/* RIGHT: Family — bigger, nudged outward so it breathes like the mock */}
        <img
          src={rightDecor}
          alt=""
          className="
            pointer-events-none select-none hidden md:block
            absolute
            right-6 md:right-10 lg:right-16   /* more left than before */
            top-40 md:top-44 lg:top-48
            md:h-64 lg:h-80 xl:h-[360px] 2xl:h-[420px]  /* bigger */
            w-auto
            opacity-90
            drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]
          "
          draggable="false"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20"
        >
          {/* elevated white card */}
          <div className="mx-auto w-full rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Illustration */}
              <div className="relative p-8 sm:p-10 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-[420px]">
                  {/* faint circle behind illustration */}
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
                <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[#1F2937]">
                  Parishioner/Member
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Join AmPower and strengthen your ministry.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Full Name */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Full Name
                    </span>
                    <div className="relative">
                     
                      <input
                        type="text"
                        placeholder="Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  {/* Email */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Email Address
                    </span>
                    <div className="relative">
                      <img src={iconMail} alt="" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
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
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Password
                    </span>
                    <div className="relative">
                      <img src={iconLock} alt="" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  {/* Confirm Password */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Confirm Password
                    </span>
                    <div className="relative">
                      <img src={iconLock} alt="" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Church Join Code
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., 7GQ4KZ"
                        value={churchCode}
                        onChange={(e) => setChurchCode(e.target.value.toUpperCase())}
                        required
                        className="w-full rounded-md border border-gray-300 pl-3 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent tracking-widest uppercase"
                      />
                    </div>
                    <span className="text-[11px] text-gray-500">
                      Ask your church admin for this 6-character code.
                    </span>
                  </label>
                 
                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-md bg-[#F28C52] py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition"
                  >
                    Create Account
                  </button>
                </form>

            

                {/* Google OAuth button (unchanged behavior) */}
                

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

      {/* ===== Next Sections (you said these are ready) ===== */}
      <LeadershipTeam />
      <ChurchInfoFooter />
    </>
  );
};

export default RegisterPage;

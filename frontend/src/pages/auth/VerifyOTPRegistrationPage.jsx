// src/pages/auth/VerifyOTPRegistrationPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "/src/lib/api";

// Shared UI bits
import Navbar from "/src/components/Navbar";
import LeadershipTeam from "/src/components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "/src/components/Home-Page/ChurchInfoFooter";

// Decorations & art (reuse from register page for visual parity)
import leftDecor from "/src/assets/icons/cross.png";
import rightDecor from "/src/assets/icons/family-church.svg";
import heroIllustration from "/src/assets/images/signup-choir-illustration.png";

const RESEND_COOLDOWN = 60; // seconds


export default function VerifyOTPRegistrationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const emailFromState = state?.email || "";
  const roleFromState = state?.role || "member"; // "member" | "church-admin"

  const [email] = useState(emailFromState);
  const [role] = useState(roleFromState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please start again.");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!resendTimer) return;
    const t = setInterval(() => setResendTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return toast.error("Enter the 6-digit OTP.");
    try {
      setLoading(true);
      await api.post("/api/verify-otp-registration", { email, otp });

      if (role === "church-admin") {
        // show approval modal
        setShowSuccess(true);
      } else {
        // member: go straight to login or dashboard (your call)
        toast.success("Your account is verified!");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendTimer > 0) return;
    try {
      await api.post("/api/resend-otp-registration", { email });
      toast.success("A new OTP was sent to your email.");
      setResendTimer(60);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="relative bg-[#F7F3EF] overflow-hidden">
        <div className="h-16 sm:h-20" aria-hidden />

        {/* Same background decor as Register page */}
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
          {/* Card shell identical to register */}
          <div className="mx-auto w-full rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Illustration */}
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

              {/* Right: OTP form */}
              <div className="border-t md:border-t-0 md:border-l border-black/5 p-8 sm:p-10 md:p-12">
                <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[#1F2937]">
                  Verify OTP
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  We sent a code to <span className="font-medium">{email}</span>.
                </p>

                <form onSubmit={handleVerify} className="mt-6 space-y-4">
                  {/* OTP input */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Enter OTP
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit code"
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-center tracking-[0.4em] text-lg focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !otp}
                    className="w-full rounded-md bg-[#F28C52] py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className="w-full rounded-md border border-gray-300 py-2.5 text-sm hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </form>

                <p className="text-center mt-4 text-sm">
                  Wrong email?{" "}
                  <Link to="/register" className="text-[#F28C52] hover:underline">
                    Go back
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <LeadershipTeam />
      <ChurchInfoFooter />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* dimmer */}
          <div className="absolute inset-0 bg-black/40" />
          {/* modal */}
          <div className="relative z-10 w-[92%] max-w-lg rounded-xl bg-white p-8 shadow-2xl ring-1 ring-black/10">
            <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-center">
              Your registration is now
              <br /> being reviewed by the AmPower team.
            </h2>
            <p className="mt-3 text-sm text-gray-600 text-center">
              Please wait for approval before you can access your Church Dashboard.
              You’ll receive an email notification once your account is approved. 🙏
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/", { replace: true })}
                className="rounded-md bg-[#F28C52] px-5 py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOTPPage() {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // email may come from nav state or from localStorage
  const stateEmail = location.state?.email;
  const [email, setEmail] = useState(stateEmail || localStorage.getItem("resetEmail") || "");

  useEffect(() => {
    if (!email) {
      toast.error("No reset email found. Start again.");
      navigate("/forget-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    let t;
    if (resendTimer > 0) {
      t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!otp.trim() || otp.length < 4) return toast.error("Enter the OTP code.");
    setLoading(true);
    try {
      await api.post("/api/verify-otp", { email, otp });
      // Persist verified OTP so Reset page can use it (your backend expects it)
      localStorage.setItem("resetOtp", otp);
      localStorage.setItem("resetEmail", email);
      toast.success("OTP verified.");
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendTimer > 0) return;
    try {
      await api.post("/api/forget-password", { email });
      toast.success("New OTP sent.");
      setResendTimer(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
      <p className="text-sm text-gray-600 mb-4">
        We sent a code to <span className="font-medium">{email}</span>.
      </p>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))}
        className="w-full p-3 border rounded mb-3 tracking-widest text-center text-lg"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        onClick={handleResend}
        disabled={resendTimer > 0}
        className="w-full mt-3 border py-2 rounded disabled:opacity-60"
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
      </button>
    </div>
  );
}

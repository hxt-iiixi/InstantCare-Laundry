import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { GoogleLogin } from "@react-oauth/google";


export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Accept from nav state or fallback to localStorage
  const stateEmail = location.state?.email;
  const stateOtp = location.state?.otp;

  const [email, setEmail] = useState(stateEmail || localStorage.getItem("resetEmail") || "");
  const [otp, setOtp] = useState(stateOtp || localStorage.getItem("resetOtp") || "");

  useEffect(() => {
    if (!email || !otp) {
      toast.error("Missing verification info. Start again.");
      navigate("/forget-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleReset = async () => {
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      await api.post("/api/reset-password", { email, otp, newPassword });
      // Clean up temp data
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      toast.success("Password reset successfully! You can log in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-4">
        Updating password for <span className="font-medium">{email}</span>.
      </p>

      <input
        type="password"
        placeholder="New password (min 8 chars)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition disabled:opacity-60"
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </div>
  );
  
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Import icons

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
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

      {/* === New Password === */}
      <div className="relative mb-3">
        <input
          type={showNewPass ? "text" : "password"}
          placeholder="New password (min 8 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="button"
          onClick={() => setShowNewPass((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showNewPass ? "Hide password" : "Show password"}
        >
          {showNewPass ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>

      {/* === Confirm Password === */}
      <div className="relative mb-4">
        <input
          type={showConfirmPass ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPass((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showConfirmPass ? "Hide password" : "Show password"}
        >
          {showConfirmPass ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>

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

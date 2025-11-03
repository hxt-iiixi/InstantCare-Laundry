// src/pages/auth/ResetPasswordPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { Eye, EyeOff } from "lucide-react";

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

  // Password policy
  const hasLower = useMemo(() => /[a-z]/.test(newPassword), [newPassword]);
  const hasUpper = useMemo(() => /[A-Z]/.test(newPassword), [newPassword]);
  const hasNumber = useMemo(() => /\d/.test(newPassword), [newPassword]);
  const longEnough = useMemo(() => newPassword.length >= 8, [newPassword]);
  const isStrong = hasLower && hasUpper && hasNumber && longEnough;
  const passwordsMatch = newPassword === confirmPassword;

  const handleReset = async () => {
    if (!isStrong) {
      return toast.error(
        "Password must be at least 8 characters and include a lowercase letter, an uppercase letter, and a number."
      );
    }
    if (!passwordsMatch) return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      await api.post("/api/reset-password", { email, otp, newPassword });
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

  const Req = ({ ok, text }) => (
    <li className={`text-xs flex items-center gap-2 ${ok ? "text-emerald-600" : "text-gray-500"}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-gray-300"}`} />
      {text}
    </li>
  );

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-4">
        Updating password for <span className="font-medium">{email}</span>.
      </p>

      {/* New Password */}
      <div className="relative mb-2">
        <input
          type={showNewPass ? "text" : "password"}
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
          title="At least 8 characters with a lowercase, an uppercase, and a number."
          className="w-full p-3 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
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

      {/* Live checklist */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3" aria-live="polite">
        <Req ok={longEnough} text="At least 8 characters" />
        <Req ok={hasNumber} text="Has a number" />
        <Req ok={hasLower} text="Lowercase letter" />
        <Req ok={hasUpper} text="Uppercase letter" />
      </ul>

      {/* Confirm Password */}
      <div className="relative mb-2">
        <input
          type={showConfirmPass ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full p-3 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
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
      {confirmPassword && !passwordsMatch && (
        <p className="text-xs text-rose-600 mb-3">Passwords do not match.</p>
      )}

      <button
        onClick={handleReset}
        disabled={loading || !isStrong || !passwordsMatch}
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition disabled:opacity-60"
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </div>
  );
}

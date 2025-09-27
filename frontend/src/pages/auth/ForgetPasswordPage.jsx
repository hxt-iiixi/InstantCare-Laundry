import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async () => {
    if (!email.trim()) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await api.post("/api/forget-password", { email });
      // Persist email for later steps (survives refresh/navigation)
      localStorage.setItem("resetEmail", email);
      toast.success("OTP sent to your email.");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      <button
        onClick={handleRequestOTP}
        disabled={loading}
        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  );
}

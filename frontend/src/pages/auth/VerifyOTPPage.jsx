import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTPPage() {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:4000/api/verify-otp", { email, otp });
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleVerify} className="bg-purple-500 text-white py-2 px-4 rounded">
        Verify OTP
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

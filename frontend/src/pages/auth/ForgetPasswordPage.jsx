import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false); // show OTP sent notification
  const navigate = useNavigate();

  const handleRequestOTP = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/forget-password", { email });
      setToast(true);
      setError("");

      // Hide toast after 3 seconds
      setTimeout(() => setToast(false), 3000);

      // Navigate to OTP verification page and pass email
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl relative">
      <h2 className="text-xl font-semibold mb-4 text-center">Forget Password</h2>

      {/* Toast notification */}
      {toast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          OTP sent to your email!
        </div>
      )}

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      <button
        onClick={handleRequestOTP}
        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300"
      >
        Send OTP
      </button>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}

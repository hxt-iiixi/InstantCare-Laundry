import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { api } from "../../lib/api";


const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to detect state from navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // New state for toast

  // Show toast if redirected from register
  useEffect(() => {
      if (location.state?.fromRegister) {
        setShowToast(true); // show toast
        const timer = setTimeout(() => setShowToast(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
      className="max-w-md mx-auto p-8 mt-20 bg-white rounded-lg shadow-xl relative"
    >
      <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Account created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300"
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

     {/* Google login (login-only) */}
    <div style={{ width: "100%" }}>
      <GoogleLogin
        onSuccess={async (res) => {
          try {
            const credential = res?.credential;
            const { data } = await api.post("/api/auth/google/login", { credential });
            localStorage.setItem("token", data.token);
            if (data?.user?.email) localStorage.setItem("prefillEmail", data.user.email);
            toast.success("Welcome back!");
            navigate("/dashboard", { replace: true });
          } catch (e) {
            const status = e?.response?.status;
            const msg =
              status === 404
                ? "No account found for this Google email. Please register first."
                : e?.response?.data?.message || "Google sign-in failed.";
            toast.error(msg);
            if (status === 404) navigate("/register", { replace: true });
          }
        }}
        onError={() => toast.error("Google sign-in cancelled")}
        ux_mode="popup"
        text="continue_with"
        shape="pill"
        size="large"
      />
    </div>


      <p className="text-center mt-4">
        Don't have an account? <a href="/register" className="text-purple-500 hover:underline">Register here</a>
      </p>
      <p className="text-center mt-2">
        <a href="/forget-password" className="text-purple-500 hover:underline">
          Forgot Password?
        </a>
      </p>
      
    </motion.div>
  );
  
};

export default LoginPage;

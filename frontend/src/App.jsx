import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import Home from './pages/Home.jsx';
import ForgetPasswordPage from "./pages/auth/ForgetPasswordPage.jsx";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";

import { motion } from 'framer-motion';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token state whenever localStorage changes (after login/register)
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/register"
        element={
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
          >
            <RegisterPage />
          </motion.div>
        }
      />
      <Route
        path="/login"
        element={
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
          >
            <LoginPage />
          </motion.div>
        }
      />
      <Route
        path="/dashboard"
        element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

    </Routes>
  );
}

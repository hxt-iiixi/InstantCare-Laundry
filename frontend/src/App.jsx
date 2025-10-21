import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import DashboardPage from "./pages/Super-Admin/DashboardPage.jsx";
import SystemManagementPage from "./pages/Super-Admin/SystemManagementPage.jsx";
import AccountControlPage from "./pages/Super-Admin/AccountControlPage.jsx";
import UserRolesPage from "./pages/Super-Admin/UserRolesPage.jsx";
import Home from './pages/landing-page/Home.jsx';
import ForgetPasswordPage from "./pages/auth/ForgetPasswordPage.jsx";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import CreatePasswordPage from "./pages/auth/CreatePasswordPage.jsx";
import About from "./pages/landing-page/About.jsx";
import VerifyOTPRegistrationPage from "./pages/auth/VerifyOTPRegistrationPage";
import ChurchAdminRegisterPage from "./pages/auth/ChurchAdminRegisterPage.jsx";
import RoleSelectPage from "/src/pages/auth/RoleSelectPage.jsx";
import Calendar from "./pages/church-admin/Calendar.jsx";
import Contact from './pages/landing-page/Contacts.jsx';

import PersistentLayout from "./components/PersistentLayout";  // Import the PersistentLayout component

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      {/* Pages without Background Music */}
      <Route path="/create-password" element={<CreatePasswordPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/member" element={<RegisterPage />} />
      <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
      <Route path="/SystemManagement" element={token ? <SystemManagementPage /> : <Navigate to="/login" replace />} />
      <Route path="/UserRoles" element={token ? <UserRolesPage /> : <Navigate to="/login" replace />} />
      <Route path="/account" element={token ? <AccountControlPage /> : <Navigate to="/login" replace />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp-registration" element={<VerifyOTPRegistrationPage />} />
      <Route path="/register/church-admin" element={<ChurchAdminRegisterPage />} />
      <Route path="/register" element={<RoleSelectPage />} />
      <Route path="/Calendar" element={<Calendar />} />

     
      <Route path="/" element={<PersistentLayout><Home /></PersistentLayout>} />
      <Route path="/about" element={<PersistentLayout><About /></PersistentLayout>} />
      <Route path="/Contact" element={<PersistentLayout><Contact /></PersistentLayout>} />
    </Routes>
  );
}

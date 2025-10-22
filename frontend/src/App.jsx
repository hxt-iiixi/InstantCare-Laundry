import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { getDefaultRouteByRole } from "./utils/auth.js";

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
import ChurchDash from "./pages/church-admin/AdminDashboard.jsx";
import DailyDevotion from "./pages/church-admin/DailyDevotion.jsx";
import Contact from './pages/landing-page/Contacts.jsx';
import PersistentLayout from "./components/PersistentLayout";  

import Memberdash from "./pages/member-page/memberdash.jsx";
import MemberProfile from "./pages/member-page/MemberProfile.jsx"; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Whenever the token is updated, we check its status
  useEffect(() => {
    // If there's no token, the user is logged out, so we navigate to login
    if (!token) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  return (
    <Routes>
      {/* Public auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/member" element={<RegisterPage />} />
      <Route path="/register/church-admin" element={<ChurchAdminRegisterPage />} />
      <Route path="/register" element={<RoleSelectPage />} />
      <Route path="/create-password" element={<CreatePasswordPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp-registration" element={<VerifyOTPRegistrationPage />} />

      {/* Public marketing pages */}
      <Route path="/" element={<PersistentLayout><Home /></PersistentLayout>} />
      <Route path="/about" element={<PersistentLayout><About /></PersistentLayout>} />
      <Route path="/Contact" element={<PersistentLayout><Contact /></PersistentLayout>} />

      {/* Church-admin only */}
      <Route path="/church-dash" element={ <ProtectedRoute roles={["church-admin"]} element={<ChurchDash />} /> } />
      <Route path="/parish-calendar" element={ <ProtectedRoute roles={["church-admin"]} element={<Calendar />} /> } />
      <Route path="/daily-devotion" element={ <ProtectedRoute roles={["church-admin"]} element={<DailyDevotion />} /> } />

      {/* Member only */}
      <Route path="/memberdash" element={ <ProtectedRoute roles={["member"]} element={<Memberdash />} /> } />
      <Route path="/profile" element={ <ProtectedRoute roles={["member"]} element={<MemberProfile />} /> } />

      {/* Super-admin */}
      <Route path="/dashboard" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<DashboardPage />} /> } />
      <Route path="/SystemManagement" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<SystemManagementPage />} /> } />
      <Route path="/UserRoles" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<UserRolesPage />} /> } />
      <Route path="/account" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<AccountControlPage />} /> } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

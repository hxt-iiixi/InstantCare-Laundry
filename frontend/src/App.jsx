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
import ChurchProfile from "./pages/church-admin/ChurchProfile.jsx";
import Ministries from "./pages/church-admin/Ministries.jsx";
import ParishEngagement from "./pages/church-admin/ParishEngagement.jsx";
import Userroles from "./pages/church-admin/UserRoles.jsx";
import Contact from './pages/landing-page/Contacts.jsx';
import MembersContact from './pages/member-page/MContacts.jsx';
import PersistentLayout from "./components/PersistentLayout";  
import Memberdash from "./pages/member-page/memberdash.jsx";
import MemberProfile from "./pages/member-page/MemberProfile.jsx"; 
import MemberChurch from "./pages/member-page/MemberChurch.jsx"; 

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
      <Route path="/userroles" element={ <ProtectedRoute roles={["church-admin"]} element={<Userroles />} /> } />
      <Route path="/Cprofile" element={ <ProtectedRoute roles={["church-admin"]} element={<ChurchProfile />} /> } />
      <Route path="/ParishEngagement" element={ <ProtectedRoute roles={["church-admin"]} element={<ParishEngagement />} /> } />
      <Route path="/Ministries" element={ <ProtectedRoute roles={["church-admin"]} element={<Ministries />} /> } />
     
    
      {/* Member only */}
      <Route path="/memberdash" element={ <ProtectedRoute roles={["member"]} element={<Memberdash />} /> } />
      <Route path="/profile" element={ <ProtectedRoute roles={["member"]} element={<MemberProfile />} /> } />
      <Route path="/church" element={ <ProtectedRoute roles={["member"]} element={<MemberChurch />} /> } />
      <Route path="/MembersContact" element={<PersistentLayout><MembersContact /></PersistentLayout>} />
      
      {/* Super-admin */}
      <Route path="/dashboard" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<DashboardPage />} /> } />
      <Route path="/SystemManagement" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<SystemManagementPage />} /> } />
      <Route path="/Userroles" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<UserRolesPage />} /> } />
      <Route path="/account" element={ <ProtectedRoute roles={["superadmin","admin"]} element={<AccountControlPage />} /> } />
      

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

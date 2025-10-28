import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Super-admin/SideNav"; // Import SideNav component
import TopNav from "../../components/Super-admin/TopNav"; // Import TopNav component
import RightImg from "../../assets/images/jc.jpg";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
});
const [cardsLoading, setCardsLoading] = useState(true);

const fetchAppStats = async () => {
  try {
    setCardsLoading(true);
    const token = localStorage.getItem("token");
    const { data } = await api.get("/api/church-admin/applications", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const list = Array.isArray(data) ? data : [];
    const counts = list.reduce(
      (acc, r) => {
        acc.total += 1;
        const s = String(r.status || "").toLowerCase();
        if (s === "pending") acc.pending += 1;
        else if (s === "approved") acc.approved += 1;
        else if (s === "rejected") acc.rejected += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );

    setStats(counts);
  } catch (e) {
    console.error("Failed to load app stats", e);
  } finally {
    setCardsLoading(false);
  }
};

useEffect(() => {
  fetchAppStats();

  // Optional: live refresh if other pages broadcast updates
  const onAppsUpdate = () => fetchAppStats();
  window.addEventListener("apps:update", onAppsUpdate);
  return () => window.removeEventListener("apps:update", onAppsUpdate);
}, []);
  // helper
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      // ✅ correct path, uses api baseURL
      const { data } = await api.get("/api/me/profile", authHeaders());
      setUser(data.user);
    } catch (err) {
      console.error(
        "profile error:",
        err?.response?.status,
        err?.response?.data || err.message
      );
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };
  fetchUserData();
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16 flex-col">
      <SideNav /> {/* Use the SideNav component */}
      <div className="flex-1 bg-white p-8 ml-64">
        <TopNav /> {/* Use the TopNav component */}
        <div className="container mx-auto p-6">

          {/* Group 1: Welcome Text + Button with Image on the Right */}
          <div className="flex items-start  bg-[#fff5f0] pl-8 rounded-md mb-12">
            {/* Left side - Text and Button */}
            <div className="flex flex-col w-1/2 ">
              <div className="flex flex-row  items-baseline">
                <h1 className="text-3xl font-semibold text-black text-left mb-6 mt-5 ">
                Welcome, Ampower Team! 
              </h1>
              <span className="font-guthen text-4xl tracking-wider text-stone-800">Dashboard</span>
              </div>
              <p className="text-lg text-black text-left mb-8">
                Gain comprehensive control and insights over all church operations and system settings. Your central hub for management.
              </p>
              <div className="text-left">
                <button className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600">
                  View All Churches
                </button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="w-1/2 content-center">
              <img
                src={RightImg}  
                alt="Ampower"
                className="w-120 h-80 object-fill rounded-md justify-self-center "
              />
            </div>
          </div>

         {/* Group 2: Cards Grid (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Registered Churches",
                  value: stats.total,
                  sub: "Overall churches in the system",
                },
                {
                  title: "Pending Registrations",
                  value: stats.pending,
                  sub: "Awaiting your approval",
                },
                {
                  title: "Total Approved Churches",
                  value: stats.approved,
                  sub: "Overall approved in the system",
                },
                {
                  title: "Total Rejected Churches",
                  value: stats.rejected,
                  sub: "Declined applications",
                },
              ].map((c, i) => (
                <div key={i} className="p-6 rounded-lg shadow-md text-center bg-white">
                  <h2 className="text-2xl text-left font-semibold">{c.title}</h2>

                  {cardsLoading ? (
                    <div className="mt-4 h-10 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-[34px] text-left font-bold text-gray-700 mt-4">
                      {c.value}
                    </p>
                  )}

                  <p className="text-sm text-left text-gray-700 font-semibold mt-4">
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>
        </div> 
       
      </div>

    </div>
    
  );
};

export default DashboardPage;

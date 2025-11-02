// src/pages/super-admin/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Super-admin/SideNav";
import TopNav from "../../components/Super-admin/TopNav";
import RightImg from "../../assets/icons/dugtongg 1.svg";
import Footer from "../../components/Home-Page/ChurchInfoFooter";

const DashboardPage = () => {
  const navigate = useNavigate();

  /* ------------------------------ user/profile ------------------------------ */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* --------------------------------- stats --------------------------------- */
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
      const { data } = await api.get("/api/church-admin/applications", authHeaders());
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
    const onAppsUpdate = () => fetchAppStats();
    window.addEventListener("apps:update", onAppsUpdate);
    return () => window.removeEventListener("apps:update", onAppsUpdate);
  }, []);

  /* ------------------------------- modal state ------------------------------ */
  const [showChurchesModal, setShowChurchesModal] = useState(false);
  const [approvedChurches, setApprovedChurches] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");

  const openApprovedModal = async () => {
    setShowChurchesModal(true);
    setListError("");
    setListLoading(true);
    try {
      const { data } = await api.get("/api/church-admin/applications", authHeaders());
      const list = (Array.isArray(data) ? data : []).filter(
        (r) => String(r.status || "").toLowerCase() === "approved"
      );
      setApprovedChurches(list);
    } catch (e) {
      console.error("Failed to load approved churches", e);
      setListError("Failed to load approved churches.");
    } finally {
      setListLoading(false);
    }
  };

  const closeApprovedModal = () => {
    setShowChurchesModal(false);
    setSearch("");
  };

  const filtered = approvedChurches.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.churchName || "").toLowerCase().includes(q) ||
      (c.city || "").toLowerCase().includes(q) ||
      (c.province || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  /* --------------------------------- render -------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16 flex-col">
      <SideNav />
      <div className="flex-1 bg-white p-8 ml-64">
        <TopNav />

        <div className="container mx-auto p-6">
          {/* Group 1: Welcome + CTA */}
          <div className="flex items-start bg-[#fff5f0] pl-8 rounded-md mb-12">
            {/* Left: text */}
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row items-baseline">
                <h1 className="text-3xl font-semibold text-black text-left mb-6 mt-5">
                  Welcome, Ampower Team!
                </h1>
                <span className="font-guthen text-4xl tracking-wider text-stone-800 ml-2">
                  Dashboard
                </span>
              </div>
              <p className="text-lg text-black text-left mb-8">
                Gain comprehensive control and insights over all church operations and system
                settings. Your central hub for management.
              </p>
              <div className="text-left">
                <button
                  className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                  onClick={openApprovedModal}
                >
                  View All Churches
                </button>
              </div>
            </div>

            {/* Right: image */}
            <div className="w-1/2 content-center">
              <img
                src={RightImg}
                alt="Ampower"
                className="w-120 h-80 object-fill rounded-md justify-self-center"
              />
            </div>
          </div>

          {/* Group 2: Cards */}
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
                  <p className="text-[34px] text-left font-bold text-gray-700 mt-4">{c.value}</p>
                )}

                <p className="text-sm text-left text-gray-700 font-semibold mt-4">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------- Approved Modal ---------------------------- */}
      {showChurchesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl">
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Approved Churches ({approvedChurches.length})
              </h3>
              <button
                className="rounded-md px-3 py-1 text-slate-600 hover:bg-slate-100"
                onClick={closeApprovedModal}
              >
                ✕
              </button>
            </div>

            {/* toolbar */}
            <div className="p-4 flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city, province, or email…"
                className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* content */}
            <div className="p-4">
              {listLoading ? (
                <div className="py-16 text-center text-slate-600">Loading churches…</div>
              ) : listError ? (
                <div className="py-8 text-center text-red-600">{listError}</div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-slate-600">No approved churches found.</div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                  {filtered.map((c) => (
                    <div
                      key={String(c._id)}
                      className="border border-slate-200 rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {c.churchName || "Unnamed Church"}
                        </div>
                        <div className="text-sm text-slate-600">
                          {(c.city || "").trim()}
                          {c.city && c.province ? ", " : ""}
                          {(c.province || "").trim()}
                        </div>
                        {c.email && (
                          <div className="text-sm text-slate-600 truncate">{c.email}</div>
                        )}
                        {c.joinCode && (
                          <div className="mt-1 inline-flex items-center text-xs bg-slate-100 px-2 py-0.5 rounded">
                            Join Code: <span className="ml-1 font-mono">{c.joinCode}</span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 flex gap-2">
                        {/* Placeholder action buttons if you add routes later */}
                        {/* <button className="text-sm px-3 py-1 rounded bg-slate-100">View</button> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeApprovedModal}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

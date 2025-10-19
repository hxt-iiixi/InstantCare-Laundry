// src/pages/Super-Admin/AccountControlPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TopNav from "../../components/Super-admin/TopNav";
import SideNav from "../../components/Super-admin/SideNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
import { api } from "../../lib/api";
import badgeIcon from "/src/assets/icons/acc.png";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:4000";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const StatusPill = ({ value }) => {
  const v = cap(String(value || ""));
  const cfg =
    {
      Approved: { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700" },
      Pending: { dot: "bg-amber-500", pill: "bg-amber-100 text-amber-700" },
      Rejected: { dot: "bg-rose-500", pill: "bg-rose-100 text-rose-700" },
    }[v] || { dot: "bg-zinc-400", pill: "bg-zinc-100 text-zinc-700" };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${cfg.pill}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {v}
    </span>
  );
};

const TableBtn = ({ kind = "neutral", children, ...props }) => {
  const styles = {
    neutral: "bg-zinc-100 hover:bg-zinc-200 text-zinc-800",
    approve: "bg-emerald-600 hover:bg-emerald-700 text-white",
    reject: "bg-rose-500 hover:bg-rose-600 text-white",
  }[kind];
  return (
    <button className={`px-3 py-1 rounded-md text-sm transition ${styles}`} {...props}>
      {children}
    </button>
  );
};

const ToolbarBtn = ({ kind = "reject", children, ...props }) => {
  const styles = {
    reject: "bg-rose-500 hover:bg-rose-600 text-white",
    approve: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }[kind];
  return (
    <button className={`px-4 py-2 rounded-md text-sm font-medium transition ${styles}`} {...props}>
      {children}
    </button>
  );
};

export default function AccountControlPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  // fetch applications
  const fetchApps = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter; // pending|approved|rejected
      const { data } = await api.get("/api/church-admin/applications", { params });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter]);

  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.churchName, r.address, r.email, r.contactNumber].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const openCertificate = (path) => {
    if (!path) return;
    const url = new URL(path, API_ORIGIN).href; 
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const approveOne = async (id) => {
    try {
      await api.patch(`/api/church-admin/applications/${id}/approve`);
      toast.success("Application approved.");

      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to approve.");
    }
  };

  const rejectOne = async (id) => {
    try {
      await api.patch(`/api/church-admin/applications/${id}/reject`);
      toast.success("Application rejected.");
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to reject.");
    }
  };

  const approveAll = async () => {
    const ids = filtered.filter((r) => r.status !== "approved").map((r) => r._id);
    if (!ids.length) return toast.message("Nothing to approve.");
    try {
      await Promise.all(ids.map((id) => api.patch(`/api/church-admin/applications/${id}/approve`)));
      toast.success("Approved selected applications.");
      setRows((prev) => prev.map((r) => (ids.includes(r._id) ? { ...r, status: "approved" } : r)));
    } catch {
      toast.error("Bulk approve failed. Try individually.");
    }
  };

  const rejectAll = async () => {
    const ids = filtered.map((r) => r._id);
    if (!ids.length) return toast.message("Nothing to reject.");
    try {
      await Promise.all(ids.map((id) => api.patch(`/api/church-admin/applications/${id}/reject`)));
      toast.success("Rejected selected applications.");
      setRows((prev) => prev.map((r) => (ids.includes(r._id) ? { ...r, status: "rejected" } : r)));
    } catch {
      toast.error("Bulk reject failed. Try individually.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="fixed inset-x-0 top-0 z-30 h-16 bg-white border-b">
        <TopNav />
      </header>

      <div className="pt-16 flex flex-1">
        <aside className="hidden md:block w-64 shrink-0 border-r bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <SideNav />
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <section className="bg-stone-100 rounded-xl border border-zinc-200 p-5 lg:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <img src={badgeIcon} alt="" className="h-6 w-6" />
                <h1 className="text-2xl md:text-[26px] font-semibold text-zinc-900">
                  Account Control <span className="font-normal italic">Church Registrations</span>
                </h1>
              </div>
              <p className="text-sm md:text-[14px] text-zinc-600 mt-2 max-w-3xl">
                Review incoming church applications, verify certificates, and approve or reject access.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 md:p-5">
    
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search churches..."
                    className="w-full rounded-md border border-zinc-300 bg-white py-2.5 pl-4 pr-4 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <select
                  className="w-full md:w-[160px] rounded-md border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-2 md:ml-auto">
                  <ToolbarBtn kind="reject" onClick={rejectAll}>
                    Reject All
                  </ToolbarBtn>
                  <ToolbarBtn kind="approve" onClick={approveAll}>
                    Approve All
                  </ToolbarBtn>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-[880px] w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-zinc-500">
                      <th className="py-3 px-4">Church Name</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Contact number</th>
                      <th className="py-3 px-4">Church Certificate</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Registered</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {loading && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-sm text-zinc-500">
                          Loading…
                        </td>
                      </tr>
                    )}

                    {!loading && filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-sm text-zinc-500">
                          No applications found.
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filtered.map((r) => (
                        <tr key={r._id} className="text-sm">
                          <td className="py-4 px-4 text-zinc-900">{r.churchName}</td>
                          <td className="py-4 px-4 text-zinc-700">{r.address}</td>
                          <td className="py-4 px-4 text-zinc-700">{r.email}</td>
                          <td className="py-4 px-4 text-zinc-700">{r.contactNumber || "—"}</td>
                          <td className="py-4 px-4">
                            {r.certificatePath ? (
                              <button
                                onClick={() => openCertificate(r.certificatePath)}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                              >
                                View
                              </button>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <StatusPill value={r.status} />
                          </td>
                          <td className="py-4 px-4 text-zinc-700">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {r.status !== "approved" && (
                                <TableBtn kind="approve" onClick={() => approveOne(r._id)}>
                                  Approve
                                </TableBtn>
                              )}
                              {r.status !== "rejected" && (
                                <TableBtn kind="reject" onClick={() => rejectOne(r._id)}>
                                  Reject
                                </TableBtn>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

   
    </div>
  );
}

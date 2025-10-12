import React from "react";
import TopNav from "../../components/Super-admin/TopNav";
import SideNav from "../../components/Super-admin/SideNav";
import Footer from "../../components/Home-Page/ChurchInfoFooter";
import badgeIcon from "/src/assets/icons/acc.png";

const rows = [
  { name: "St. Mary’s Parish", location: "New York, NY", email: "stmaryparish@gr...", contact: "09998223471", cert: true, status: "Approved", date: "2023-01-15" },
  { name: "Trinity Chapel", location: "Los Angeles, CA", email: "trinitychapel@gm...", contact: "09123456789", cert: true, status: "Pending",  date: "2023-02-20" },
  { name: "First Baptist Chu…", location: "Chicago, IL", email: "firstbaptist@gm...", contact: "098765456789", cert: true, status: "Approved", date: "2023-03-10" },
  { name: "Community of Ho…", location: "Houston, TX", email: "community@gm...", contact: "092618790867", cert: true, status: "Rejected", date: "2023-04-05" },
  { name: "Grace Cathedral", location: "San Francisco, CA", email: "gracecathedral@gm", contact: "09475178690", cert: true, status: "Pending",  date: "2023-05-12" },
];

const StatusPill = ({ value }) => {
  const cfg =
    {
      Approved: { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700" },
      Pending:  { dot: "bg-amber-500",  pill: "bg-amber-100 text-amber-700" },
      Rejected: { dot: "bg-rose-500",   pill: "bg-rose-100 text-rose-700" },
    }[value] || { dot: "bg-zinc-400", pill: "bg-zinc-100 text-zinc-700" };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${cfg.pill}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {value}
    </span>
  );
};

const TableBtn = ({ kind = "neutral", children }) => {
  const styles = {
    neutral: "bg-zinc-100 hover:bg-zinc-200 text-zinc-800",
    approve: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }[kind];
  return <button className={`px-3 py-1 rounded-md text-sm transition ${styles}`}>{children}</button>;
};

const ToolbarBtn = ({ kind = "reject", children }) => {
  const styles = {
    reject: "bg-rose-500 hover:bg-rose-600 text-white",
    approve: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }[kind];
  return <button className={`px-4 py-2 rounded-md text-sm font-medium transition ${styles}`}>{children}</button>;
};

const AccountControlPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Top Nav (64px/16) */}
      <header className="fixed inset-x-0 top-0 z-30 h-16 bg-white border-b">
        <TopNav />
      </header>

      {/* ROW: SideNav + Main (offset by top nav) */}
      <div className="pt-16 flex flex-1">
        {/* Sidebar column with visual separation */}
        <aside className="hidden md:block w-64 shrink-0 border-r bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <SideNav />
        </aside>

        {/* Main column */}
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
                Manage and oversee all church accounts and registration requests with ease. Review, approve, or update church profiles to
                maintain accurate and organized records across the system.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 md:p-5">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search churches..."
                    className="w-full rounded-md border border-zinc-300 bg-white py-2.5 pl-4 pr-4 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <select
                  className="w-full md:w-[160px] rounded-md border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  defaultValue="all"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-2 md:ml-auto">
                  <ToolbarBtn kind="reject">Reject All</ToolbarBtn>
                  <ToolbarBtn kind="approve">Approve All</ToolbarBtn>
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
                    {rows.map((r, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-4 px-4 text-zinc-900">{r.name}</td>
                        <td className="py-4 px-4 text-zinc-700">{r.location}</td>
                        <td className="py-4 px-4 text-zinc-700">{r.email}</td>
                        <td className="py-4 px-4 text-zinc-700">{r.contact}</td>
                        <td className="py-4 px-4">
                          {r.cert ? (
                            <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <StatusPill value={r.status} />
                        </td>
                        <td className="py-4 px-4 text-zinc-700">{r.date}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {r.status !== "Approved" && <TableBtn kind="approve">Approve</TableBtn>}
                            <TableBtn>Edit Details</TableBtn>
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

      {/* FULL-WIDTH FOOTER */}
    <footer className="mt-8 border-t border-zinc-200 bg-white w-full ml-0 md:ml-64">
        <Footer />
    </footer>
    </div>
  );
};

export default AccountControlPage;

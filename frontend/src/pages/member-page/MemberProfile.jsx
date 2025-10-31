// src/pages/member/MemberProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiCamera, FiEdit2 } from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../../components/member-pages/Navbar";
import { api } from "../../lib/api";
import placeholderAvatar from "/src/assets/images/user-avatar.png";
import placeholderCover from "/src/assets/images/cover-placeholder.png";

const firstWord = (s = "") => (s.trim().split(" ")[0] || "").trim();

export default function MemberProfile() {

  const MINISTRIES = [
    { key: "music", label: "Music Ministry", desc: "Lead and provide music for services." },
    { key: "youth", label: "Youth Ministry", desc: "Engage and support the youth community." },
    { key: "education", label: "Education Ministry", desc: "Teach and facilitate learning within parish." },
    { key: "community", label: "Community Ministry", desc: "Support and connect with the local community." },
    { key: "outreach", label: "Outreach Ministry", desc: "Serve those in need outside the parish." },
  ];

  const MinistryIcon = ({ type }) => {
    const common = "h-5 w-5";
    switch (type) {
      case "music":     return <svg className={common} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 1 10 17V7h8V3h-6z"/></svg>;
      case "youth":     return <svg className={common} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 9a7 7 0 0 0-14 0Z"/></svg>;
      case "education": return <svg className={common} viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 10 5-10 5L2 8l10-5Zm0 7 6.75-3.38V13c0 3.59-4.02 6.5-6.75 6.5S5.25 16.59 5.25 13V6.62Z"/></svg>;
      case "community": return <svg className={common} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a4 4 0 1 1 4-4 4 4 0 0 1-4 4ZM4 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm12 2c-3.33 0-6 2.24-6 5v2h12v-2c0-2.76-2.67-5-6-5ZM4 12c-2.67 0-4 1.79-4 4v2h6v-2a5.5 5.5 0 0 1 .55-2.4A6.4 6.4 0 0 0 4 12Z"/></svg>;
      case "outreach":  return <svg className={common} viewBox="0 0 24 24" fill="currentColor"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 4a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/></svg>;
      default:          return null;
    }
  };

  const pillClass = (s) => {
    if (s === "approved")      return "bg-green-50 text-green-700 border border-green-200";
    if (s === "pending")       return "bg-amber-50 text-amber-700 border border-amber-200";
    if (s === "leave-pending") return "bg-sky-50 text-sky-700 border border-sky-200";
    if (s === "rejected")      return "bg-rose-50 text-rose-700 border border-rose-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

const [churchId, setChurchId] = useState(null);
const [myMinistries, setMyMinistries] = useState({});   // { music: "pending" | "approved" | ... }
const [roster, setRoster] = useState({ music:[], youth:[], education:[], community:[], outreach:[] });

const statusLabel = (s) => {
  if (s === "approved") return "Joined";
  if (s === "pending") return "Pending";
  if (s === "leave-pending") return "Leaving…";
  if (s === "rejected") return "Rejected";
  return "Not a member";
};

  const [loading, setLoading] = useState(true);

  // visual
  const [avatar, setAvatar] = useState(placeholderAvatar);
  const [coverImage, setCoverImage] = useState(placeholderCover);

  // dynamic user/church
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Parishioner");
  const [location, setLocation] = useState("—");
  const [bio, setBio] = useState("");

  // edit states
  const [editDetails, setEditDetails] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [origName, setOrigName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 1) profile
        const p = await api.get("/api/me/profile");
        const u = p?.data?.user || {};
        const name = u.name || u.username || "";
        setFullName(name);
        setOrigName(name);
        setEmail(u.email || "");
        setRole((u.role || "Parishioner").replace("-", " "));
        setBio(u.bio || "");

        if (name) localStorage.setItem("name", name);

        // 2) church & location
        const mc = await api.get("/api/members/me/church");
        const churchId = mc?.data?.church?.id;
        const churchName = mc?.data?.church?.name;
        if (churchName) localStorage.setItem("churchName", churchName);

        if (churchId) {
          try {
            const c = await api.get(`/api/church-admin/applications/${churchId}/summary`);
            const addr = c?.data?.address || c?.data?.church?.address;
            setLocation(addr || churchName || "—");
          } catch {
            setLocation(churchName || "—");
          }

          setChurchId(churchId || null);
          if (churchId) {
            try {
              const mine = await api.get("/api/ministries/my");
              const map = {};
              (mine.data?.items || []).forEach(i => { map[i.ministry] = i.status; });
              setMyMinistries(map);
            } catch {}

            try {
              const r = await api.get("/api/ministries/roster", { params: { churchId } });
              setRoster(r.data?.roster || {});
            } catch {}
          }
        }

      } catch (e) {
        console.error(e);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const helloName = useMemo(() => firstWord(fullName) || "Friend", [fullName]);

  // file pickers
const onAvatar = async (e) => {
  const f = e.target.files?.[0]; if (!f) return;
  // preview
  const r = new FileReader(); r.onloadend = () => setAvatar(r.result); r.readAsDataURL(f);
  // persist
  const fd = new FormData(); fd.append("file", f);
  const { data } = await api.post("/api/me/upload?field=avatar", fd, { headers: { "Content-Type":"multipart/form-data" } });
  setAvatar(data.url);
};

// cover
const onCover = async (e) => {
  const f = e.target.files?.[0]; if (!f) return;
  const r = new FileReader(); r.onloadend = () => setCoverImage(r.result); r.readAsDataURL(f);
  const fd = new FormData(); fd.append("file", f);
  const { data } = await api.post("/api/me/upload?field=cover", fd, { headers: { "Content-Type":"multipart/form-data" } });
  setCoverImage(data.url);
};
  // actions
  const discardDetails = () => {
    setFullName(origName);
    setNewPass("");
    setConfPass("");
    setEditDetails(false);
  };

  const joinMinistry = async (m) => {
    try {
      const { data } = await api.post("/api/ministries/join", { ministry: m });
      setMyMinistries(s => ({ ...s, [m]: data.status }));
      toast.success("Request sent.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Join failed.");
    }
  };

  const leaveMinistry = async (m) => {
    try {
      const { data } = await api.post("/api/ministries/leave", { ministry: m });
      setMyMinistries(s => ({ ...s, [m]: data.status }));
      toast.success("Leave request sent.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Leave failed.");
    }
  };

  const saveDetails = async () => {
    try {
      if (!fullName.trim()) return toast.error("Full name is required.");
      if (newPass || confPass) {
        if (newPass.length < 8) return toast.error("Password must be at least 8 characters.");
        if (newPass !== confPass) return toast.error("Passwords do not match.");
      }

      // update name
      if (fullName.trim() !== origName.trim()) {
        try {
         const { data } = await api.patch("/api/me/profile", { name: fullName.trim() });
          const saved = data?.user?.name || fullName.trim();
          setOrigName(saved);
          localStorage.setItem("name", saved);
        } catch {
          // if PATCH /api/profile not implemented yet
          localStorage.setItem("name", fullName.trim());
        }
      }

      // update password (optional)
      if (newPass) {
        await api.post("/api/set-password", { newPassword: newPass });
        setNewPass("");
        setConfPass("");
      }

      toast.success("Profile saved.");
      setEditDetails(false);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Save failed.");
    }
  };

  const saveBio = async () => {
    try {
     await api.patch("/api/me/profile", { bio: bio || "" }).catch(() => {});
      setEditBio(false);
      toast.success("Bio saved.");
    } catch {
      setEditBio(false);
      toast.error("Could not save bio.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F3]">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-slate-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <Navbar />

      {/* ===== Header (Cover + Avatar + Name/Role + Bio card) ===== */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-2xl shadow border border-zinc-200 overflow-hidden">
        <div className="relative">
          <img src={coverImage} alt="Cover" className="w-full h-48 md:h-56 object-cover" />
          <label className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 text-sm cursor-pointer">
            <FiCamera /> <span className="hidden sm:inline">Change cover</span>
            <input type="file" accept="image/*" className="hidden" onChange={onCover} />
          </label>
          {/* avatar */}
          <div className="absolute left-6 -bottom-12">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden shadow">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              <label className="absolute bottom-1 right-1 bg-white/90 p-1 rounded-full cursor-pointer">
                <FiCamera size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              </label>
            </div>
          </div>
        </div>

        {/* name/role + bio row (pulled up) */}
        <div className="px-6 pb-4 pt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="text-2xl font-semibold text-orange-600 leading-tight">{fullName}</div>
            <div className="text-slate-600">{role}</div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800">Bio</span>
                  <button
                    onClick={() => (editBio ? saveBio() : setEditBio(true))}
                    className="inline-flex items-center gap-1 text-orange-600"
                  >
                    <FiEdit2 /> {editBio ? "Save" : "Edit"}
                  </button>
                </div>
                {editBio ? (
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="Write something about yourself…"
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-6">
                    {bio || "No bio yet."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Details + Ministries (two-column) ===== */}
    <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT: Personal Details */}
      <div className="md:col-span-1">
        <div className="h-full bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-orange-600">Personal Details</h2>
            <button
              onClick={() => setEditDetails((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm"
            >
              <FaEdit /> {editDetails ? "Stop Editing" : "Edit"}
            </button>
          </div>

          <div className="mt-2 text-sm text-slate-700">
            <div className="font-semibold">{`Hello, ${helloName}!`}</div>
            <div className="text-slate-600">Location: {location}</div>
          </div>

          <div className="mt-5 space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editDetails}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  editDetails
                    ? "border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    : "bg-zinc-100 border-zinc-200 text-zinc-600 cursor-not-allowed"
                }`}
                placeholder="Your full name"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-md border bg-zinc-100 border-zinc-200 text-zinc-600 cursor-not-allowed px-3 py-2 text-sm"
              />
            </div>

            {/* Change password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Change Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                disabled={!editDetails}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  editDetails
                    ? "border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    : "bg-zinc-100 border-zinc-200 text-zinc-600 cursor-not-allowed"
                }`}
                placeholder="****************"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
                disabled={!editDetails}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  editDetails
                    ? "border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    : "bg-zinc-100 border-zinc-200 text-zinc-600 cursor-not-allowed"
                }`}
                placeholder="****************"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={discardDetails} className="px-5 py-2 rounded-full bg-orange-200/60 text-orange-800">
              Discard
            </button>
            <button
              onClick={saveDetails}
              disabled={!editDetails}
              className={`px-5 py-2 rounded-full text-white ${
                editDetails ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-300 cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Church Ministries join list */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-serif font-semibold text-slate-900">Church Ministries</h3>
              <p className="text-sm text-slate-500 mt-0.5">Request to join a ministry below</p>
            </div>
            {!churchId && (
              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                Join a church with a code first
              </span>
            )}
          </div>

          <div className="mt-3 space-y-3">
            {MINISTRIES.map((m) => {
              const st = myMinistries[m.key];
              const canJoin = (!!churchId) && (!st || st === "rejected" || st === "removed");
              const canLeave = st === "approved";
              const isPending = st === "pending" || st === "leave-pending";

              return (
                <div
                  key={m.key}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 hover:bg-zinc-50"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <MinistryIcon type={m.key} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-800">{m.label}</div>
                      <div className="text-xs text-slate-600 truncate">{m.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs rounded-full px-2 py-0.5 ${pillClass(st)}`}>
                      {statusLabel(st)}
                    </span>

                    {canJoin && (
                      <button
                        onClick={() => joinMinistry(m.key)}
                        className="rounded-md bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5"
                      >
                        Join now
                      </button>
                    )}
                    {canLeave && (
                      <button
                        onClick={() => leaveMinistry(m.key)}
                        className="rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5"
                      >
                        Leave
                      </button>
                    )}
                    {isPending && (
                      <button
                        disabled
                        className="rounded-md bg-slate-200 text-slate-600 text-xs px-3 py-1.5 cursor-not-allowed"
                      >
                        Request sent
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* ===== Members per ministry (3 boxes) ===== */}
    <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { key: "music", label: "Music Ministry", desc: "Lead and provide music for services." },
      { key: "youth", label: "Youth Ministry", desc: "Engage and support the youth community." },
      { key: "education", label: "Education Ministry", desc: "Teach and facilitate learning within parish." },
      { key: "community", label: "Community Ministry", desc: "Support and connect with the local community." },
      { key: "outreach", label: "Outreach Ministry", desc: "Serve those in need outside the parish." },
      ].map((box) => (
        <div key={box.key} className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="text-2xl font-serif font-semibold text-slate-800">
            {box.label} <span className="ml-2 text-sm text-slate-500">Members</span>
          </div>
          <ol className="mt-4 space-y-2 text-sm text-slate-800">
            {(roster[box.key] || []).map((u, i) => (
              <li key={u.id} className="flex items-center gap-2">
                <span className="text-slate-500 w-6 text-right">{i + 1}.</span>
                <img
                  src={u.avatar || "/src/assets/images/user-avatar.png"}
                  className="h-6 w-6 rounded-full"
                  alt=""
                />
                <span className="truncate">{u.name}</span>
              </li>
            ))}
            {(!roster[box.key] || roster[box.key].length === 0) && (
              <li className="text-slate-500">No members yet.</li>
            )}
          </ol>
        </div>
      ))}
    </div>


    </div>
  );
}

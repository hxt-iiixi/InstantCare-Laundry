import React, { useEffect, useMemo, useState } from "react";
import { FiCamera, FiEdit2 } from "react-icons/fi";
import AdminHeader from "../../components/church-admin/AdminHeader";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import { api } from "../../lib/api";
import placeholderAvatar from "/src/assets/images/user-avatar.png";
import placeholderCover from "/src/assets/images/cover-placeholder.png";
import { toast } from "sonner";

export default function ChurchAdminProfile() {
  // visuals
  const [avatar, setAvatar] = useState(placeholderAvatar);
  const [coverImage, setCoverImage] = useState(placeholderCover);

  // dynamic data
  const [adminName, setAdminName] = useState(""); // for the “Hello …” (if you show it elsewhere)
  const [churchId, setChurchId] = useState(null);
  const [churchName, setChurchName] = useState("");
  const [churchLocation, setChurchLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // edit mode
  const [isEditing, setIsEditing] = useState(false);
  const snapshot = useMemo(
    () => ({ churchName, churchLocation, contactNumber }),
    [churchName, churchLocation, contactNumber]
  );

  // ========== load admin + church ==========
  useEffect(() => {
    (async () => {
      try {
        // current user
       const p = await api.get("/api/me/profile");
        const u = p?.data?.user || {};
        setAdminName(u.name || u.username || "");

        // church bound to this admin
        const mc = await api.get("/api/church-admin/me/church");
        const ch = mc?.data?.church;
        if (ch) {
          setChurchId(ch.id);
          setChurchName(ch.name || "");
          // fetch full application details to get address/contact
         try {
            const app = await api.get(`/api/church-admin/applications/${ch.id}`);
            const a = app?.data?.church || {};

            const pickLocation = (obj = {}) => {
              const addr = (obj.address ?? "").trim();
              const city = (obj.city ?? "").trim();
              const prov = (obj.province ?? "").trim();
              if (addr) return addr;
              const joined = [city, prov].filter(Boolean).join(", ");
              return joined; // empty string if nothing
            };

            setChurchLocation(pickLocation(a));
            setContactNumber(a.contactNumber || "");
            if (a.avatar) setAvatar(a.avatar);
            if (a.cover) setCoverImage(a.cover);
            if (ch?.name) localStorage.setItem("churchName", ch.name);
          } catch {
            /* keep what we have */
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load profile.");
      }
    })();
  }, []);

  // ========== handlers ==========
 const onAvatar = async (e) => {
  const f = e.target.files?.[0]; if (!f) return;
  const r = new FileReader(); r.onloadend = () => setAvatar(r.result); r.readAsDataURL(f);
  const fd = new FormData(); fd.append("file", f);
  const { data } = await api.post(`/api/church-admin/applications/${churchId}/upload?field=avatar`, fd,
    { headers: { "Content-Type":"multipart/form-data" } });
  setAvatar(data.url);
};

const onCover = async (e) => {
  const f = e.target.files?.[0]; if (!f) return;
  const r = new FileReader(); r.onloadend = () => setCoverImage(r.result); r.readAsDataURL(f);
  const fd = new FormData(); fd.append("file", f);
  const { data } = await api.post(`/api/church-admin/applications/${churchId}/upload?field=cover`, fd,
    { headers: { "Content-Type":"multipart/form-data" } });
  setCoverImage(data.url);
};

  const discard = () => {
    setChurchName(snapshot.churchName);
    setChurchLocation(snapshot.churchLocation);
    setContactNumber(snapshot.contactNumber);
    setIsEditing(false);
  };

  const save = async () => {
    try {
      if (!churchId) return toast.error("Missing church id.");
      if (!churchName.trim()) return toast.error("Church name is required.");

      // Update application (adjust field names to your model)
     await api.patch(`/api/church-admin/applications/${churchId}/profile`, {
        churchName: churchName.trim(),
        address: churchLocation.trim(),   // or split into city/province if you store them separately
        contactNumber: contactNumber.trim(),
      });
      toast.success("Church details saved.");
      localStorage.setItem("churchName", churchName.trim());
      window.dispatchEvent(new CustomEvent("churchName:update", { detail: churchName.trim() }));
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Save failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" />

      <main className="pl-[232px] pt-[64px]">
        <div className="max-w-6xl mx-auto w-full px-6 py-6">

          {/* ===== HEADER CARD (cover + avatar + church title area) ===== */}
          <div className="bg-white rounded-2xl shadow border border-zinc-200 overflow-hidden">
            <div className="relative">
              <img src={coverImage} alt="Cover" className="w-full h-56 md:h-64 object-cover" />
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

            {/* title row like your image */}
            <div className="px-6 pt-14 pb-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
              <div>
                <div className="text-2xl md:text-[26px] font-semibold text-orange-600">
                  {churchName || "—"}
                </div>
                <div className="text-slate-500">Admin Church</div>
               <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
                  <path fill="currentColor"
                    d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/>
                </svg>
                <span>{churchLocation || "—"}</span>
              </div>
              </div>

              {/* empty rounded panel to mimic screenshot’s white box */}
              <div className="bg-white border border-zinc-200 rounded-xl h-16 md:h-20"></div>
            </div>
          </div>

          {/* ===== CHURCH DETAILS CARD ===== */}
          <div className="mt-6 bg-[#FBF5EF] border border-zinc-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-orange-600">Church Details</h3>
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm"
              >
                <FiEdit2 /> {isEditing ? "Stop Editing" : "Edit"}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Church Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Church Name</label>
                <input
                  type="text"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    isEditing
                      ? "border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      : "bg-white border-zinc-200"
                  }`}
                  placeholder="e.g., St. Joseph Parish"
                />
              </div>

              {/* Church Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Church Location</label>
                <input
                  type="text"
                  value={churchLocation}
                  onChange={(e) => setChurchLocation(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    isEditing
                      ? "border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      : "bg-white border-zinc-200"
                  }`}
                  placeholder="City, Province"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    isEditing
                      ? "border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      : "bg-white border-zinc-200"
                  }`}
                  placeholder="09xxxxxxxxx"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={discard} className="px-5 py-2 rounded-full bg-orange-200/60 text-orange-800">
                Discard
              </button>
              <button
                onClick={save}
                disabled={!isEditing}
                className={`px-5 py-2 rounded-full text-white ${
                  isEditing ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

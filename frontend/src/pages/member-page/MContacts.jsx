import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Navbar from "../../components/member-pages/Navbar";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import imgkids from "../../assets/icons/jesus with kids.png";
import { api } from "../../lib/api";

export default function Contact() {
  const [churchName, setChurchName] = useState("AmPower");
  const [churchEmail, setChurchEmail] = useState("");
  const [message, setMessage] = useState("");

 useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      // 1) Try member → church
      let churchId = null;
      try {
        const mc = await api.get("/api/members/me/church");
        churchId = mc?.data?.church?.id || null;
      } catch {}

      // 2) Fallback: church-admin → own church
      if (!churchId) {
        try {
          const ac = await api.get("/api/church-admin/me/church");
          churchId = ac?.data?.church?.id || null;
        } catch {}
      }

      if (!churchId || !mounted) return; // no linked church

      // 3) Load full church document (has churchName + email)
      const { data } = await api.get(`/api/church-admin/applications/${churchId}`);
      const ch = data?.church || {};

      if (!mounted) return;

      const name = ch.churchName || ch.name || "AmPower";
      setChurchName(name);
      setChurchEmail(ch.email || "");

      // keep other UI (like headers) in sync if you rely on this
      localStorage.setItem("churchName", name);
      window.dispatchEvent(new CustomEvent("churchName:update", { detail: name }));
    } catch (e) {
      console.error("Contact init error:", e?.message || e);
    }
  })();

  return () => { mounted = false; };
}, []);


  // simple functional send: opens the user's mail app with the church email prefilled
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!churchEmail) return;
    const href = `mailto:${churchEmail}?subject=${encodeURIComponent(
      "Inquiry from parish member"
    )}&body=${encodeURIComponent(message || "")}`;
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-1 py-10">
        <div className="flex items-center justify-between">
          <header className="text-left max-w-2xl ml-[20%]">
            <h1 className="text-5xl font-bold text-gray-900">Contact</h1>
            <p className="text-gray-600 mt-4">
              Get in touch with us for inquiries, support, or collaboration.
              <br />
              The <span className="text-orange-600">{churchName}</span> team is committed to helping churches grow <br />
              through digital innovation and faithful service.
            </p>
          </header>
          <img src={imgkids} alt="Kids" width="400" className="ml-10" />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Form */}
        <div className="bg-gray-50 shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to empower your church with{" "}
            <span className="text-orange-600">{churchName}</span>?
            <br />
            Contact us now:
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Recipient (church email) */}
            <input
              type="email"
              value={churchEmail}
              readOnly
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            {/* Message */}
            <textarea
              placeholder="Leave us a message..."
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!churchEmail}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Send to email
            </button>
          </form>
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span role="img" aria-label="hands">🙏</span> Connect with Us
            </h3>
            <p className="text-gray-600 mb-3">
              Reach out to our {churchName} team for guidance, support, or collaboration.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>📩 Send us a message</li>
              <li>📧 Email our support team</li>
              <li>💬 Start a faith-driven chat</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" /> Reach Us
            </h3>
            <p className="text-gray-600 mb-2">
              We’re here to help with your church management needs. Call us from
              <br />
              <strong>Mon–Fri, 8AM–5PM</strong>
            </p>
            <p className="font-semibold text-gray-900">+63 (900) 000-0000</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" /> Visit Us
            </h3>
            <p className="text-gray-600">
              Let’s talk in person about empowering your parish and ministries.
            </p>
            <p className="font-semibold mt-2">
              📍 PHINMA University of Pangasinan,
              <br />
              Dagupan City, Pangasinan
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

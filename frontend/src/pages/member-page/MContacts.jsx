// src/pages/member-pages/Contact.jsx
import React, { useEffect, useState, useRef } from "react";
import { Phone, MapPin, X } from "lucide-react";
import Navbar from "../../components/member-pages/Navbar";
import { api } from "../../lib/api";
import imgkids from "../../assets/icons/jesus with kids.png";

export default function Contact() {
  const [churchName, setChurchName] = useState("Your Church");
  const [churchEmail, setChurchEmail] = useState("");
  const [subject, setSubject] = useState("Inquiry from parish member");
  const [message, setMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [sending, setSending] = useState(false);

  // NEW: modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // member → church
        const mc = await api.get("/api/members/me/church", { headers }).catch(() => null);
        const mChurch = mc?.data?.church || null;

        // fallback (if browsing as church-admin)
        let churchId = mChurch?.id || null;
        if (!churchId) {
          const ac = await api.get("/api/church-admin/me/church", { headers }).catch(() => null);
          churchId = ac?.data?.church?.id || null;
        }
        if (!churchId) {
          setLoadingEmail(false);
          return;
        }

        // public summary (no isAdmin)
        const { data } = await api.get(`/api/church-admin/applications/${churchId}/summary`, { headers });
        if (!mounted) return;

        const name = mChurch?.name || data.churchName || data.name || "Your Church";
        setChurchName(name);
        setChurchEmail(data.email || "");
      } catch (e) {
        console.error("Contact init error:", e?.response?.data || e?.message || e);
      } finally {
        if (mounted) setLoadingEmail(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Focus first actionable element when modal opens
  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  const handleCopy = async () => {
    if (!churchEmail) return;
    try {
      await navigator.clipboard.writeText(churchEmail);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!churchEmail) return alert("No church email on file.");
    try {
      setSending(true);
      // backend sends the email via SMTP
      await api.post("/api/members/contact", { subject, message });
      setMessage("");
      setShowSuccess(true); // OPEN MODAL
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to send email. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  const handleCloseModal = () => setShowSuccess(false);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800" onKeyDown={handleKeyDown}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-1 py-10">
        <div className="flex items-center justify-between">
          <header className="text-left max-w-2xl ml-[20%]">
            <h1 className="text-5xl font-bold text-gray-900">Contact</h1>
            <p className="text-gray-600 mt-4">
              Get in touch with us for inquiries, support, or collaboration.
              <br />
              The <span className="text-orange-600">{churchName.toLowerCase()}</span> team is committed to helping churches grow
              <br />
              through digital innovation and faithful service.
            </p>
          </header>
          <img src={imgkids} alt="Kids" width="400" className="ml-10" />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="bg-gray-50 shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Email <span className="text-orange-600">{churchName.toLowerCase()}</span>:
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="email"
                value={churchEmail}
                readOnly
                placeholder={loadingEmail ? "Loading email..." : "No church email on file"}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                disabled={!churchEmail}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 -mt-1">Admins only.</p>

            <label className="block text-sm text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Subject"
            />

            <label className="block text-sm text-gray-700">Message</label>
            <textarea
              placeholder="Write your message..."
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!churchEmail || sending}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {sending ? "Sending…" : "Send to email"}
            </button>
          </form>
        </div>

        {/* Right info (unchanged) */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">🙏 Connect with Us</h3>
            <p className="text-gray-600 mb-3">
              Reach out to our {churchName.toLowerCase()} team for guidance, support, or collaboration.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>📩 Send us a message to your admin</li>
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
              <strong></strong>
            </p>
            <p className="font-semibold text-gray-900">+63 (900) 000-0000</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" /> Visit Us
            </h3>
            <p className="text-gray-600">Let’s talk in person about empowering your parish and ministries.</p>
            <p className="font-semibold mt-2">
              📍 PHINMA University of Pangasinan,
              <br />
              Dagupan City, Pangasinan
            </p>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-labelledby="success-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />
          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 id="success-title" className="text-xl font-bold text-gray-900">
                Message Sent!
              </h2>
              <button
                ref={closeBtnRef}
                onClick={handleCloseModal}
                className="ml-3 inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-gray-600">
              Your message has been sent successfully. The church admin will receive your email shortly.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
              >
                Okay
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Send Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

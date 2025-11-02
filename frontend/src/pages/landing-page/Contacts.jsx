import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import imgkids from "../../assets/icons/jesus with kids.png";
import { api } from "../../lib/api";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage]     = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null); // {type:"success"|"error", msg:string}

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setContactNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // basic client validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      return setAlert({ type: "error", msg: "Please fill in all required fields." });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) return setAlert({ type: "error", msg: "Please enter a valid email address." });
    if (contactNumber && !/^\d{11}$/.test(contactNumber)) {
      return setAlert({ type: "error", msg: "Contact number must be 11 digits (PH format)." });
    }

    try {
      setSubmitting(true);
      await api.post("/api/contact", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: contactNumber,
        message: message.trim(),
      });
      setAlert({ type: "success", msg: "Thanks! Your message has been sent. We'll get back soon." });
      // reset
      setFirstName(""); setLastName(""); setEmail(""); setContactNumber(""); setMessage("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send your message. Please try again.";
      setAlert({ type: "error", msg });
    } finally {
      setSubmitting(false);
    }
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
              The AmPower team is committed to helping churches grow <br />
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
            <span className="text-orange-600">AmPower</span>?
            <br />
            Contact us now:
          </h2>

          {alert && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {alert.msg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />

            <input
              type="tel"
              placeholder="Contact number (11 digits)"
              value={contactNumber}
              onChange={handleContactChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <textarea
              placeholder="Leave us a message..."
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 ${
                submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-700"
              }`}
            >
              {submitting ? "Sending…" : "Send to email"}
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
              Reach out to our AmPower team for guidance, support, or collaboration.
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
            <p className="text-gray-600">Let’s talk in person about empowering your parish and ministries.</p>
            <p className="font-semibold mt-2">
              📍 PHINMA University of Pangasinan,
              <br />
              Dagupan City, Pangasinan
            </p>
          </div>
        </div>
      </section>

      <ChurchInfoFooter />
    </div>
  );
}

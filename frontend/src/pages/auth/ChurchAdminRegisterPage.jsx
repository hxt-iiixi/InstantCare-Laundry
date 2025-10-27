// src/pages/auth/ChurchAdminRegisterPage.jsx
import React, { useState } from "react";
import { api } from "../../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import leftDecor from "/src/assets/icons/cross.png";
import rightDecor from "/src/assets/icons/family-church.svg";
import heroIllustration from "/src/assets/images/signup-choir-illustration.png";

import iconMail from "/src/assets/icons/Mail.png";
import ChurchInfoFooter from "/src/components/Home-Page/ChurchInfoFooter";
import LeadershipTeam from "/src/components/Home-Page/LeadershipTeam";
import Navbar from "/src/components/Navbar";

const ChurchAdminRegisterPage = () => {
  const navigate = useNavigate();

  const [churchName, setChurchName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!churchName || !address || !email || !contactNumber) {
      setError("Please fill out all fields.");
      return;
    }
    if (!certificateFile) {
      setError("Please upload your church certificate.");
      return;
    }

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("churchName", churchName);
      form.append("address", address);
      form.append("email", email);
      form.append("contactNumber", contactNumber);
      form.append("certificate", certificateFile); // field name "certificate" on backend

      // 👉 adjust this endpoint to your API (kept obvious on purpose)
      const { data } = await api.post(
        "http://localhost:4000/api/church-admin/register",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Persist auth if your API returns token, then continue to OTP
      if (data?.token) localStorage.setItem("token", data.token);

     navigate("/verify-otp-registration", { state: { email, role: "church-admin" } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="relative bg-[#F7F3EF] overflow-hidden">
        <div className="h-16 sm:h-20" aria-hidden />

        <img
          src={leftDecor}
          alt=""
          className="pointer-events-none select-none hidden md:block absolute left-8 md:left-10 lg:left-16 top-24 md:top-28 lg:top-32 md:h-56 lg:h-72 xl:h-80 w-auto opacity-90 drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]"
          draggable="false"
        />
        <img
          src={rightDecor}
          alt=""
          className="pointer-events-none select-none hidden md:block absolute right-6 md:right-10 lg:right-16 top-40 md:top-44 lg:top-48 md:h-64 lg:h-80 xl:h-[360px] 2xl:h-[420px] w-auto opacity-90 drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]"
          draggable="false"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="mx-auto w-full rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Illustration */}
              <div className="relative p-8 sm:p-10 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-[420px]">
                  <div className="absolute inset-0 -z-10 mx-auto my-auto h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-[#F7F3EF]" />
                  <img
                    src={heroIllustration}
                    alt=""
                    className="relative mx-auto block h-64 sm:h-72 w-auto object-contain"
                    draggable="false"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="border-t md:border-t-0 md:border-l border-black/5 p-8 sm:p-10 md:p-12">
                <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[#1F2937]">
                  Church Admin
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Join AmPower and strengthen your ministry.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Church name */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Church name
                    </span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={churchName}
                      onChange={(e) => setChurchName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                    />
                  </label>

                  {/* Address / Location */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Address/Location
                    </span>
                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                    />
                  </label>

                  {/* Email */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Email address
                    </span>
                    <div className="relative">
                      <img
                        src={iconMail}
                        alt=""
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                      />
                    </div>
                  </label>

                  {/* Contact number */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Contact Number
                    </span>
                    <input
                      type="tel"
                      placeholder="Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C52] focus:border-transparent"
                    />
                  </label>

                  {/* Certificate upload */}
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">
                      Church Certificate
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white file:mr-3 file:rounded file:border-0 file:bg-[#F28C52] file:px-3 file:py-2 file:text-white hover:file:bg-[#ea7f41] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Accepted: PDF/JPG/PNG. Max ~10MB (configurable).
                    </p>
                  </label>

                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-[#F28C52] py-2.5 text-white text-sm font-medium shadow hover:bg-[#ea7f41] transition disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>

                <p className="text-center mt-4 text-sm">
                  Already registered?{" "}
                  <Link to="/login" className="text-[#F28C52] hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <LeadershipTeam />
      <ChurchInfoFooter />
    </>
  );
};

export default ChurchAdminRegisterPage;

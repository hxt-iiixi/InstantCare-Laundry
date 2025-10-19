import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Navbar from "../../components/Navbar";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";  
import BackgroundMusic from "../../components/BackgroundMusic";
import GlobalLayout from "../../components/PersistentLayout";
export default function Contact() {
  return (
     <GlobalLayout><div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Header Section */}

      <Navbar />
      <header className="max-w-6xl px-1 py-10 text-left">
      
        <h1 className="text-5xl font-bold text-gray-900 ml-[230px]">Contact</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get in touch with us for inquiries, support, or collaboration.
          <br />
          The AmPower team is committed to helping churches grow <br></br>through
          digital innovation and faithful service.
        </p>
      </header>

      {/* Main Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Form */}
        <div className="bg-gray-50 shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to empower your church with <span className="text-orange-600">AmPower</span>?
            <br />Contact us now:
          </h2>

          <form className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <input
              type="tel"
              placeholder="Contact number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />

            <textarea
              placeholder="Leave us a message..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-200"
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
        <ChurchInfoFooter />
        <BackgroundMusic />
    </div>
    </GlobalLayout>
    
  );
}
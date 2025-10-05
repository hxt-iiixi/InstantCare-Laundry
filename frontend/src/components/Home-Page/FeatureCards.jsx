import React from "react";
import { Link } from "react-router-dom";

// ✅ Import the tear PNG (with spaces in the filename)
import tearPng from "/src/assets/images/FRAMEWHITE1.png";

const items = [
  { title: "Church Calendar", desc: "Stay updated with upcoming services, events, and special gatherings in our church family.", icon: "/src/assets/icons/feature-calendar-1.svg", to: "/calendar" },
  { title: "Daily Devotion", desc: "Read short, inspiring messages from God’s Word to strengthen your faith each day.", icon: "/src/assets/icons/feature-devotion.svg", to: "/devotion" },
  { title: "Ministries Activities", desc: "Discover ongoing programs, outreach, and fellowship opportunities where you can serve and grow.", icon: "/src/assets/icons/feature-ministries.svg", to: "/ministries" },
  { title: "Spiritual Journal", desc: "Reflect and record your prayers, blessings, and personal journey with God.", icon: "/src/assets/icons/feature-journal-1.svg", to: "/journal" },
  { title: "Spiritual Journal", desc: "Reflect and record your prayers, blessings, and personal journey with God.", icon: "/src/assets/icons/feature-journal-1.svg", to: "/journal" },
  { title: "Church Calendar", desc: "Stay updated with upcoming services, events, and special gatherings in our church family.", icon: "/src/assets/icons/feature-calendar-1.svg", to: "/calendar" },
];

export default function FeatureCards() {
  return (
    <section className="relative bg-[#FBF7F3] py-6 sm:py-10 overflow-hidden">
      {/* TORN EDGE: show only the top of the PNG */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[58%] z-0">
        {/* Crop window that reveals just the top edge */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[112%] h-[150px] -top-px overflow-hidden">
          <img
            src={tearPng}
            alt=""
            className="w-full h-[380px] object-cover object-top select-none"
            draggable="false"
          />
        </div>
      </div>

      {/* CONTENT above the tear */}
      <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white shadow-[0_24px_72px_rgba(0,0,0,0.08)] px-6 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-18">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {items.map((it, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-8 lg:p-9 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-shadow flex flex-col"
              >
                <div className="mb-6 flex items-center justify-center">
                  <img src={it.icon} alt="" className="h-24 sm:h-28 lg:h-32 w-auto" draggable="false" />
                </div>

                <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold text-zinc-900 text-center">
                  {it.title}
                </h3>
                <p className="mt-3 text-[15px] sm:text-base lg:text-[17px] leading-7 text-zinc-600 text-center">
                  {it.desc}
                </p>

                <div className="mt-6">
                  <Link
                    to={it.to}
                    className="block w-full text-center rounded-md border border-[#FFB86B] bg-[#FFF4EA] px-5 py-3 text-sm sm:text-[15px] font-semibold text-[#BB5B0F] hover:brightness-95"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

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
  const prefersReduce = useReducedMotion();


  const grid = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.08 }
    }
  };
  const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 0.82, 0.2, 1],
      // reveal one-by-one: 0, 0.12s, 0.24s, ...
      delay: i * 0.12,
    },
  }),
};
  // Card entrance
  const card = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 3, ease: [0.22, 0.82, 0.2, 1] } }
  };

  const iconFloat = prefersReduce
    ? {}
    : {
        y: [0, -6, 0],
        transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
      };

  return (
    <section className="relative bg-[#FBF7F3] py-6 sm:py-10 overflow-hidden">
   
        <div className="absolute inset-x-0 bottom-0 top-[58%] bg-white z-0" />

  
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 0.82, 0.2, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[58%] z-10"
      >
      
      </motion.div>
  <div className="relative z-20 mx-auto max-w-7xl rounded-[32px] border border-zinc-200 bg-white shadow-[0_24px_72px_rgba(0,0,0,0.08)] px-6 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-18">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {items.map((it, idx) => (
        <motion.article
          key={idx}
          variants={cardVariant}
          custom={idx}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-8 lg:p-9 transition-all flex flex-col hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1"
        >
        <div className="mb-6 flex items-center justify-center">
          <motion.img
            src={it.icon}
            alt=""
            className="h-24 sm:h-28 lg:h-32 w-auto"
            draggable="false"
            animate={
              prefersReduce
                ? {}
                : { y: [0, -6, 0], transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" } }
            }
            style={{ willChange: "transform" }}
          />
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
      </motion.article>
    ))}
  </div>
</div>
    </section>
  );
}

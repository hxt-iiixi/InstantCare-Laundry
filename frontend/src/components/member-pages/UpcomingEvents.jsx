// src/components/member/UpcomingEvents.jsx
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../lib/api";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  MotionConfig,
} from "framer-motion";

const BOOK_BG = "/src/assets/images/book-bg.png";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function UpcomingEvents() {
  const prefersReduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, 16]);

  const [churchId, setChurchId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // when set, all shadows are disabled

  // fetch member’s church
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/members/me/church", authHeaders());
        setChurchId(data?.church?.id || null);
      } catch (e) {
        console.error("Failed to load member church:", e);
      }
    })();
  }, []);

  // fetch events for that church
  useEffect(() => {
    (async () => {
      if (!churchId) return;
      setLoading(true);
      try {
        const { data = [] } = await api.get("/api/events", {
          ...authHeaders(),
          params: { churchId },
        });
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load events:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [churchId]);

  // next 3 after today
  const nextThree = useMemo(() => {
    const tomorrowStart = dayjs().startOf("day").add(1, "day");
    return events
      .filter((e) => e?.date && dayjs(e.date).isAfter(tomorrowStart.subtract(1, "ms")))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events]);

  // motion bits
  const fadeUp = {
    hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 0.82, 0.2, 1] },
    },
  };
  const heading = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.82, 0.2, 1] } },
  };
  const list = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const bookFloat = prefersReduce
    ? {}
    : { y: [0, -10, 0], transition: { duration: 8, repeat: Infinity, ease: "easeInOut" } };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <motion.section
        className="relative overflow-hidden"
        style={prefersReduce ? {} : { y: sectionY, willChange: "transform" }}
      >
        {/* Decorative book (shadow removed when modal open) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[-140px] z-0 flex justify-center"
        >
          <motion.img
            src={BOOK_BG}
            alt=""
            className={`w-[1900px] max-w-full h-auto select-none ${selected ? "" : "drop-shadow-2xl"}`}
            draggable="false"
            animate={bookFloat}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[120rem] px-6 sm:px-10 pt-14 lg:pt-20 pb-44">
          {/* Title block – bigger & decorative */}
          <motion.div
            variants={heading}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-end gap-6"
          >
            <h2 className="text-[42px] sm:text-[54px] lg:text-[64px] font-extrabold text-zinc-900 leading-none">
              Upcoming Events
            </h2>
            <div className="hidden sm:block h-[10px] w-40 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400" />
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[220px] rounded-2xl bg-white/80 border border-zinc-200 animate-pulse" />
              ))}
            </div>
          ) : !churchId ? (
            <p className="mt-10 text-zinc-600 text-lg">Join a church with a code to see its upcoming events.</p>
          ) : nextThree.length === 0 ? (
            <p className="mt-10 text-zinc-600 text-lg">No upcoming events after today.</p>
          ) : (
            <motion.div
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {nextThree.map((e) => {
                const d = dayjs(e.date);
                return (
                  <motion.article
                    key={e._id}
                    variants={fadeUp}
                    className={`
                      relative w-full rounded-2xl 
                      bg-gradient-to-br from-[#FFF4EA] via-white to-[#FFE7D1]
                      border border-amber-200
                      ${selected ? "" : "shadow-[0_18px_50px_rgba(0,0,0,0.12)]"}
                      overflow-hidden
                    `}
                    whileHover={
                      prefersReduce
                        ? undefined
                        : { y: -6, scale: 1.01 }
                    }
                    transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.7 }}
                  >
                    {/* Ribbon accent */}
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400" />

                    <div className="p-6 lg:p-7">
                      {/* Date block – bigger */}
                      <div className="flex items-center gap-5">
                        <div className="shrink-0 text-center rounded-xl bg-white/70 px-4 py-3 border border-zinc-200">
                          <div className="text-sm text-zinc-500">{d.format("ddd")}</div>
                          <div className="text-[40px] font-black text-zinc-900 leading-none">{d.format("D")}</div>
                          <div className="text-sm text-zinc-500 -mt-1">{d.format("MMM")}</div>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-[22px] lg:text-[24px] font-extrabold text-zinc-900 truncate">
                            {e.title}
                          </h3>

                          <div className="mt-2 space-y-1 text-[15px] text-zinc-700">
                            <div className="flex items-center gap-2 truncate">
                              <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-2 4h-6v6h6v-6Z"/>
                              </svg>
                              <span className="truncate">{e.time || "Time TBA"}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z"/>
                              </svg>
                              <span className="truncate">{e.location || "Location TBA"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Button – bigger */}
                      <div className="mt-6">
                        <motion.button
                          whileTap={prefersReduce ? undefined : { scale: 0.98 }}
                          onClick={() => setSelected(e)}
                          className="block w-full text-center rounded-lg border border-[#FFB86B] bg-[#FFEBD6] px-5 py-3 text-[15px] font-semibold text-[#9A4A07] hover:brightness-95"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Modal (no shadows anywhere while open) */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-7 border border-zinc-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-zinc-500">{dayjs(selected.date).format("dddd, MMMM D, YYYY")}</div>
                  <h4 className="mt-1 text-2xl font-bold text-zinc-900">{selected.title}</h4>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-md p-2 hover:bg-zinc-100"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.29-6.3 1.42 1.41Z"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px] text-zinc-800">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-2 4h-6v6h6v-6Z"/></svg>
                  <span>{selected.time || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z"/></svg>
                  <span>{selected.location || "TBA"}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-zinc-600">Description</div>
                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">
                  {selected.description || "—"}
                </p>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg bg-orange-500 px-5 py-2.5 text-white hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </MotionConfig>
  );
}

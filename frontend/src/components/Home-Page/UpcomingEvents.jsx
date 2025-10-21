import React from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  MotionConfig,
} from "framer-motion";

const BOOK_BG = "/src/assets/images/book-bg.png";
const CARD_IMG_1 = "/src/assets/images/event-1.png";
const CARD_IMG_2 = "/src/assets/images/event-2.png";
const CARD_IMG_3 = "/src/assets/images/event-3.png";
const ICON_CAL = "/src/assets/icons/icon-calendar.svg";

const events = [
  {
    cover: CARD_IMG_1,
    title: "Community Outreach Day",
    meta: "Saturday, May 18 at 9:00 AM",
    desc:
      "Join us as we spread love and help those in need in our local community. Volunteers are welcome!",
    to: "/events/1",
  },
  {
    cover: CARD_IMG_2,
    title: "Youth Group Summer Camp",
    meta: "June 24 – 28 · All Day",
    desc:
      "An exciting week of faith, fun, and fellowship for all high school students. Register now!",
    to: "/events/2",
  },
  {
    cover: CARD_IMG_3,
    title: "Sunday Worship Service",
    meta: "Every Sunday at 10:00 AM",
    desc:
      "Experience uplifting worship, inspiring sermons, and warm fellowship every Sunday.",
    to: "/events/3",
  },
];

export default function UpcomingEvents() {
  const prefersReduce = useReducedMotion();

  // Gentle parallax lift for the whole section (super subtle)
  const { scrollYProgress } = useScroll();
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, 16]);

  // Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 0.82, 0.2, 1] } },
  };

  const heading = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.82, 0.2, 1] } },
  };

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  // Book float (pure loop)
  const bookFloat = prefersReduce ? {} : {
    y: [0, -8, 0],
    transition: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <motion.section
        className="relative overflow-hidden"
        style={prefersReduce ? {} : { y: sectionY, willChange: "transform" }}
      >
        {/* Book */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[-120px] z-0 flex justify-center"
        >
          <motion.img
            src={BOOK_BG}
            alt=""
            className="w-[1550px] max-w-[100%] h-auto drop-shadow-2xl select-none"
            draggable="false"
            animate={bookFloat}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[100rem] px-4 sm:px-8 pt-10 lg:pt-14 pb-40">
          {/* Heading */}
          <motion.h2
            variants={heading}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold text-zinc-900 leading-tight"
          >
            Upcoming Events
          </motion.h2>

          {/* Cards */}
          <motion.div
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-[repeat(2,max-content)] lg:grid-cols-[repeat(3,max-content)] justify-center gap-10"
          >
            {events.map((e, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                className="w-full max-w-[320px] rounded-[14px] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                whileHover={prefersReduce ? undefined : { y: -4, boxShadow: "0 16px 36px rgba(0,0,0,0.10)" }}
                transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.7 }}
              >
                {/* Cover */}
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <motion.img
                    src={e.cover}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable="false"
                    whileHover={prefersReduce ? undefined : { scale: 1.04 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-[18px] sm:text-[19px] font-extrabold text-zinc-900">
                    {e.title}
                  </h3>

                  {/* Meta row */}
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-zinc-600">
                    <img
                      src={ICON_CAL}
                      alt=""
                      className="h-4 w-4 shrink-0"
                      draggable="false"
                    />
                    <span>{e.meta}</span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {e.desc}
                  </p>

                  {/* Button */}
                  <div className="mt-5">
                    <motion.div whileTap={prefersReduce ? undefined : { scale: 0.98 }}>
                      <Link
                        to={e.to}
                        className="block w-full text-center rounded-md border border-[#FFB86B] bg-[#FFF4EA] px-4 py-2 text-[13px] font-semibold text-[#BB5B0F] hover:brightness-95"
                      >
                        View Details
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}

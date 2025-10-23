import React from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import PANEL_BG from "/src/assets/images/Rectangle 31.png";

const people = [
  { photo: "/src/assets/images/people/pastor.png", lines: ["John","Christopher","Raguindin"], role: ["Project","Manager"] },
  { photo: "/src/assets/images/people/sarah.png",  lines: ["Ken","Camagay"],       role: ["Full-stack","Developer"] },
  { photo: "/src/assets/images/people/emily.png",  lines: ["Daniel","Cariaso"],      role: ["Database","Manager"] },
  { photo: "/src/assets/images/people/mark.png",   lines: ["Charls","Dar"],  role: ["Frontend","Developer"] },
  { photo: "/src/assets/images/people/sarah2.png", lines: ["April","Bravo"],       role: ["UI/UX","Designer"] },
];

export default function LeadershipTeam() {
  const prefersReduce = useReducedMotion();

  // Variants
  const fadeLeft = {
    hidden: { opacity: 0, x: -20, filter: "blur(6px)" },
    show:   { opacity: 1, x: 0,   filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 0.82, 0.2, 1] } },
  };

  const fade = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 0.82, 0.2, 1] } },
  };

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const avatarPop = prefersReduce
    ? {}
    : { scale: [0.9, 1.04, 1], opacity: [0, 1, 1], transition: { duration: 0.7, ease: [0.22, 0.82, 0.2, 1] } };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <section className="relative overflow-hidden bg-white mt-12">
        {/* Panel background */}
        <div className="relative h-[520px] sm:h-[560px] lg:h-[600px] w-full">
          <img
            src={PANEL_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top select-none pointer-events-none"
            draggable="false"
          />

          <div className="relative z-10 h-full">
            <div className="mx-auto max-w-[110rem] h-full px-4 sm:px-8">
              {/* side-by-side, centered vertically */}
              <div className="grid h-full items-center gap-8 grid-cols-1 lg:grid-cols-[440px_1fr]">
                {/* left: heading */}
                <div className="max-w-[440px]">
                  <motion.h2
                    variants={fadeLeft}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold leading-tight text-[#1F2937]"
                  >
                    Meet Our
                    <br />
                    Leadership Team
                  </motion.h2>

                  <motion.p
                    variants={fade}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3 text-[15px] sm:text-[16px] text-[#4B5563]"
                  >
                    Dedicated servants guiding our church
                    <br />
                    with wisdom and care.
                  </motion.p>
                </div>

                {/* right: cards */}
                <motion.div
                  variants={list}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  className="flex flex-wrap items-start gap-5 sm:gap-6 lg:gap-8"
                >
                  {people.map((p, i) => (
                    <motion.div
                      key={i}
                      variants={fade}
                      whileHover={prefersReduce ? undefined : { y: -4, boxShadow: "0 16px 36px rgba(0,0,0,0.10)" }}
                      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.7 }}
                      className="relative"
                    >
                      {/* soft-pill backdrop */}
                      <div className="rounded-[16px] bg-[#F3F4F6]/70 p-1">
                        {/* slim white card */}
                        <div className="relative w-[128px] sm:w-[140px] lg:w-[150px] h-[300px] rounded-[14px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200 pt-12 pb-4 px-3 text-center">
                          {/* avatar bubble, overlapping top */}
                          <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2" animate={avatarPop}>
                            <div className="h-[60px] w-[60px] sm:h-[64px] sm:w-[64px] rounded-full ring-4 ring-white overflow-hidden shadow-md">
                              <img
                                src={p.photo}
                                alt=""
                                className="h-full w-full object-cover"
                                draggable="false"
                              />
                            </div>
                          </motion.div>

                          {/* name */}
                          <p className="mt-6 text-[14px] sm:text-[15px] font-extrabold leading-[1.15] text-[#111827] tracking-tight">
                            {p.lines.map((line, idx) => (
                              <span key={idx}>
                                {line}
                                {idx !== p.lines.length - 1 ? <br /> : null}
                              </span>
                            ))}
                          </p>

                          {/* role */}
                          <p className="mt-3 text-[14px] leading-4 text-[#6B7280]">
                            {p.role.map((r, idx) => (
                              <span key={idx}>
                                {r}
                                {idx !== p.role.length - 1 ? <br /> : null}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                {/* /cards */}
              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </section>
    </MotionConfig>
  );
}

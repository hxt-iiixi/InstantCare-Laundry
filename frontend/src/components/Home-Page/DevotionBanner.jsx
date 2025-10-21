import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  MotionConfig,
} from "framer-motion";

const BG = "/src/assets/images/devotion-bg.jpg";
const ROSARY = "/src/assets/icons/rosary.png";
const SPARKS = "/src/assets/icons/sparks.svg";

export default function DevotionBanner() {
  const prefersReduce = useReducedMotion();
  const sectionRef = useRef(null);

  // Scroll parallax (kept subtle)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.0]);

  // Opening animations
  const word = {
    hidden: { opacity: 0, y: 18, rotateX: 12, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
  };
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };

  const sparkAnim = prefersReduce
    ? {}
    : {
        scale: [1, 1.08, 1],
        opacity: [0.65, 1, 0.65],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      };

  // Rosary back to earlier simple pendulum + float (no mouse effect)
  const rosaryFloat = prefersReduce
    ? {}
    : { y: [0, -10, 0], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } };
  const rosarySway = prefersReduce ? 0 : { rotate: [-4, 4, -4] };
  const rosarySwayTransition = prefersReduce ? {} : { rotate: { duration: 8.5, repeat: Infinity, ease: "easeInOut" } };

  const title = "Daily Devotion & Bible Verse".split(" ");

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <section ref={sectionRef} className="relative bg-[#FBF7F3]">
        <div className="relative mx-auto max-w-[100rem]">
          {/* Background with gentle parallax */}
          <motion.img
            src={BG}
            alt=""
            draggable="false"
            aria-hidden="true"
            style={prefersReduce ? {} : { y: bgY, scale: bgScale, willChange: "transform" }}
            className="absolute inset-0 h-[620px] sm:h-[620px] lg:h-[730px] w-full object-cover object-[85%_center]"
          />

          {/* Content */}
          <div className="relative z-10 mx-auto h-[560px] sm:h-[620px] lg:h-[680px] max-w-7xl px-4 sm:px-8">
            <div className="flex h-full items-center justify-start">
              <div className="relative text-center pl-2 sm:pl-8 lg:pl-24">
                {/* Spark */}
                <div className="relative inline-block">
                  <motion.img
                    src={SPARKS}
                    alt=""
                    draggable="false"
                    className="pointer-events-none absolute -top-7 sm:-top-8 -left-6 sm:-left-10 w-10 sm:w-16 select-none"
                    animate={sparkAnim}
                  />

                  {/* Headline with staggered reveal */}
                  <motion.h2
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative inline-block text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold text-[#FF7A2F]"
                  >
                    {title.map((w, i) => (
                      <motion.span
                        key={i}
                        variants={word}
                        transition={{ duration: 0.6, ease: [0.22, 0.82, 0.2, 1] }}
                        className="inline-block mr-[6px]"
                      >
                        {w}
                      </motion.span>
                    ))}

                    {/* subtle underline entrance */}
                    {!prefersReduce && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.9, ease: [0.22, 0.82, 0.2, 1] }}
                        className="absolute -bottom-1 left-0 h-[3px] w-full origin-left"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(255,122,47,0) 0%, rgba(255,122,47,0.9) 35%, rgba(255,122,47,0.9) 65%, rgba(255,122,47,0) 100%)",
                        }}
                      />
                    )}
                  </motion.h2>
                </div>

                <motion.p
                  variants={word}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, delay: 0.15 }}
                  className="mt-3 text-[15px] sm:text-[16px] text-neutral-800 max-w-xl"
                >
                  “Let love be genuine. Abhor what is evil; hold fast to what is good.”
                </motion.p>

                <motion.p
                  variants={word}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, delay: 0.22 }}
                  className="text-[13px] sm:text-[14px] text-neutral-600"
                >
                  — Romans 12:9 (NKJV)
                </motion.p>

                <motion.div
                  variants={word}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, delay: 0.3 }}
                  className="mt-5"
                >
                  <Link
                    to="/about"
                    className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-black/5 transition-transform hover:shadow hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Learn More About Us
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Rosary — back to previous placement & simple motion */}
          <motion.img
            src={ROSARY}
            alt=""
            draggable="false"
            className="
              pointer-events-none absolute
              left-[7%] sm:left-[9%]
              top-[66%] sm:top-[64%] lg:top-[55%]
              w-[190px] sm:w-[210px] lg:w-[300px]
              select-none origin-top"
            animate={rosaryFloat}
            transition={rosarySwayTransition}
            style={rosarySway}
          />
        </div>
      </section>
    </MotionConfig>
  );
}

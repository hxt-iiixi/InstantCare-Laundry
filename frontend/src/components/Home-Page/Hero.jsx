import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const prefersReduce = useReducedMotion();

  // Reusable variants
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.08 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1] } }
  };

  const riseRight = {
    hidden: { opacity: 0, x: 24, y: 8, scale: 0.98 },
    show:   { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 2, ease: [0.22, 0.82, 0.2, 1], delay: 0.15 } }
  };

  const floatY = prefersReduce ? {} : {
    y: [0, -6, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };
  
  const tilt = prefersReduce ? {} : {
    rotate: [0, 1.2, -1.2, 0],
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" }
  };
  
  return (
    <section className="relative overflow-x-visible overflow-y-visible bg-[#FBF7F3] pb-56 lg:pb-64 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pl-14 xl:pl-24 pt-10 lg:pt-14">
        <div className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-6 lg:translate-x-4">
            <motion.img
              src="/src/assets/icons/cross.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute z-30 top-0 transform-gpu
                left-[-120px] sm:left-[-100px] lg:left-[-58px] xl:left-[-190px] 2xl:left-[-220px]
                h-56 sm:h-64 lg:h-72 xl:h-80 w-auto sm:scale-100 scale-[0.92]"
              style={{ willChange: "transform" }}
              animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" } }}
            />
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
              <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[52px] font-black tracking-tight text-black">
                <motion.span className="block" variants={fadeUp}>Empowering Faith,</motion.span>
                <motion.span className="block" variants={fadeUp}>Building Community,</motion.span>
                <motion.span className="block" variants={fadeUp}>Lead with Clarity.</motion.span>
              </h1>
              <motion.p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-zinc-700" variants={fadeUp}>
                A place where faith grows, community flourishes, and lives are touched by God’s love.
              </motion.p>
              <motion.div className="mt-8" variants={fadeUp}>
                <Link
                  to="/join"
                  className="inline-flex items-center rounded-xl bg-[#FF7A2F] px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]"
                >
                  Join Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="relative lg:col-span-6">
            <motion.img
              src="/src/assets/icons/family-church.svg"
              alt="Family walking from church"
              className="ml-auto h-auto w-full max-w-[460px] lg:max-w-[500px] relative z-10"
              variants={riseRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              style={{ willChange: "transform" }}
            />
          </div>
        </div>
      </div>

      <motion.img
        src="/src/assets/icons/arrow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute z-20 transform-gpu w-[520px] max-w-[78vw] h-auto left-[28%] sm:left-[30%] lg:left-[32%] bottom-0 sm:bottom-2 lg:bottom-4"
        style={{ willChange: "transform" }}
        animate={{ y: [0, -8, 0], rotate: [0, -0.6, 7] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
      />
    </section>
  );
}

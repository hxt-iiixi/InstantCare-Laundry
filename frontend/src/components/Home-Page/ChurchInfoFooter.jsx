import React from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import ampowerLogo from "/src/assets/icons/ampower-ehite.png";
import fbIcon from "/src/assets/icons/facebook-white.svg";
import twIcon from "/src/assets/icons/twitter-white.svg";
import igIcon from "/src/assets/icons/instagram-white.svg";
import FOOT_BG from "/src/assets/images/foot.png";

export default function ChurchInfoFooter() {
  const prefersReduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 0.82, 0.2, 1] } },
  };

  return (
    <MotionConfig reducedMotion={prefersReduce ? "always" : "never"}>
      <motion.footer
        className="relative text-gray-200 overflow-hidden"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        {/* BG layer: image + dark overlay with gentle zoom on reveal */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${FOOT_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
          initial={prefersReduce ? {} : { scale: 1.05, y: 10 }}
          whileInView={prefersReduce ? {} : { scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-[#171615]/92" aria-hidden />

        {/* angled top cap */}
     

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
          {/* row: logo + headline */}
          <motion.div className="flex items-start gap-4" variants={fadeUp}>
            <img src={ampowerLogo} alt="AmPower" className="h-7 w-auto md:h-8 shrink-0" />
            <h3 className="font-serif font-extrabold text-white leading-tight text-[22px] md:text-[30px]">
              <span className="whitespace-nowrap">Building stronger Churches</span>
              <br />
              <span className="whitespace-nowrap">for the next Generation.</span>
            </h3>
          </motion.div>

          {/* content columns */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            {/* col 1 */}
            <motion.div className="md:col-span-4" variants={fadeUp}>
              <p className="text-sm text-gray-200/90 max-w-prose">
                We believe in the power of connection and shared faith. Come and be a part of our growing church family.
              </p>
              <div className="mt-5">
                <p className="text-sm text-white font-semibold">Features:</p>
                <p className="mt-1 text-sm text-gray-200/90 max-w-prose">
                  We believe in the power of connection and shared faith. Come and be a part of our growing church family.
                </p>
              </div>
            </motion.div>

            {/* divider */}
            <div className="hidden md:block md:col-span-1">
              <div className="h-full border-l border-white/15" />
            </div>

            {/* col 2 */}
            <motion.div className="md:col-span-4" variants={fadeUp}>
              <p className="text-sm text-gray-200/90 max-w-prose">
                We believe in the power of connection and shared faith. Come and be a part of our growing church family.
              </p>
              <div className="mt-5">
                <p className="text-sm text-white font-semibold">Support:</p>
                <p className="mt-1 text-sm text-gray-200/90 max-w-prose">
                  We believe in the power of connection and shared faith. Come and be a part of our growing church family.
                </p>
              </div>
            </motion.div>

            {/* divider */}
            <div className="hidden md:block md:col-span-1">
              <div className="h-full border-l border-white/15" />
            </div>

            {/* col 3: follow */}
            <motion.div className="md:col-span-2" variants={fadeUp}>
              <p className="text-sm text-white font-semibold">Follow Us</p>
              <div className="mt-2 flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="opacity-90 hover:opacity-100 transition">
                  <img src={fbIcon} alt="" className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Twitter" className="opacity-90 hover:opacity-100 transition">
                  <img src={twIcon} alt="" className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Instagram" className="opacity-90 hover:opacity-100 transition">
                  <img src={igIcon} alt="" className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* bottom rule */}
          <motion.div className="mt-8 border-t border-white/10" variants={fadeUp} />

          {/* copyright */}
          <motion.div className="py-6" variants={fadeUp}>
            <p className="text-center text-[13px] text-gray-200/90">
              © 2025 <span className="text-white">AmPower</span> •{" "}
              <a href="#" className="hover:text-white">Home</a> •{" "}
              <a href="#" className="hover:text-white">About</a> •{" "}
              <a href="#" className="hover:text-white">Events</a> •{" "}
              <a href="#" className="hover:text-white">Contact</a>
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </MotionConfig>
  );
}

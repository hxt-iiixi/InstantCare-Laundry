import React from "react";
import { Link } from "react-router-dom";

// Replace with your actual files
const BG = "/src/assets/images/devotion-bg.jpg";    
const ROSARY = "/src/assets/icons/rosary.png";       
const SPARKS = "/src/assets/icons/sparks.svg";      

export default function DevotionBanner() {
  return (
    <section className="relative bg-[#FBF7F3]">
      <div className="relative mx-auto max-w-[100rem]">
        {/* Background image */}
        <img
          src={BG}
          alt=""
          className="
            absolute inset-0 h-[6200px] sm:h-[620px] lg:h-[680px] w-full
            object-cover
            object-[85%_center]   /* keep focus to the right so the hands show */
          "
          draggable="false"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto h-[560px] sm:h-[620px] lg:h-[680px] max-w-7xl px-4 sm:px-8">
          <div className="flex h-full items-center justify-start">
            <div className="relative text-center pl-2 sm:pl-8 lg:pl-24">
             
            {/* Spark anchored to the heading */}
              <div className="relative inline-block">
                <img
                  src={SPARKS}
                  alt=""
                  className="pointer-events-none absolute -top-7 sm:-top-8 -left-6 sm:-left-10 w-10 sm:w-16 select-none"
                  draggable="false"
                />
                <h2 className="text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold text-[#FF7A2F]">
                  Daily Devotion &amp; Bible Verse
                </h2>
              </div>


              <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-800 max-w-xl">
                “Let love be genuine. Abhor what is evil; hold fast to what is good.”
              </p>
              <p className="text-[13px] sm:text-[14px] text-neutral-600">
                — Romans 12:9 (NKJV)
              </p>

              <div className="mt-5">
                <Link
                  to="/about"
                  className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-black/5 hover:shadow transition-shadow"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rosary — bigger and lowered to align with the button */}
        <img
          src={ROSARY}
          alt=""
          className="
            pointer-events-none absolute
            left-[7%] sm:left-[9%]
            top-[66%] sm:top-[64%] lg:top-[55%]
            w-[190px] sm:w-[210px] lg:w-[300px]
            select-none
          "
          draggable="false"
        />
      </div>
    </section>
  );
}

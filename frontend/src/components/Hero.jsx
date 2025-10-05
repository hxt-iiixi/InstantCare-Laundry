import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-x-visible overflow-y-visible bg-[#FBF7F3] pb-56 lg:pb-64">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14">
        <div className="relative grid items-center gap-10 lg:grid-cols-12">
        
          <div className="relative lg:col-span-7">
         
            <img
              src="/src/assets/icons/cross.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none select-none absolute z-30
                top-0
                left-[-200px] sm:left-[-240px] lg:left-[-300px]
                h-64 sm:h-72 lg:h-80 w-auto
              "
            />

            <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[56px] font-black tracking-tight text-black">
              Empowering Faith,
              <br />
              Building Community,
              <br />
              Lead with Clarity.
            </h1>

            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-zinc-700">
              A place where faith grows, community flourishes, and lives are
              touched by God’s love. Join us in worship, service, and
              fellowship as we walk together and shine His light.
            </p>

            <div className="mt-8">
              <Link
                to="/join"
                className="inline-flex items-center rounded-xl bg-[#FF7A2F] px-6 py-3 text-base font-semibold text-white shadow-sm hover:opacity-90"
              >
                Join Now
              </Link>
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="relative lg:col-span-5">
            <img
              src="/src/assets/icons/family-church.svg"
              alt="Family walking from church"
              className="ml-auto h-auto w-full max-w-[520px] relative z-10"
            />
          </div>
        </div>
      </div>

      {/* ARROW — kept low & slightly left per last tweak */}
      <img
        src="/src/assets/icons/arrow.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none select-none absolute z-20
          w-[520px] max-w-[78vw] h-auto
          left-[30%] sm:left-[31%] lg:left-[33%]
          bottom-0 sm:bottom-2 lg:bottom-4
        "
      />
    </section>
  );
}

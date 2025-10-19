import React from "react";
import PANEL_BG from "/src/assets/images/Rectangle 31.png";

const people = [
  { photo: "/src/assets/images/people/pastor.png", lines: ["Pastor","David","Lee"], role: ["Lead","Pastor"] },
  { photo: "/src/assets/images/people/sarah.png",  lines: ["Sarah","Chen"],       role: ["Youth","Director"] },
  { photo: "/src/assets/images/people/emily.png",  lines: ["Emily","White"],      role: ["Community","Outreach Lead"] },
  { photo: "/src/assets/images/people/mark.png",   lines: ["Mark","John","son"],  role: ["Worship","Leader"] },
  { photo: "/src/assets/images/people/sarah2.png", lines: ["Sarah","Chen"],       role: ["Youth","Director"] },
];

export default function LeadershipTeam() {
  return (
    <section className="relative overflow-hidden bg-white mt-12">
      {/* full-width panel bg */}
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
                <h2 className="text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold leading-tight text-[#1F2937]">
                  Meet Our
                  <br />
                  Leadership Team
                </h2>
                <p className="mt-3 text-[15px] sm:text-[16px] text-[#4B5563]">
                  Dedicated servants guiding our church
                  <br />
                  with wisdom and care.
                </p>
              </div>

              {/* right: cards */}
              <div className="flex flex-wrap items-start gap-5 sm:gap-6 lg:gap-8">
                {people.map((p, i) => (
                  <div key={i} className="relative">
                    {/* soft-pill backdrop */}
                    <div className="rounded-[16px] bg-[#F3F4F6]/70 p-1">
                      {/* slim white card */}
                      <div className="relative w-[128px] sm:w-[140px] lg:w-[150px] h-[300px] rounded-[14px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200 pt-12 pb-4 px-3 text-center">
                        {/* avatar bubble, overlapping top */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                          <div className="h-[60px] w-[60px] sm:h-[64px] sm:w-[64px] rounded-full ring-4 ring-white overflow-hidden shadow-md">
                            <img
                              src={p.photo}
                              alt=""
                              className="h-full w-full object-cover"
                              draggable="false"
                            />
                          </div>
                        </div>

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
                  </div>
                ))}
              </div>
              {/* /cards */}
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </section>
  );
}

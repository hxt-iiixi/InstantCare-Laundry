import React from "react";
import { Link } from "react-router-dom";

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
  return (
    <section className="relative bg-[#FBF7F3] overflow-hidden">
      {/* Book */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-120px] z-0 flex justify-center"
      >
        <img
          src={BOOK_BG}
          alt=""
          className="w-[1550px] max-w-[100%] h-auto drop-shadow-2xl select-none"
          draggable="false"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[100rem] px-4 sm:px-8 pt-10 lg:pt-14 pb-40">
        {/* Heading */}
        <h2 className="text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold text-zinc-900 leading-tight">
          Upcoming Events
        </h2>

        {/* Cards — a bit thinner */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-[repeat(2,max-content)] lg:grid-cols-[repeat(3,max-content)] justify-center gap-10">
          {events.map((e, i) => (
            <article
              key={i}
              className="w-full max-w-[320px] rounded-[14px] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              {/* Cover */}
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={e.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable="false"
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
                  <Link
                    to={e.to}
                    className="block w-full text-center rounded-md border border-[#FFB86B] bg-[#FFF4EA] px-4 py-2 text-[13px] font-semibold text-[#BB5B0F] hover:brightness-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

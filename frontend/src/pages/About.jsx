import { useState } from "react";
import Navbar from "../components/Navbar";

import heroGlass from "../assets/images/aboutBG.jpg";
import churchFaded from "../assets/images/about2.jpg";
import circleA from "../assets/icons/circle1.svg";
import circleB from "../assets/icons/circle2.svg";
import circleC from "../assets/icons/circle3.svg";
import circleD from "../assets/icons/circle1.svg";

import ArcWheelV5 from "../components/ArcWheelV5";

export default function About() {
  // Track which absolute image index is currently in the LEFT (BIG) slot (0..3)
  const [leftIdx, setLeftIdx] = useState(1); // when offset=0, LEFT is index 1

  // Dedicated copy for each circle (index-aligned with images)
  const copies = [
    {
      title: "Rooted in Faith, Growing in Love",
      p1: "Top copy: Our church is built on a strong foundation of faith, grounded in God’s Word and guided by His Spirit. For generations, we have been a place where hearts are renewed, families are strengthened, and lives are transformed through the love of Christ.",
      p2: "Top copy: We honor the heritage of our faith, cherishing traditions that remind us of God’s goodness through the years, while embracing the modern call to reach out and serve our community."
    },
    {
      title: "Rooted in Faith, Growing in Love",
      p1: "Left (featured) copy: Our church is built on a strong foundation of faith, grounded in God’s Word and guided by His Spirit. For generations, we have been a place where hearts are renewed, families are strengthened, and lives are transformed through the love of Christ.",
      p2: "Left (featured) copy: We honor the heritage of our faith, cherishing the traditions that remind us of God’s goodness through the years, while embracing the modern call to reach out and serve our community."
    },
    {
      title: "Rooted in Faith, Growing in Love",
      p1: "Right copy: Our church is built on a strong foundation of faith, grounded in God’s Word and guided by His Spirit. For generations, we have been a place where hearts are renewed, families are strengthened, and lives are transformed through the love of Christ.",
      p2: "Right copy: We honor the heritage of our faith, cherishing the traditions that remind us of God’s goodness through the years, while embracing the modern call to reach out and serve our community."
    },
    {
      title: "Rooted in Faith, Growing in Love",
      p1: "Bottom copy: Our church is built on a strong foundation of faith, grounded in God’s Word and guided by His Spirit. For generations, we have been a place where hearts are renewed, families are strengthened, and lives are transformed through the love of Christ.",
      p2: "Bottom copy: We honor the heritage of our faith, cherishing the traditions that remind us of God’s goodness through the years, while embracing the modern call to reach out and serve our community."
    }
  ];

  return (
    <>
      <Navbar />

      {/* SECTION 1: Top hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${heroGlass})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pt-10 md:pt-12" />
          <div className="min-h-[260px] md:min-h-[320px] lg:min-h-[380px] flex items-center">
            <div className="text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                About the Church Family
              </h1>
              <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl">
                Discover the journey, beliefs, and the wonderful people who make up Church Connect.
              </p>
            </div>
          </div>
          <div className="pb-6 md:pb-10" />
        </div>
      </section>

      {/* ============ SECTION 2: Story + wheel ============ */}
      <section className="relative overflow-hidden">
        {/* Faded background */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${churchFaded})` }}
        />
        {/* Optional wash */}
        <div className="absolute inset-0" />

       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left copy (stacked cross-fade by leftIdx) */}
            <div className="order-1 lg:order-1 relative">
              <div className="relative min-h-[240px]">
                {copies.map((c, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: i === leftIdx ? 1 : 0 }}
                  >
                    <h2 className="font-serif italic text-[34px] md:text-[38px] lg:text-[40px] text-gray-800 mb-5">
                      {c.title}
                    </h2>
                    <div className="space-y-5 text-gray-700 leading-relaxed max-w-[560px]">
                      <p>{c.p1}</p>
                      <p>{c.p2}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: hard-align to the container’s right edge */}
            <div className="order-2 lg:order-2 lg:col-start-2 relative">
              <div className="ml-auto">
                {/* Overhang beyond the container so the RIGHT circle is off-screen */}
                <div style={{ marginRight: "min(-28vw, -200px)" }}>
                  <ArcWheelV5
                    images={[circleA, circleB, circleC, circleD]} // 0..3
                    arcCenterX={730}
                    arcCenterY={260}
                    arcRadius={240}
                    bigSize={360}
                    thumbTop={160}
                    thumbRight={160}
                    thumbBottom={160}
                    durationMs={650}
                    easing="cubic-bezier(.22,.9,.22,1)"
                    onLeftChange={setLeftIdx}   // updates which text fades in
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: three columns */}
      <section className="bg-[#D9D9D9]">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-10 lg:py-25">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-gray-900">Our Mission &amp; Vision</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To be a thriving spiritual home where lives are transformed, gifts are discovered, and the Kingdom of God
                is tangibly experienced and shared with the world.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-gray-900">Our Mission Statement</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To connect people with God, with each other, and with our community through worship, discipleship, and
                compassionate service, reflecting Christ&apos;s love in all we do.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-gray-900">Our Vision for the Future</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To be a thriving spiritual home where lives are transformed, gifts are discovered, and the Kingdom of God
                is tangibly experienced and shared with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/** =========================
       *  SECTION 4: Core Values row
       *  ========================= */}
      <section className="bg-white">
        + <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Community",
                text:
                  "Fostering a loving and supportive family where everyone belongs.",
                Icon: () => (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-orange-500">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5ZM2 20a8 8 0 0 1 16 0v1H2Z" />
                    <path d="M19 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM18 22h4v-1a5.9 5.9 0 0 0-3-5" />
                  </svg>
                )
              },
              {
                title: "Growth",
                text:
                  "Encouraging spiritual and personal development through faith and learning.",
                Icon: () => (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-orange-500" fill="none" strokeWidth="2">
                    <path d="M3 21h18M7 21V10m5 11V6m5 15V14" />
                    <path d="M7 10l3-3 3 3 4-4" />
                  </svg>
                )
              },
              {
                title: "Service",
                text:
                  "Actively serving our neighbors and the world with compassion.",
                Icon: () => (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-orange-500" fill="none" strokeWidth="2">
                    <path d="M12 21s-7-4.35-7-10a7 7 0 0 1 14 0c0 5.65-7 10-7 10Z" />
                    <path d="M9 10h6M9 13h6" />
                  </svg>
                )
              },
              {
                title: "Integrity",
                text:
                  "Living out our faith with honesty, transparency, and moral conviction.",
                Icon: () => (
                  <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-orange-500" fill="none" strokeWidth="2">
                    <path d="M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6l7-4Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                )
              }
            ].map(({ title, text, Icon }, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-orange-50 p-3 ring-1 ring-orange-100">
                    <Icon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/** ==================================
       *  SECTION 5: Meet Our Leadership Team
       *  ================================== */}
      <section className="bg-gray-50">
        + <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-36">
          <div className="text-center">
            <h2 className="text-2xl md:text-[28px] font-extrabold text-gray-900">
              Meet Our Leadership <span className="block">Team</span>
            </h2>
            <p className="text-gray-600 mt-3">
              Dedicated servants guiding our church with wisdom and care.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {[
              {
                name: "Pastor David Lee",
                roleLine1: "Lead",
                roleLine2: "Pastor",
                img: "https://i.pravatar.cc/160?img=12"
              },
              {
                name: "Sarah Chen",
                roleLine1: "Youth",
                roleLine2: "Director",
                img: "https://i.pravatar.cc/160?img=32"
              },
              {
                name: "Emily White",
                roleLine1: "Community",
                roleLine2: "Outreach Lead",
                img: "https://i.pravatar.cc/160?img=47"
              },
              {
                name: "Mark Johnson",
                roleLine1: "Worship",
                roleLine2: "Leader",
                img: "https://i.pravatar.cc/160?img=66"
              }
            ].map((p, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-2 ring-white shadow">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {p.name.split(" ").slice(0, 2).join(" ")} <br />
                    {p.name.split(" ").slice(2).join(" ")}
                  </div>
                  <div className="text-[11px] text-gray-500 leading-tight mt-1">
                    {p.roleLine1} <br /> {p.roleLine2}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/** ==============================
       *  SECTION 6: Hear From Our Community
       *  ============================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h2 className="text-2xl md:text-[26px] font-extrabold text-gray-900">
              Hear From Our <span className="block">Community</span>
            </h2>
            <p className="text-gray-600 mt-2">
              What our members are saying about <br className="hidden sm:block" />
              Church Connect.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                text:
                  "Church Connect has truly been a blessing in my life. The community here is so welcoming, and the sermons are incredibly uplifting. I've found a place where I truly feel at home.",
                author: "Jessica Miller",
                note: "Long-time Member"
              },
              {
                text:
                  "Church Connect has truly been a blessing in my life. The community here is so welcoming, and the sermons are incredibly uplifting. I've found a place where I truly feel at home.",
                author: "Jessica Miller",
                note: "Long-time Member"
              },
              {
                text:
                  "From the moment I walked in, I felt a genuine sense of belonging. The youth programs are fantastic, and my kids absolutely love attending. It's more than just a church; it's a family.",
                author: "Michael Brown",
                note: "Parent & Volunteer"
              },
              {
                text:
                  "Church Connect has truly been a blessing in my life. The community here is so welcoming, and the sermons are incredibly uplifting. I've found a place where I truly feel at home.",
                author: "Jessica Miller",
                note: "Long-time Member"
              },
              {
                text:
                  "Church Connect has truly been a blessing in my life. The community here is so welcoming, and the sermons are incredibly uplifting. I've found a place where I truly feel at home.",
                author: "Jessica Miller",
                note: "Long-time Member"
              }
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-2">
                  {/* quote mark */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-orange-500 shrink-0"
                    fill="currentColor"
                  >
                    <path d="M7 6h4v4H9v4H5V9a3 3 0 0 1 2-3Zm8 0h4v4h-2v4h-4V9a3 3 0 0 1 2-3Z" />
                  </svg>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t.text}
                  </p>
                </div>
                <div className="mt-5">
                  <div className="text-sm font-semibold text-gray-900">{t.author}</div>
                  <div className="text-[11px] text-gray-500">{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

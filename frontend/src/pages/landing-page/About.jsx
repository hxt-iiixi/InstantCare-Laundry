import { useState } from "react";
import Navbar from "../../components/Navbar";

import heroGlass from "../../assets/images/aboutBG.jpg";
import churchFaded from "../../assets/images/about2.jpg";
import circleA from "../../assets/icons/circle1.svg";
import circleB from "../../assets/icons/circle2.svg";
import circleC from "../../assets/icons/circle3.svg";
import circleD from "../../assets/icons/circle1.svg";
import jesus from "../../assets/icons/jesus.png";   
import praying from "../../assets/icons/praying.svg";      
import iconVision from "../../assets/icons/bible.svg";         
import ArcWheelV5 from "../../components/ArcWheelV5";
import iconCommunity from "../../assets/icons/community.svg";
import iconGrowth from "../../assets/icons/growth.svg";
import iconService from "../../assets/icons/service.svg";
import iconIntegrity from "../../assets/icons/integrity.svg";
import ampowerLogo from "../../assets/icons/ampower-ehite.png";
import fbIcon from "../../assets/icons/facebook-white.svg";
import twIcon from "../../assets/icons/twitter-white.svg";
import igIcon from "../../assets/icons/instagram-white.svg";
import BackgroundMusic from "../../components/BackgroundMusic";
import GlobalLayout from "../../components/PersistentLayout";
export default function About() {

  const [leftIdx, setLeftIdx] = useState(1); // when offset=0, LEFT is index 1

  
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
      <GlobalLayout>
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
            {/* Left copy  */}
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

            {/* Right column:*/}
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
                    onLeftChange={setLeftIdx} // updates which text fades in
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3 ===================== */}
      <section className="bg-[#F8F4F2]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-12 md:space-y-16">

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-3 items-center">
              {/* ICON */}
              <div className="md:col-span-5 flex justify-center md:justify-start">
                <div className="w-56 h-56 md:w-80 md:h-80 rounded-2xl bg-[#F8F4F2] flex items-center justify-center overflow-hidden">
                  <img src={jesus} alt="Mission & Vision icon" className="h-[95%] w-[95%] object-contain" />
                </div>
              </div>

              {/* COPY */}
              <div className="md:col-span-7 text-center md:text-left md:-ml-2">
                <h3 className="text-[30px] md:text-[36px] font-extrabold tracking-tight text-gray-900">
                  Our Mission &amp; Vision
                </h3>
                <p className="mt-3 text-[16px] md:text-[18px] text-gray-700 leading-7 md:leading-8 max-w-[54ch] mx-auto md:mx-0">
                  To be a thriving spiritual home where lives are transformed by God’s grace, gifts are discovered and nurtured,
                  and the Kingdom of God is experienced in worship, fellowship, and service, then shared with the world in love and purpose.
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-3 items-center">
              {/* COPY */}
              <div className="md:col-span-7 order-2 md:order-1 text-center md:text-left md:-mr-2">
                <h3 className="text-[30px] md:text-[36px] font-extrabold tracking-tight text-gray-900">
                  Our Mission Statement
                </h3>
                <p className="mt-3 text-[16px] md:text-[18px] text-gray-700 leading-7 md:leading-8 max-w-[54ch] mx-auto md:mx-0">
                  To connect people with God, with each other, and with our community through worship, discipleship,
                  and compassionate service, reflecting Christ&apos;s love in all we do.
                </p>
              </div>

              {/* ICON */}
              <div className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-end">
                <div className="w-56 h-56 md:w-80 md:h-80 rounded-2xl bg-[#F8F4F2] flex items-center justify-center overflow-hidden">
                  <img src={praying} alt="Mission Statement icon" className="h-[95%] w-[95%] object-contain" />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-3 items-center">
              {/* ICON */}
              <div className="md:col-span-5 flex justify-center md:justify-start">
                <div className="w-56 h-56 md:w-80 md:h-80 rounded-2xl bg-[#F8F4F2] flex items-center justify-center overflow-hidden">
                  <img src={iconVision} alt="Vision icon" className="h-[95%] w-[95%] object-contain" />
                </div>
              </div>

              {/* COPY */}
              <div className="md:col-span-7 text-center md:text-left md:-ml-2">
                <h3 className="text-[30px] md:text-[36px] font-extrabold tracking-tight text-gray-900">
                  Our Vision for the Future
                </h3>
                <p className="mt-3 text-[16px] md:text-[18px] text-gray-700 leading-7 md:leading-8 max-w-[54ch] mx-auto md:mx-0">
                  To be a thriving spiritual home where lives are transformed, gifts are discovered, and the Kingdom of God
                  is tangibly experienced and shared with the world.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ===================== SECTION 4 ===================== */}
      <section className="bg-white">
        {/* light beige cap */}
        <div className="h-10 w-full bg-[#F3EEEA]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 pb-16 md:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">

            {/* Community */}
            <div className="rounded-xl bg-white ring-1 ring-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <img src={iconCommunity} alt="Community icon" className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Community</h4>
              <p className="mt-1 text-[13px] leading-5 text-gray-600 max-w-[26ch] mx-auto">
                Fostering a loving and supportive family where everyone belongs.
              </p>
            </div>

            {/* Growth */}
            <div className="rounded-xl bg-white ring-1 ring-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <img src={iconGrowth} alt="Growth icon" className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Growth</h4>
              <p className="mt-1 text-[13px] leading-5 text-gray-600 max-w-[26ch] mx-auto">
                Encouraging spiritual and personal development through faith and learning.
              </p>
            </div>

            {/* Service */}
            <div className="rounded-xl bg-white ring-1 ring-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <img src={iconService} alt="Service icon" className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Service</h4>
              <p className="mt-1 text-[13px] leading-5 text-gray-600 max-w-[26ch] mx-auto">
                Actively serving our neighbors and the world with compassion.
              </p>
            </div>

            {/* Integrity */}
            <div className="rounded-xl bg-white ring-1 ring-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <img src={iconIntegrity} alt="Integrity icon" className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Integrity</h4>
              <p className="mt-1 text-[13px] leading-5 text-gray-600 max-w-[26ch] mx-auto">
                Living out our faith with honesty, transparency, and moral conviction.
              </p>
            </div>

          </div>
        </div>
      </section>
      {/* ===================== SECTION 5 ===================== */}
      <section className="relative bg-[#F8F4F2]">
        {/* angled beige cap */}
        <div
          className="absolute -top-10 left-0 right-0 h-20 bg-[#F3EEEA] [clip-path:polygon(0_0,100%_0,100%_70%,0_100%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
            {/* LEFT: heading + subhead */}
            <div className="md:col-span-3">
              <h2 className="text-[28px] md:text-[34px] font-extrabold leading-tight text-gray-900">
                Meet Our
                <span className="block">Leadership Team</span>
              </h2>
              <p className="mt-3 text-[15px] text-gray-600 max-w-[36ch]">
                Dedicated servants guiding our church
                with wisdom and care.
              </p>
            </div>

            {/* RIGHT: five slim cards in one line */}
            <div className="md:col-span-9">
              <div className="flex flex-nowrap justify-between gap-4 sm:gap-5 overflow-x-auto md:overflow-visible">
                {[
                  {
                    img: "https://i.pravatar.cc/160?img=12",
                    name1: "Pastor",
                    name2: "David Lee",
                    role1: "Lead",
                    role2: "Pastor",
                  },
                  {
                    img: "https://i.pravatar.cc/160?img=32",
                    name1: "Sarah",
                    name2: "Chen",
                    role1: "Youth",
                    role2: "Director",
                  },
                  {
                    img: "https://i.pravatar.cc/160?img=47",
                    name1: "Emily",
                    name2: "White",
                    role1: "Community",
                    role2: "Outreach Lead",
                  },
                  {
                    img: "https://i.pravatar.cc/160?img=66",
                    name1: "Mark",
                    name2: "Johnson",
                    role1: "Worship",
                    role2: "Leader",
                  },
                  {
                    img: "https://i.pravatar.cc/160?img=32",
                    name1: "Sarah",
                    name2: "Chen",
                    role1: "Youth",
                    role2: "Director",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="relative w-[148px] sm:w-[150px] shrink-0 rounded-xl bg-white ring-1 ring-gray-100 shadow-sm pt-9 pb-4 text-center"
                  >
                    {/* avatar overlap */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-white shadow">
                        <img src={p.img} alt={`${p.name1} ${p.name2}`} className="h-full w-full object-cover" />
                      </div>
                    </div>

                    {/* name (two lines, bold, tight) */}
                    <div className="mt-2 px-3">
                      <div className="text-[15px] font-semibold text-gray-900 leading-tight">
                        {p.name1}
                        <br />
                        {p.name2}
                      </div>

                      {/* role (two lines, small gray) */}
                      <div className="mt-2 text-[11px] text-gray-500 leading-tight">
                        {p.role1}
                        <br />
                        {p.role2}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* ===================== FOOTER ===================== */}
    <footer className="relative bg-[#171615] text-gray-200">
      {/* angled top cap */}
      <div
        aria-hidden
        className="absolute -top-8 left-0 right-0 h-16 bg-[#171615] [clip-path:polygon(0_26%,96%_0,100%_100%,0_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        {/* row: logo + headline (LEFT-ALIGNED) */}
        <div className="flex items-start gap-4">
          <img src={ampowerLogo} alt="AmPower" className="h-7 w-auto md:h-8 shrink-0" />
          <h3 className="font-serif font-extrabold text-white leading-tight text-[22px] md:text-[30px]">
            <span className="whitespace-nowrap">Building stronger Churches</span>
            <br />
            <span className="whitespace-nowrap">for the next Generation.</span>
          </h3>
        </div>

        {/* row: 2 content cols + follow col, with precise dividers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* col 1 */}
          <div className="md:col-span-4">
            <p className="text-sm text-gray-300 max-w-prose">
              We believe in the power of connection and shared faith. Come and be a part of our growing church family.
            </p>
            <div className="mt-5">
              <p className="text-sm text-white font-semibold">Features:</p>
              <p className="mt-1 text-sm text-gray-300 max-w-prose">
                We believe in the power of connection and shared faith. Come and be a part of our growing church family.
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="h-full border-l border-white/15" />
          </div>

          {/* col 2 */}
          <div className="md:col-span-4">
            <p className="text-sm text-gray-300 max-w-prose">
              We believe in the power of connection and shared faith. Come and be a part of our growing church family.
            </p>
            <div className="mt-5">
              <p className="text-sm text-white font-semibold">Support:</p>
              <p className="mt-1 text-sm text-gray-300 max-w-prose">
                We believe in the power of connection and shared faith. Come and be a part of our growing church family.
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="h-full border-l border-white/15" />
          </div>

          {/* col 3: follow */}
          <div className="md:col-span-2">
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
          </div>
        </div>

        {/* bottom rule */}
        <div className="mt-8 border-t border-white/10" />

        {/* copyright row (centered) */}
        <div className="py-6">
          <p className="text-center text-[13px] text-gray-300">
            © 2025 <span className="text-white">AmPower</span> •{" "}
            <a href="#" className="hover:text-white">Home</a> •{" "}
            <a href="#" className="hover:text-white">About</a> •{" "}
            <a href="#" className="hover:text-white">Events</a> •{" "}
            <a href="#" className="hover:text-white">Contact</a>
          </p>
        </div>
      </div>
    </footer>
      <BackgroundMusic />          
      </GlobalLayout>
      
    </>
  );
}

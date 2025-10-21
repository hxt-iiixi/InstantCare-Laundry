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
import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
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
       <LeadershipTeam />
      </section>

     {/* ===================== FOOTER ===================== */}
    <footer className="relative  text-gray-200">
       <ChurchInfoFooter />
    </footer>
         
  
      
    </>
  );
}

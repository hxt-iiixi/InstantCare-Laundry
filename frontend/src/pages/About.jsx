import Navbar from "../components/Navbar";


import heroGlass from "../assets/images/aboutBG.jpg";      
import churchFaded from "../assets/images/about2.jpg";            
import circleA from "../assets/icons/circle1.svg";
import circleB from "../assets/icons/circle2.svg";
import circleC from "../assets/icons/circle3.svg";
import circleD from "../assets/icons/circle1.svg";

import ArcWheelV5 from "../components/ArcWheelV5";

export default function About() {
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

     {/* ============ SECTION 2: Story + exact wheel layout ============ */}
        <section className="relative overflow-hidden">
        {/* Faded background */}
        <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${churchFaded})` }}
        />
        {/* A touch more wash to match your mock */}
        <div className="absolute inset-0 " />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left copy */}
            <div className="order-2 lg:order-1">
                <h2 className="font-serif italic text-[34px] md:text-[38px] lg:text-[40px] text-gray-800 mb-5">
                Rooted in Faith, Growing in Love
                </h2>
                <div className="space-y-5 text-gray-700 leading-relaxed max-w-[560px]">
                <p>
                    Our church is built on a strong foundation of faith, grounded in God’s Word and
                    guided by His Spirit. For generations, we have been a place where hearts are
                    renewed, families are strengthened, and lives are transformed through the love
                    of Christ.
                </p>
                <p>
                    We honor the heritage of our faith, cherishing the traditions that remind us of
                    God’s goodness through the years. At the same time, we embrace the modern call of
                    the church—to reach out, serve our community, and share God’s light in fresh and
                    meaningful ways.
                </p>
                </div>
            </div>
             {/* Right column: hard-align to the container’s right edge */}
            <div className="order-2 lg:order-2 lg:col-start-2 relative">
            <div className="ml-auto">
                 <div style={{ marginRight: "min(-26vw, -180px)" }}>
                <ArcWheelV5
                    images={[circleA, circleB, circleC, circleD]}  
                    arcCenterX={600}    
                    arcCenterY={260}
                    arcRadius={200}
                    bigSize={360}
                    sizeTop={120}
                    sizeRight={140}
                    sizeBottom={130}
                    durationMs={550}
                />
                </div>
            </div>
            </div>
        </div>
        </div>
        </section>

      {/* SECTION 3: three columns */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
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
    </>
  );
}

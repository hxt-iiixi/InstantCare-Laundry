import bg from "../assets/images/chruchBG.jpg"; 

export default function Hero() {
  return (
    <section className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }} 
        aria-hidden="true"
      />
      <div className="absolute inset-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-10 md:pt-12" />
        <div className="flex min-h-[56vh] md:min-h-[64vh] lg:min-h-[72vh] items-center justify-center">
          <div className="text-center max-w-5xl">
            <h1 className="font-serif font-extrabold leading-tight text-gray-900 text-4xl sm:text-5xl lg:text-[72px]">
              Welcome to AmPower!
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto">
              A place where faith grows, community flourishes, and lives are touched by God’s love.
              Join us in worship, service, and fellowship as we walk together and shine His light.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a href="#join" className="inline-flex items-center justify-center rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 shadow transition-colors">
                Join Us
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 py-3 shadow transition-colors">
                Explore Features
              </a>
            </div>
          </div>
        </div>
        <div className="pb-10 md:pb-12" />
      </div>
    </section>
  );
}

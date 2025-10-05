import ampowerLogo from "/src/assets/icons/ampower-ehite.png";
import fbIcon from "/src/assets/icons/facebook-white.svg";
import twIcon from "/src/assets/icons/twitter-white.svg";
import igIcon from "/src/assets/icons/instagram-white.svg";

export default function ChurchInfoFooter() {
  return (
    <>
      <footer className="relative bg-[#171615] text-gray-200">
        {/* angled top cap */}
        <div
          aria-hidden
          className="absolute -top-8 left-0 right-0 h-16 bg-[#171615] [clip-path:polygon(0_26%,96%_0,100%_100%,0_100%)]"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
          {/* row: logo + headline (LEFT-ALIGNED) */}
          <div className="flex items-start gap-4">
            <img
              src={ampowerLogo}
              alt="AmPower"
              className="h-7 w-auto md:h-8 shrink-0"
            />
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
    </>
  );
}

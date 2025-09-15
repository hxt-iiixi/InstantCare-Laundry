import React from "react";

import { motion, useAnimation, useInView } from "framer-motion";
import heroImg from "../assets/images/hero-towels.jpg";
import washingMachine from "../assets/icons/washing-machine.svg";
import shirt from "../assets/icons/shirt.svg";
import handCoins from "../assets/icons/hand-coins.svg";
import truck from "../assets/icons/truck.svg";
import droplet from "../assets/icons/droplet.svg";
import clock from "../assets/icons/clock.svg";
import man from "../assets/images/man.jpg";
import bottle from "../assets/images/bottle.jpg";
import instagram from "../assets/icons/instagram.svg";
import facebook from "../assets/icons/facebook.svg";
import twitter from "../assets/icons/twitter.svg";

const fadeDown = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeRight = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fadeLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

function ServicesSection({ washingMachine, shirt, handCoins, truck, droplet, clock }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.25 });
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [inView, controls]);

  return (
    <section id="services" className="w-full bg-white">
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={containerVariants}
        className="mx-auto max-w-[1200px] px-8 py-20"
      >
        <motion.div className="text-center" variants={cardFadeUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Premium Services</h2>
          <p className="mt-3 text-[15px] leading-7 text-gray-500">
            Discover a full range of professional laundry services tailored to your needs.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={washingMachine} alt="Wash & Fold" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Wash & Fold</h3>
            <p className="mt-2 text-sm text-gray-600">Expert washing, drying, and precise folding for your everyday clothes.</p>
          </motion.div>

          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={shirt} alt="Dry Cleaning" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Dry Cleaning</h3>
            <p className="mt-2 text-sm text-gray-600">Specialized care for delicate garments, ensuring perfect results without water.</p>
          </motion.div>

          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={handCoins} alt="Ironing Service" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Ironing Service</h3>
            <p className="mt-2 text-sm text-gray-600">Crisp, wrinkle-free clothes with our professional hand-ironing expertise.</p>
          </motion.div>

          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={truck} alt="Pickup & Delivery" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Pickup & Delivery</h3>
            <p className="mt-2 text-sm text-gray-600">Convenient door-to-door service, saving you precious time and effort.</p>
          </motion.div>

          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={droplet} alt="Eco-Friendly Cleaning" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Eco-Friendly Cleaning</h3>
            <p className="mt-2 text-sm text-gray-600">Gentle yet effective cleaning solutions that are kind to both your clothes and the planet.</p>
          </motion.div>

          <motion.div variants={cardFadeUp} className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <img src={clock} alt="Express Service" className="mx-auto mb-5 h-10 w-10" />
            <h3 className="text-lg font-semibold">Express Service</h3>
            <p className="mt-2 text-sm text-gray-600">Need it fast? Our express service ensures your laundry is ready in record time.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.25 });
  const controls = useAnimation();
  React.useEffect(() => { controls.start(inView ? "visible" : "hidden"); }, [inView, controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  return (
    <section id="testimonials" className="w-full bg-white">
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={container}
        className="mx-auto max-w-[1200px] px-8 py-20"
      >
        <motion.div className="text-center mb-12" variants={fadeUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold">What Our Customers Say</h2>
          <p className="mt-3 text-[15px] leading-7 text-gray-500 max-w-2xl mx-auto">
            Hear from our happy customers who trust SparkleWash with their laundry needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeUp} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              "SparkleWash has completely revolutionized my laundry routine. The convenience and quality are unbeatable!"
            </p>
            <span className="text-sm font-medium text-pink-600">Sarah L.</span>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              "My clothes have never looked and felt so clean. The dry cleaning service is exceptional for my delicate items."
            </p>
            <span className="text-sm font-medium text-pink-600">Michael R.</span>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              "The pickup and delivery service is a lifesaver for my busy schedule. Always on time and incredibly efficient!"
            </p>
            <span className="text-sm font-medium text-pink-600">Emily C.</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
function AnimatedFooter() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const controls = useAnimation();
  React.useEffect(() => { controls.start(inView ? "visible" : "hidden"); }, [inView, controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={container}
        className="mx-auto max-w-[1200px] px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2">
              <span className="text-[20px]" style={{ color: "#f296e9" }}>✺</span>
              <span className="sr-only">SparkleWash</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 max-w-xs">
              Your one-stop solution for pristine laundry services.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a href="#" className="hover:opacity-80">
                <img src={facebook} alt="Facebook" className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={twitter} alt="Twitter" className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src={instagram} alt="Instagram" className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-gray-900">Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Home</a></li>
              <li><a href="#services" className="hover:text-gray-900">Services</a></li>
              <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
              <li><a href="#contact" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-gray-900">Contact Us</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>123 Fresh Scent Ave</li>
              <li>Cleanworth City, CA 90210</li>
              <li>support@sparklewash.com</li>
              <li>(123) 456-7890</li>
            </ul>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="mt-10 border-t border-gray-200 pt-6 text-xs text-gray-500">
          © 2024 SparkleWash WashingMachine. All rights reserved.
        </motion.div>
      </motion.div>
    </footer>
  );
}
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
       <motion.header
        className="w-full sticky top-0 z-40 border-b border-gray-100 bg-white"
        variants={fadeDown}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <motion.a href="#" className="flex items-center gap-2" variants={fadeLeft}>
            <span className="text-pink-500 text-xl">✺</span>
            <span className="font-semibold text-pink-600 italic">InstantCare Laundry Home</span>
          </motion.a>
          <motion.nav className="hidden md:flex items-center gap-10 text-sm" variants={fadeUp}>
            <a href="#" className="text-pink-500">Home</a>
            <a href="#services" className="text-gray-700 hover:text-gray-900">Services</a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
          </motion.nav>
          <motion.a
            href="#book"
            className="rounded-md bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-600 transition"
            variants={fadeRight}
          >
            Book Now
          </motion.a>
        </div>
      </motion.header>

      <section className="w-full" style={{ backgroundColor: "#FFF0FF" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-20 md:grid-cols-2 md:items-center">
          <motion.div
            className="max-w-2xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5, once: false }}
          >
            <h1 className="text-[56px] md:text-[64px] font-extrabold leading-[1.08] tracking-tight">
              Freshness Delivered, Right to Your Door.
            </h1>
            <p className="mt-8 max-w-xl text-[15px] leading-7 text-gray-600">
              Experience hassle-free laundry with SparkleWash. We pick up, clean, and deliver your clothes, saving you time and effort.
            </p>
            <motion.div className="mt-10" variants={fadeUp}>
              <a
                href="#book"
                className="rounded-md px-6 py-3 text-sm font-medium text-white transition"
                style={{ backgroundColor: "#f59fe9" }}
              >
                Book Your WashingMachine Now
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.4, once: false }}
          >
            <motion.img
              src={heroImg}
              alt="Folded Towels"
              className="rounded-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ amount: 0.4, once: false }}
            />
          </motion.div>
        </div>
      </section>


      <ServicesSection
        washingMachine={washingMachine}
        shirt={shirt}
        handCoins={handCoins}
        truck={truck}
        droplet={droplet}
        clock={clock}
        />

      <section className="w-full" style={{ backgroundColor: "#FAFAFB" }}>
        <div className="mx-auto max-w-[1200px] px-8 py-20">
            <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.4, once: false }}
            >
            <h2 className="text-3xl md:text-4xl font-extrabold">Why Choose SparkleWash?</h2>
            <p className="mt-3 text-[15px] leading-7 text-gray-500 max-w-2xl mx-auto">
                We’re dedicated to providing exceptional laundry care with unmatched convenience and quality.
            </p>
            </motion.div>

            {/* Row 1: Text Left, Image Right */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.4, once: false }}
            >
                <h3 className="text-xl font-semibold mb-3">Unmatched Quality & Care</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                Our experienced team uses only premium, eco-friendly detergents and advanced cleaning
                techniques to ensure your garments receive the best possible treatment. We handle every
                item with the utmost care, from delicate silks to everyday cottons.
                </p>
            </motion.div>

            <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.4, once: false }}
            >
                <img src={bottle} alt="bottle" className="rounded-lg" />
            </motion.div>
            </div>

            {/* Row 2: Image Left, Text Right */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.4, once: false }}
            >
                <img src={man} alt="man" className="rounded-lg" />
            </motion.div>

            <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.4, once: false }}
            >
                <h3 className="text-xl font-semibold mb-3">Convenient Pickup & Delivery</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                Say goodbye to laundry day chores. With our seamless online booking, we pick up your laundry
                at your doorstep and deliver it back fresh, clean, and perfectly folded. It’s laundry made
                easy, on your schedule.
                </p>
            </motion.div>
            </div>
        </div>
        </section>

      <TestimonialsSection />
      <AnimatedFooter />
    </div>
  );
}

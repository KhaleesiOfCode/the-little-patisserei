"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";
import NewLaunchesSection from "../components/NewLaunchesSection";

const galleryItems = [
  { img: "/gallery/cake-1.jpg", name: "Chocolate Truffle Cake" },
  { img: "/gallery/cake-2.jpg", name: "Mango Cream Cake" },
  { img: "/gallery/cake-3.jpg", name: "Red Velvet Delight" },
  { img: "/gallery/cake-4.jpg", name: "Birthday Special Cake" },
  { img: "/gallery/cake-5.jpg", name: "Cupcake Box" },
  { img: "/gallery/cake-6.jpg", name: "Anniversary Cake" },
];

export default function HomePage() {

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="relative overflow-hidden bg-[#FFF8E4] pt-4 sm:pt-6 md:pt-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute left-[3%] top-[5%] h-48 w-48 text-[#D4AF37]/15 md:h-56 md:w-56" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20 180 C40 130, 30 80, 70 60 C100 45, 120 70, 110 100 C100 130, 70 140, 50 120 C30 100, 40 60, 80 40 C110 25, 150 35, 170 70" strokeLinecap="round" />
            <circle cx="173" cy="75" r="3" fill="currentColor" stroke="none" />
          </svg>

          <svg className="absolute left-[12%] top-[50%] h-24 w-24 text-[#D4AF37]/12 md:h-28 md:w-28" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M15 85 C30 65, 25 40, 50 30 C70 22, 80 40, 70 60 C60 75, 40 70, 35 55 C30 40, 45 25, 65 28" strokeLinecap="round" />
          </svg>

          <svg className="absolute left-[2%] top-[38%] h-20 w-16 text-[#1D3C42]/10 md:h-24 md:w-20" viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M30 75 C15 60, 5 40, 15 20 C22 8, 40 5, 48 15 C55 25, 45 45, 30 55" strokeLinecap="round" />
            <path d="M30 75 L30 45" strokeLinecap="round" />
            <path d="M30 55 L22 48" strokeLinecap="round" />
            <path d="M30 55 L38 48" strokeLinecap="round" />
          </svg>

          <svg className="absolute right-[5%] bottom-[8%] h-40 w-40 text-[#1D3C42]/8 md:h-48 md:w-48" viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M80 140 C40 120, 20 80, 45 40 C60 15, 95 10, 115 30 C135 50, 125 85, 100 100 C75 115, 50 100, 45 80 C40 60, 60 40, 85 45" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <svg className="absolute right-[2%] top-[8%] h-24 w-24 text-[#1D3C42]/8 md:h-32 md:w-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M50 85 C30 70, 15 45, 30 20 C40 5, 65 8, 75 25 C85 42, 70 65, 50 75 C40 80, 30 72, 35 60 C40 48, 55 42, 65 50" strokeLinecap="round" />
          </svg>

          <svg className="absolute right-[15%] top-[20%] h-28 w-28 text-[#F4CFC8]/50" viewBox="0 0 120 100" fill="currentColor">
            <circle cx="15" cy="12" r="3" />
            <circle cx="45" cy="30" r="2" />
            <circle cx="85" cy="10" r="4" />
            <circle cx="108" cy="35" r="2.5" />
            <circle cx="60" cy="22" r="1.5" />
            <circle cx="30" cy="50" r="2" />
            <circle cx="95" cy="50" r="2" />
            <circle cx="70" cy="70" r="1.5" />
          </svg>

          <svg className="absolute left-[35%] bottom-[3%] h-20 w-28 text-[#F4CFC8]/30" viewBox="0 0 80 60" fill="currentColor">
            <circle cx="12" cy="8" r="2.5" />
            <circle cx="35" cy="4" r="2" />
            <circle cx="60" cy="10" r="3" />
            <circle cx="25" cy="25" r="2" />
            <circle cx="55" cy="28" r="1.5" />
            <circle cx="10" cy="40" r="2" />
            <circle cx="42" cy="48" r="2" />
            <circle cx="70" cy="42" r="1.5" />
          </svg>

          <svg className="absolute left-[28%] top-[12%] h-20 w-20 text-[#D4AF37]/12" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M40 10 C45 20, 55 25, 65 30 C55 35, 45 40, 40 50 C35 40, 25 35, 15 30 C25 25, 35 20, 40 10Z" strokeLinecap="round" />
            <path d="M40 25 C43 30, 48 33, 55 35 C48 37, 43 40, 40 45 C37 40, 32 37, 25 35 C32 33, 37 30, 40 25Z" strokeLinecap="round" />
          </svg>

          <svg className="absolute left-[55%] top-[3%] h-16 w-16 text-[#D4AF37]/10 md:h-20 md:w-20" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M10 50 C15 35, 5 20, 20 10 C30 5, 45 10, 45 25 C45 40, 30 50, 15 45" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-0 sm:px-6">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_1.2fr] md:gap-6 lg:gap-8">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-1"
            >
              <div className="relative mx-auto max-w-[300px] md:mx-0 md:max-w-md lg:max-w-lg">
                <div
                  className="absolute -left-5 -top-5 h-full w-full bg-[#D4AF37]/10 -rotate-3"
                  style={{ borderRadius: "45% 55% 35% 65% / 55% 40% 60% 45%" }}
                />
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="overflow-hidden shadow-2xl ring-1 ring-[#D4AF37]/10"
                    style={{ borderRadius: "40% 60% 35% 65% / 50% 40% 60% 50%" }}
                  >
                    <img
                      src="/images/hero-cupcake.jpg"
                      alt="Artisan cupcake"
                      className="aspect-square w-full object-cover"
                    />
                  </motion.div>
                </div>
                <div
                  className="absolute -bottom-5 -right-5 h-20 w-20 border-2 border-[#D4AF37]/30 md:h-24 md:w-24"
                  style={{ borderRadius: "50% 40% 60% 40% / 40% 50% 50% 60%" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-6 flex flex-col items-center gap-3 md:flex-row md:items-center"
              >
                <img
                  src="/logo.png"
                  alt="The Little Patisserie"
                  className="h-16 w-16 rounded-full object-contain ring-2 ring-[#D4AF37]/20 sm:h-20 sm:w-20"
                />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                  The Little Patisserie
                </span>
              </motion.div>

              <h1 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-[#1D3C42] sm:text-5xl lg:text-6xl">
                Handcrafted Cakes &amp; Sweet Moments
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-4 h-0.5 w-20 origin-left bg-[#D4AF37] md:mx-0"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#7A6262] sm:text-base sm:leading-7 md:mx-0"
              >
                Freshly baked treats, custom cakes, brownies and cupcakes made with care for every celebration.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start"
              >
                <Link
                  href="/menu"
                  className="rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#163136] hover:shadow-xl"
                >
                  Explore Menu
                </Link>
                <a
                  href={`https://wa.me/919488407130?text=${encodeURIComponent("Hi, I'd like to enquire about a custom cake order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#D4AF37] bg-white px-8 py-3.5 text-sm font-bold text-[#1D3C42] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8E4] hover:shadow-lg"
                >
                  Custom Cake Enquiry
                </a>
              </motion.div>
            </motion.div>

          </div>
        </div>

        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative mt-6 w-full md:mt-8"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 120 480 120 720 60C960 0 1200 0 1440 40V120H0V40Z"
            fill="white"
          />
        </svg>
      </section>

      <NewLaunchesSection />

      <ScrollReveal>
        <section className="bg-[#FFF8E4] px-5 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl overflow-hidden">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Our Creations</span>
              <h2 className="text-3xl font-extrabold text-[#1D3C42] sm:text-4xl">
                Cakes crafted for our customers
              </h2>
              <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#D4AF37]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span className="h-px w-8 bg-[#D4AF37]/40" />
              </div>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {galleryItems.slice(0, 3).map((item) => (
                  <div key={item.name} className="group w-48 sm:w-56">
                    <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-md ring-1 ring-[#F4CFC8] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:ring-[#D4AF37]/50">
                      <div className="aspect-square overflow-hidden rounded-xl">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-center text-sm font-bold text-[#1D3C42] transition-colors group-hover:text-[#D4AF37] sm:text-base">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-6 sm:mt-8 sm:gap-8 sm:translate-x-[7rem]">
                {galleryItems.slice(3, 6).map((item) => (
                  <div key={item.name} className="group w-48 sm:w-56">
                    <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-md ring-1 ring-[#F4CFC8] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:ring-[#D4AF37]/50">
                      <div className="aspect-square overflow-hidden rounded-xl">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-center text-sm font-bold text-[#1D3C42] transition-colors group-hover:text-[#D4AF37] sm:text-base">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-[#1D3C42] px-5 py-12 text-center text-white sm:px-6 sm:py-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to order something sweet?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Explore the menu, add your favourites, and checkout with secure
            payment.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-block rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#1D3C42] sm:mt-8 sm:px-8 sm:py-3"
          >
            Explore Menu
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}

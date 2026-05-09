"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
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

const GALLERY_DUPLICATE_COUNT = 3;

const duplicatedGallery = Array.from({ length: GALLERY_DUPLICATE_COUNT })
  .flatMap(() => galleryItems);

const scrollPercent = -(100 / GALLERY_DUPLICATE_COUNT);

export default function HomePage() {
  const [paused, setPaused] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#FFF8E4]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-0 md:pt-16">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]"
              >
                Artisan Bakery &amp; Patisserie
              </motion.p>

              <h1 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-[#1D3C42] sm:text-5xl lg:text-6xl">
                {"Artisan Cakes, Crafted for Beautiful Celebrations"
                  .split(" ")
                  .map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2 + i * 0.08,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mr-3 inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 h-0.5 w-20 origin-left bg-[#D4AF37]"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-6 max-w-md text-base leading-8 text-[#7A6262]"
              >
                Freshly baked with premium ingredients, elegant flavours, and thoughtful details — made to turn every occasion into a sweet memory.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
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
                  Order Custom Cake
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center pb-4 md:pb-0"
            >
              <motion.div
                animate={{ rotate: [0, 3, 0, -3, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 -top-4 h-[260px] w-[260px] rounded-[3rem] bg-[#1D3C42] md:-left-6 md:-top-6 md:h-[340px] md:w-[340px]"
              />
              <div className="absolute -bottom-3 -right-3 h-[200px] w-[200px] rounded-[2rem] border-2 border-[#D4AF37]/30 md:h-[260px] md:w-[260px]" />
              <motion.img
                src="/cakes/chocolate-cake-1.jpg"
                alt="Artisan chocolate cake"
                className="relative z-10 h-[240px] w-[240px] rounded-full object-cover shadow-2xl ring-2 ring-[#D4AF37]/20 md:h-[320px] md:w-[320px]"
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: [0, -10, 0], rotate: 0 }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 0.8 },
                }}
              />
            </motion.div>
          </div>
        </div>

        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative mt-8 w-full md:mt-12"
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
        <section className="bg-[#FFF8E4] px-6 py-20">
          <div className="mx-auto max-w-7xl overflow-hidden">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-[#1D3C42]">
                Cakes crafted for our customers
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#D4AF37]" />
            </div>

            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <motion.div
                className="flex gap-4 sm:gap-10"
                animate={paused ? { x: `0%` } : { x: ["0%", `${scrollPercent}%`] }}
                transition={{
                  duration: paused ? 0.3 : 25,
                  repeat: paused ? 0 : Infinity,
                  ease: "linear",
                }}
              >
                {duplicatedGallery.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="group relative h-36 w-48 shrink-0 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#F4CFC8] sm:h-44 sm:w-64"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <h3 className="absolute bottom-4 left-4 right-4 text-lg font-extrabold text-white drop-shadow">
                      {item.name}
                    </h3>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-[#1D3C42] px-6 py-16 text-center text-white">
          <h2 className="text-4xl font-extrabold">
            Ready to order something sweet?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Explore the menu, add your favourites, and checkout with secure
            payment.
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-block rounded-full bg-[#D4AF37] px-8 py-3 font-bold text-[#1D3C42]"
          >
            Explore Menu
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#FFF8E4]">
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 max-w-xl"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#F08C9B]">
              Freshly baked in Tamil Nadu
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Cupcakes, cakes & sweet little moments
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-[#7A6262]">
              A pastel bakery experience for handcrafted cakes, pastries,
              cupcakes and celebration desserts made with love.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-[#F08C9B] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-[#E77E8D]"
              >
                View Menu
              </Link>

              <Link
                href="/cart"
                className="rounded-full border border-[#F08C9B] bg-white px-7 py-3 text-sm font-bold text-[#3A2A2A] transition hover:-translate-y-1 hover:bg-[#FADCD4]"
              >
                Go to Cart
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE AREA */}
          <div className="relative z-10 h-[460px] md:h-[560px]">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#FADCD4]/70 blur-3xl"
            />

            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-16 h-56 w-56 rounded-full bg-[#FDB978]/35 blur-3xl"
            />

            <motion.img
              src="/home/cupcake-hero.png"
              alt="Pastel cupcake"
              className="absolute bottom-0 left-1/2 z-20 w-[320px] -translate-x-1/2 object-contain drop-shadow-2xl sm:w-[380px] md:w-[460px] lg:w-[520px]"
              initial={{ opacity: 0, scale: 0.86, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -16, 0] }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
              }}
            />

            <motion.img
              src="/home/macaron-small.png"
              alt="Macaron"
              className="absolute left-[8%] top-[18%] z-30 w-16 object-contain drop-shadow-xl sm:w-20 md:w-24"
              animate={{ y: [0, 14, 0], rotate: [0, 7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.img
              src="/home/cookie-small.png"
              alt="Cookie"
              className="absolute bottom-[28%] left-[16%] z-30 w-16 object-contain drop-shadow-xl sm:w-20 md:w-24"
              animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.img
              src="/home/strawberry-small.png"
              alt="Strawberry"
              className="absolute right-[12%] top-[15%] z-30 w-14 object-contain drop-shadow-lg sm:w-16 md:w-20"
              animate={{ y: [0, 12, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* WAVE */}
        <svg
          viewBox="0 0 1440 150"
          className="absolute bottom-0 left-0 z-0 h-24 w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#FFFFFF"
            d="M0,90 C180,145 320,40 500,92 C690,148 820,135 1000,88 C1180,42 1300,135 1440,92 L1440,150 L0,150 Z"
          />
        </svg>
      </section>

      {/* BRAND MOOD */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#FADCD4] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F08C9B]">
              Soft
            </p>
            <h2 className="mt-8 text-3xl font-extrabold text-[#3A2A2A]">
              Pastel bakery mood
            </h2>
          </div>

          <div className="rounded-[2rem] bg-[#FDB978] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white">
              Sweet
            </p>
            <h2 className="mt-8 text-3xl font-extrabold text-[#3A2A2A]">
              Playful dessert colours
            </h2>
          </div>

          <div className="rounded-[2rem] bg-[#B9DDBF] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#3A2A2A]">
              Premium
            </p>
            <h2 className="mt-8 text-3xl font-extrabold text-[#3A2A2A]">
              Cute but polished
            </h2>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#FFF8E4] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F08C9B]">
              Gallery
            </p>
            <h2 className="mt-3 text-4xl font-extrabold">
              Cakes crafted for our customers
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              "/gallery/cake-1.jpg",
              "/gallery/cake-2.jpg",
              "/gallery/cake-3.jpg",
              "/gallery/cake-4.jpg",
              "/gallery/cake-5.jpg",
              "/gallery/cake-6.jpg",
            ].map((img) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="aspect-square overflow-hidden rounded-[2rem] bg-[#FDB978]"
              >
                <img
                  src={img}
                  alt="Customer cake design"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F08C9B] px-6 py-16 text-center text-white">
        <h2 className="text-4xl font-extrabold">
          Ready to order something sweet?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/85">
          Explore the menu, add your favourites, and checkout through WhatsApp
          or payment.
        </p>

        <Link
          href="/menu"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-[#F08C9B]"
        >
          Explore Menu
        </Link>
      </section>
    </main>
  );
}
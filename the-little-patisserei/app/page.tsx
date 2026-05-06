"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ScrollReveal from "../components/ScrollReveal";
import { getNewLaunches } from "../lib/supabase/menu";
import { newLaunches as staticNewLaunches } from "../data/products";
import type { MenuItem } from "../types/menu";

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
  const [launches, setLaunches] = useState<MenuItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getNewLaunches();
      if (cancelled) return;
      setLaunches(data.length > 0 ? data : staticNewLaunches);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#FFF8E4]">
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 max-w-xl"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              Freshly baked in Tamil Nadu
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.08] text-[#1D3C42] sm:text-5xl lg:text-6xl">
              Cupcakes, cakes & sweet little moments
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-[#7A6262]">
              A premium bakery experience for handcrafted cakes, pastries,
              cupcakes and celebration desserts made with love.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-[#1D3C42] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#163136]"
              >
                View Menu
              </Link>

              <Link
                href="/menu?category=New%20Launches"
                className="rounded-full border border-[#D4AF37] bg-white px-7 py-3 text-sm font-bold text-[#1D3C42] transition hover:-translate-y-1 hover:bg-[#FFF8E4]"
              >
                New Launches
              </Link>
            </div>
          </motion.div>

          <div className="relative z-10 h-[460px] md:h-[560px]">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl"
            />

            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-16 h-56 w-56 rounded-full bg-[#1D3C42]/10 blur-3xl"
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
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                Fresh Drops
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-[#1D3C42]">
                New product launches
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[#7A6262]">
                Latest cakes, cupcakes and dessert boxes introduced this week.
              </p>
            </div>

            {launches.length > 0 && (
              <>
                <Link
                  href="/menu?category=New%20Launches"
                  className="group relative mb-8 block overflow-hidden rounded-[2.5rem] bg-[#1D3C42] md:mb-10"
                >
                  <div className="aspect-[2/1] md:aspect-[3/1]">
                    <img
                      src={launches[0].image}
                      alt={launches[0].name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1D3C42]/80 via-[#1D3C42]/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <span className="mb-3 inline-block rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">
                      Featured Launch
                    </span>
                    <h3 className="text-2xl font-extrabold text-white md:text-4xl">
                      {launches[0].name}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 md:text-base">
                      {launches[0].description}
                    </p>
                    <p className="mt-4 text-2xl font-extrabold text-[#D4AF37]">
                      ₹{launches[0].price}
                    </p>
                  </div>
                </Link>

                <div className="columns-1 gap-6 md:columns-2">
                  {launches.slice(1).map((item, index) => (
                    <Link
                      href="/menu?category=New%20Launches"
                      key={item.id}
                      className={`group mb-6 block break-inside-avoid overflow-hidden rounded-[2rem] ring-1 ring-[#F4CFC8] transition hover:-translate-y-1 hover:shadow-xl ${
                        index % 3 === 0
                          ? "bg-[#1D3C42]"
                          : index % 3 === 1
                          ? "bg-white"
                          : "bg-[#FFF8E4]"
                      }`}
                    >
                      {index % 3 === 0 ? (
                        <div className="p-6 text-white">
                          <span className="mb-3 inline-block rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                            New Launch
                          </span>
                          <h3 className="text-xl font-extrabold leading-tight">
                            {item.name}
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/75">
                            {item.description}
                          </p>
                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-2xl font-extrabold text-[#D4AF37]">
                              ₹{item.price}
                            </span>
                            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80">
                              Explore
                            </span>
                          </div>
                        </div>
                      ) : index % 3 === 1 ? (
                        <>
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-5">
                            <span className="mb-2 inline-block rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]">
                              New Launch
                            </span>
                            <h3 className="text-xl font-extrabold text-[#3A2A2A]">
                              {item.name}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7A6262]">
                              {item.description}
                            </p>
                            <p className="mt-4 text-lg font-extrabold text-[#1D3C42]">
                              ₹{item.price}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="grid gap-0 md:grid-cols-[1fr_auto]">
                          <div className="p-5">
                            <span className="mb-2 inline-block rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]">
                              New Launch
                            </span>
                            <h3 className="mt-1 text-xl font-extrabold text-[#3A2A2A]">
                              {item.name}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7A6262]">
                              {item.description}
                            </p>
                            <p className="mt-3 text-lg font-extrabold text-[#1D3C42]">
                              ₹{item.price}
                            </p>
                          </div>
                          <div className="h-32 w-full md:h-auto md:w-36">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </ScrollReveal>

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
                className="flex gap-10"
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
                    className="group relative h-44 w-64 shrink-0 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#F4CFC8]"
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

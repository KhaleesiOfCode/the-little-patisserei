"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { getNewLaunches } from "../lib/supabase/menu";
import { newLaunches as staticNewLaunches } from "../data/products";
import type { MenuItem } from "../types/menu";

function TiltCard({ item }: { item: MenuItem }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, []);

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, []);

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, zIndex: 20 }}
      className="group relative w-72 shrink-0 cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-[#F4CFC8] transition-shadow hover:shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="mb-2 inline-block rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">
          New Launch
        </span>
        <h3 className="mt-1 text-lg font-extrabold text-white drop-shadow-sm">
          {item.name}
        </h3>
        <p className="mt-1 text-xl font-extrabold text-[#D4AF37]">
          ₹{item.price}
        </p>
      </div>
    </motion.div>
  );
}

export default function NewLaunchesSection() {
  const [launches, setLaunches] = useState<MenuItem[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [centerIdx, setCenterIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getNewLaunches();
      if (cancelled) return;
      setLaunches(data.length > 0 ? data : staticNewLaunches);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const carouselItems = launches.slice(1);

  useEffect(() => {
    if (carouselItems.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setCenterIdx((prev) => (prev + 1) % carouselItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselItems.length, isPaused]);

  if (launches.length === 0) return null;

  const featured = launches[0];

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20">
      {/* Ambient background animations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: ["-10%", "12%", "-10%"],
            y: ["0%", "-12%", "0%"],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#D4AF37]/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: ["10%", "-15%", "10%"],
            y: ["15%", "-10%", "15%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#F4CFC8]/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4AF37]"
          >
            Fresh Drops
          </motion.p>
          <h2 className="mt-3 text-4xl font-extrabold text-[#1D3C42]">
            New product launches
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#7A6262]">
            Latest cakes, cupcakes and dessert boxes introduced this week.
          </p>
        </motion.div>

        {/* ---- Featured Launch: Cinematic Hero ---- */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mb-10 overflow-hidden rounded-[2.5rem] bg-[#1D3C42] md:mb-12"
        >
          <Link href="/menu?category=New%20Launches">
            {/* Ken Burns zoom */}
            <motion.div
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 8, ease: "easeOut" }}
              className="aspect-[2/1] md:aspect-[3/1]"
            >
              <img
                src={featured.image}
                alt={featured.name}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Orbiting gold spotlight */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  x: ["0%", "30%", "0%", "-30%", "0%"],
                  y: ["0%", "-30%", "0%", "30%", "0%"],
                }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-1/2"
              >
                <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,_#D4AF37_0%,_transparent_60%)] opacity-[0.18]" />
              </motion.div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1D3C42]/90 via-[#1D3C42]/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              {/* Badge clip-path reveal */}
              <motion.span
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-3 inline-block rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1D3C42]"
              >
                Featured Launch
              </motion.span>

              {/* Staggered word-by-word reveal */}
              <h3 className="flex flex-wrap text-2xl font-extrabold text-white md:text-4xl">
                {featured.name.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-2 max-w-xl text-sm leading-6 text-white/80 md:text-base"
              >
                {featured.description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.7,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4 text-2xl font-extrabold text-[#D4AF37]"
              >
                ₹{featured.price}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25">
                  Discover All
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </motion.div>
            </div>

            {/* On-hover shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>
          </Link>
        </motion.div>

        {/* ---- Horizontal 3D Carousel for remaining launches ---- */}
        <AnimatePresence>
          {carouselItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative" ref={carouselRef}>
                <motion.div
                  className="flex items-center justify-center gap-6 py-4"
                  drag="x"
                  dragConstraints={{
                    left: -(carouselItems.length - 1) * 160,
                    right: 0,
                  }}
                  dragElastic={0.08}
                  onDragStart={() => setIsPaused(true)}
                  onDragEnd={() => {
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                >
                  {carouselItems.map((item, i) => {
                    const offset = i - centerIdx;
                    const absOffset = Math.abs(offset);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        animate={{
                          scale: Math.max(1 - absOffset * 0.12, 0.7),
                          opacity: 1 - absOffset * 0.25,
                          filter:
                            absOffset > 1
                              ? "blur(4px)"
                              : absOffset === 1
                              ? "blur(1px)"
                              : "blur(0px)",
                        }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative"
                        style={{
                          zIndex: carouselItems.length - absOffset,
                        }}
                        onClick={() => setCenterIdx(i)}
                      >
                        <TiltCard item={item} />
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Navigation arrows */}
                {carouselItems.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCenterIdx(
                          (prev) =>
                            (prev - 1 + carouselItems.length) %
                            carouselItems.length
                        )
                      }
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl"
                    >
                      <svg
                        className="h-5 w-5 text-[#1D3C42]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCenterIdx(
                          (prev) => (prev + 1) % carouselItems.length
                        )
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl"
                    >
                      <svg
                        className="h-5 w-5 text-[#1D3C42]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Progress dots */}
              {carouselItems.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {carouselItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCenterIdx(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === centerIdx
                          ? "h-2.5 w-8 bg-[#D4AF37]"
                          : "h-2.5 w-2.5 bg-[#F4CFC8] hover:bg-[#D4AF37]/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

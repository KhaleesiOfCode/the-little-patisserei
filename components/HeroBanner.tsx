"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#1D3C42]">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-cupcake.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D3C42]/85 via-[#1D3C42]/60 to-[#1D3C42]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D3C42]/40 to-transparent" />
      </div>

      {/* Decorative paint-brush accent */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[20%] h-[80%] w-[50%] bg-[#D4AF37]/10 blur-xl"
        style={{
          borderRadius: "50% 30% 60% 40% / 40% 50% 50% 60%",
          transform: "rotate(-8deg)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-center px-5 py-16 sm:px-6 sm:py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sweet Moments
            <br />
            Start Here.
          </h1>

          <div className="mt-4 h-0.5 w-16 bg-[#D4AF37]" />

          <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            Handcrafted cakes, cupcakes, and desserts made fresh with love for
            every celebration.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/menu"
              className="rounded-full bg-[#D4AF37] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#1D3C42] shadow-lg transition hover:scale-[1.03] hover:bg-[#D4AF37]/90 hover:shadow-xl"
            >
              Explore Menu
            </Link>
            <a
              href={`https://wa.me/919488407130?text=${encodeURIComponent("Hi! I'd like to enquire about your desserts.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/50 bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm transition hover:scale-[1.03] hover:border-white hover:bg-white/20 hover:shadow-lg"
            >
              Custom Cake
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom curve divider */}
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative block w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C240 80 480 80 720 50C960 20 1200 20 1440 40V80H0V40Z"
          fill="#FFF8E4"
        />
      </svg>
    </section>
  );
}

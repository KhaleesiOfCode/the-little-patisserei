"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const trustItems = [
  "Custom Cakes",
  "Freshly Baked",
  "Made to Order",
  "Premium Ingredients",
];

export default function HeroBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#F7F2EC]">
      {/* Warm radial glow behind cake */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[90%] w-[70%]"
        style={{
          background: "radial-gradient(ellipse at 70% 40%, rgba(255,235,210,0.35) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* ===================== DESKTOP ===================== */}
      <div className="relative hidden min-h-screen md:block">
        {/* Image — dominant, bleeds right */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <img
              src="/images/hero-cake.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              style={{
                maskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 65%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 65%, transparent 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* Floating editorial cards — overlapping the image */}
        <div className="absolute bottom-44 left-[5%] z-20 w-[55%] px-8 lg:px-12">
          <div className="flex gap-5 md:max-w-[90%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              <Link
                href="/custom-cake"
                className="group flex flex-col rounded-[28px] bg-[#F7F2EC] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-[#D4AF37]/20 transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.1)] hover:ring-[#D4AF37]/35"
              >
                <span className="font-display text-lg font-bold text-[#5C3A2E]">Custom Cakes</span>
                <p className="mt-1 text-sm leading-5 text-[#5C3A2E]/50">Designed around your celebration.</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] transition group-hover:gap-2.5">
                  Design Your Cake
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4"/></svg>
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              <Link
                href="/menu"
                className="group flex flex-col rounded-[28px] bg-[#F7F2EC] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-[#D4AF37]/15 transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.1)] hover:ring-[#D4AF37]/30"
              >
                <span className="font-display text-lg font-bold text-[#5C3A2E]">Browse the Menu</span>
                <p className="mt-1 text-sm leading-5 text-[#5C3A2E]/50">Freshly baked brownies, cupcakes &amp; more.</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] transition group-hover:gap-2.5">
                  Explore Menu
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4"/></svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="flex flex-col md:hidden">
        {/* Image */}
        <div className="relative -mx-6 aspect-[4/3] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <img
              src="/images/hero-cake.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              style={{
                maskImage: "radial-gradient(ellipse 80% 90% at 50% 50%, black 60%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 50% 50%, black 60%, transparent 100%)",
              }}
            />
          </motion.div>
          {/* Trust items overlay on image */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-6">
            {trustItems.map((item) => (
              <span key={item} className="text-[9px] font-semibold tracking-[0.15em] text-white/85 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile action cards */}
        <div className="relative z-10 -mt-4 space-y-3 px-6 pt-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/custom-cake"
              className="group flex flex-col rounded-[28px] bg-[#F7F2EC] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-[#D4AF37]/20 transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)] hover:ring-[#D4AF37]/40"
            >
              <span className="font-display text-lg font-bold text-[#5C3A2E]">Custom Cakes</span>
              <p className="mt-1 text-sm leading-5 text-[#5C3A2E]/50">Designed around your celebration.</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] transition group-hover:gap-2.5">
                Design Your Cake
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4"/></svg>
              </span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/menu"
              className="group flex flex-col rounded-[28px] bg-[#F7F2EC] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-[#D4AF37]/10 transition hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:ring-[#D4AF37]/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-[#5C3A2E]">Browse the Menu</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] transition group-hover:gap-2">
                  Explore Menu
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4"/></svg>
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-[#5C3A2E]/40">Freshly baked brownies, cupcakes &amp; more.</p>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ========== TRUST STRIP ========== */}
      <div className="border-t border-[#D4AF37]/10 bg-[#EFE3D4]/25 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6">
          {trustItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.2em] text-[#5C3A2E]/40 uppercase"
            >
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/40" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

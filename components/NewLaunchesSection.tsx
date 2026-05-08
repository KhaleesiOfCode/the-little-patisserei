"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getNewLaunches } from "../lib/supabase/menu";
import { newLaunches as staticNewLaunches } from "../data/products";
import type { MenuItem } from "../types/menu";

const MAX_HOME_ITEMS = 4;

function horizontalCardAnim(index: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-30px" },
    transition: { duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function EditorialCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div {...horizontalCardAnim(index)}>
      <Link
        href={`/menu?product=${item.id}`}
        className="group flex flex-col gap-0 overflow-hidden rounded-2xl bg-white ring-1 ring-[#E8DDD0] transition-all duration-300 hover:ring-[#D4AF37]/30 sm:flex-row sm:items-stretch"
      >
        <div className="aspect-square w-full overflow-hidden bg-[#FAFAF5] sm:h-[170px] sm:w-[170px] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center px-5 py-4 sm:py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D3C42]">
            {item.badges?.find((b) => b === "New Launch") ? "New Launch" : (item.category || "New Launch")}
          </span>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-[#1D3C42] group-hover:text-[#D4AF37] transition-colors">
            {item.name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#7A6262] line-clamp-2">
            {item.description}
          </p>
          <p className="mt-2 font-serif text-base font-bold tracking-wide text-[#D4AF37]">
            ₹{item.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function NewLaunchesSection() {
  const [launches, setLaunches] = useState<MenuItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getNewLaunches();
      if (cancelled) return;
      setLaunches(data.length > 0 ? data.slice(0, MAX_HOME_ITEMS) : staticNewLaunches.slice(0, MAX_HOME_ITEMS));
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = launches.slice(0, MAX_HOME_ITEMS);

  if (displayItems.length === 0) return null;

  const leftCol = displayItems.filter((_, i) => i % 2 === 0);
  const rightCol = displayItems.filter((_, i) => i % 2 === 1);

  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Fresh from the oven
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#1D3C42] md:text-4xl">
              New Launches
            </h2>
          </div>
          <Link
            href="/menu"
            className="shrink-0 text-sm font-semibold text-[#1D3C42] transition hover:text-[#D4AF37]"
          >
            See more new launches &rarr;
          </Link>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8">
          <div className="flex flex-col gap-8">
            {leftCol.map((item, i) => (
              <EditorialCard key={item.id} item={item} index={i * 2} />
            ))}
          </div>
          <div className="flex flex-col gap-8">
            {rightCol.length > 0 ? (
              rightCol.map((item, i) => (
                <EditorialCard key={item.id} item={item} index={i * 2 + 1} />
              ))
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:hidden">
          {displayItems.map((item, i) => (
            <EditorialCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

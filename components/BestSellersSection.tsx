"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getMenuCategories } from "../lib/supabase/menu";
import type { MenuItem } from "../types/menu";

const MAX_ITEMS = 8;

export default function BestSellersSection() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getMenuCategories();
      const all = data.flatMap((c) => c.items);
      const bestSellers = all.filter((item) =>
        item.badges?.some((b) => b.toLowerCase().includes("best seller"))
      );
      const sorted = bestSellers.length > 0 ? bestSellers : all;
      setItems(sorted.slice(0, MAX_ITEMS));
    }
    load();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-[#FFF8E4] px-0 pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="font-display text-sm italic tracking-wide text-[#D4AF37]">
            best deals for you
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.08em] text-[#1D3C42] sm:text-4xl">
            Cups of Cuteness
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-sm italic leading-6 text-[#7A6262]">
            Discover our customer favorites, freshly baked with premium
            ingredients and handmade details.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const isBestSeller = item.badges?.some((b) =>
              b.toLowerCase().includes("best seller")
            );
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(item.category)}&product=${item.id}`}
                  className="group relative flex aspect-square overflow-hidden rounded-2xl ring-1 ring-[#3A2A2A]/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:ring-[#D4AF37]/20"
                >
                  <img
                    src={item.image || "/cakes/chocolate-cake-1.jpg"}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {isBestSeller && (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-sm sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
                      Best Seller
                    </span>
                  )}

                  <div className="relative mt-auto px-3 pb-3 pt-8 sm:px-4 sm:pb-4">
                    <h3 className="truncate font-display text-xs font-bold uppercase leading-tight text-white sm:text-sm">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#163136] hover:shadow-md sm:px-8 sm:py-3 sm:text-sm"
          >
            View All
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

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
    <section className="bg-[#FFF8E4] px-0 pb-10 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="font-display text-sm italic tracking-wide text-[#D4AF37]">
            Only the best for you, and yes, your diets end here!
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.08em] text-[#1D3C42] sm:text-4xl">
            The repeat-order champions!!
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-sm italic leading-6 text-[#7A6262]">
            Too good to be a one-time thing!!<br />
            Discover the crowd favourites, the ones that are too good for just one bite, one order or
            even one serving!!
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
                  className="group relative flex aspect-square overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <img
                    src={item.image || "/cakes/chocolate-cake-1.jpg"}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {isBestSeller && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-lg sm:right-4 sm:top-4 sm:px-4 sm:py-1.5 sm:text-xs">
                      Best Seller
                    </span>
                  )}

                  <div className="relative mt-auto px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
                    <h3 className="font-display text-sm font-bold uppercase leading-tight text-white drop-shadow-sm sm:text-base">
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
          className="mt-10 text-center"
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

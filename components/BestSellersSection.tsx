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
    <section className="bg-[#FFF8E4] px-5 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const basePrice = item.prices?.[0]?.price ?? item.price;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/menu?product=${item.id}`}
                  className="group flex flex-col rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex aspect-square items-center justify-center p-4 sm:p-5">
                    <img
                      src={item.image || "/cakes/chocolate-cake-1.jpg"}
                      alt={item.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-3 pb-3 text-center sm:px-4 sm:pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] sm:text-xs">
                      {item.category}
                    </p>

                    <h3 className="truncate font-display text-xs font-bold uppercase leading-tight text-[#3A2A2A] sm:text-sm">
                      {item.name}
                    </h3>

                    <p className="mt-1 font-serif text-sm font-bold text-[#1D3C42] sm:text-base">
                      ₹{basePrice}
                    </p>
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

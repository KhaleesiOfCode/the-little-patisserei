"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { getMenuCategories } from "../lib/supabase/menu";
import type { MenuCategory } from "../types/menu";

const BANNED_CATEGORIES = ["New Launches"];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getMenuCategories();
      setCategories(data);
    }
    load();
  }, []);

  const display = useMemo(
    () =>
      categories
        .filter((c) => !BANNED_CATEGORIES.includes(c.name)),
    [categories],
  );

  if (display.length === 0) return null;

  return (
    <section className="bg-[#FFF8E4] px-0 pb-10 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            What We Offer
          </span>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-[#1D3C42]">
            Our Categories
          </h2>
        </div>

        <div className="flex flex-row gap-4">
          {display.map((cat, i) => {
            const item = cat.items[0];

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="flex-1"
              >
                <Link
                  href={`/menu?category=${cat.name}`}
                  className="group relative flex aspect-square overflow-hidden rounded-2xl ring-1 ring-[#3A2A2A]/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:ring-[#D4AF37]/30"
                >
                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#F5E6D3]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="relative mt-auto px-3 pb-3 pt-8 sm:px-4 sm:pb-4">
                    <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

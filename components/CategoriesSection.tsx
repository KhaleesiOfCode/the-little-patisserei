"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { getMenuCategories } from "../lib/supabase/menu";
import type { MenuCategory } from "../types/menu";

const cardBg = "#F5E6D3";

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
    <section className="bg-[#FFF8E4] px-5 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            What We Offer
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-[#1D3C42] sm:text-4xl">
            Our Categories
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((cat, i) => {
            const item = cat.items[0];
            const caption =
              cat.items.length > 0
                ? cat.items.reduce(
                    (best, curr) =>
                      curr.description.length < best.description.length
                        ? curr
                        : best,
                  ).description
                : "Explore our selection";

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <Link
                  href={`/menu?category=${cat.name}`}
                  className="flex h-full flex-col rounded-[28px] p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8"
                  style={{ backgroundColor: cardBg }}
                >
                  <div className="text-center">
                    <h3 className="font-display text-2xl font-bold text-[#3A2A2A] sm:text-3xl">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-[#7A6262]">
                      {cat.items.length} {cat.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-1 items-center justify-center">
                    {item?.image && (
                      <div className="flex h-56 w-full items-center justify-center sm:h-64">
                        <img
                          src={item.image}
                          alt={cat.name}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-[#3A2A2A]/10 pt-4 text-center">
                    <span className="font-display text-sm italic tracking-wide text-[#7A6262]/70 line-clamp-1">
                      {caption}
                    </span>
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

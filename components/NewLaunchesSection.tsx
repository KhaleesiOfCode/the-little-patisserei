"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getNewLaunches } from "../lib/supabase/menu";
import { useCart } from "./CartContext";
import type { MenuItem, CartItem } from "../types/menu";
import { isOrderWindowOpen } from "../lib/store-hours";

const MAX_HOME_ITEMS = 4;

function cardAnim(index: number) {
  return {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-30px" },
    transition: { duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function LaunchCard({ item, index }: { item: MenuItem; index: number }) {
  const { cart, addToCart } = useCart();
  const fallbackImage = "/cakes/chocolate-cake-1.jpg";
  const hasEggChoice = item.ingredient_tags?.some((tag) =>
    tag.toLowerCase().includes("egg and eggless")
  );
  const basePrice = item.prices?.[0]?.price ?? item.price;
  const cartId = `${item.id}-${item.prices?.[0]?.quantity_label ?? "default"}-default`;

  const [orderClosedPopup, setOrderClosedPopup] = useState(false);

  const handleAdd = () => {
    if (!isOrderWindowOpen()) {
      setOrderClosedPopup(true);
      return;
    }
    if (!inCart) addToCart(cartItem);
  };

  const cartItem: CartItem = {
    ...item,
    id: cartId,
    originalId: item.id,
    selectedQuantity: item.prices?.[0]?.quantity_label ?? "Default",
    selectedEggOption: hasEggChoice ? "Eggless" : "",
    price: basePrice,
    qty: 1,
  };

  const inCart = cart.find((c) => c.id === cartId);

  return (
    <motion.div {...cardAnim(index)}>
      <div className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#E8DDD0] transition-all duration-300 hover:shadow-md hover:ring-[#D4AF37]/30">
        <Link
          href={`/menu?product=${item.id}`}
          className="block overflow-hidden"
        >
          <div className="aspect-square overflow-hidden bg-[#FAFAF5]">
            <img
              src={item.image || fallbackImage}
              alt={item.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1D3C42]">
            {item.badges?.find((b) => b === "New Launch")
              ? "New Launch"
              : item.category || "New Launch"}
          </span>

          <Link href={`/menu?product=${item.id}`}>
            <h3 className="mt-1 font-display text-sm font-bold leading-snug text-[#1D3C42] transition-colors group-hover:text-[#D4AF37] sm:text-base">
              {item.name}
            </h3>
          </Link>

          <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
            <span className="font-serif text-base font-bold tracking-wide text-[#D4AF37] sm:text-lg">
              ₹{basePrice}
            </span>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleAdd}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                inCart
                  ? "bg-[#D4AF37]/20 text-[#1D3C42] cursor-default"
                  : "bg-[#1D3C42] text-white shadow-sm hover:bg-[#163136]"
              }`}
            >
              {inCart ? "Added" : "Add"}
            </motion.button>
          </div>
        </div>
      </div>

      {orderClosedPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4" onClick={() => setOrderClosedPopup(false)}>
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <svg viewBox="0 0 120 80" className="mx-auto h-20 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="15" width="100" height="55" rx="8" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="2"/>
              <rect x="45" y="5" width="30" height="15" rx="3" fill="#D4AF37"/>
              <circle cx="60" cy="12" r="3" fill="white"/>
              <text x="60" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1D3C42" fontFamily="system-ui">CLOSED</text>
              <text x="60" y="55" textAnchor="middle" fontSize="8" fill="#7A6262" fontFamily="system-ui">WE&apos;LL BE BACK</text>
            </svg>
            <h3 className="mt-4 font-display text-xl font-bold text-[#3A2A2A]">Store is currently closed</h3>
            <p className="mt-2 text-sm text-[#7A6262]">The store will reopen for orders on Tomorrow at 7 AM</p>
            <button onClick={() => setOrderClosedPopup(false)} className="mt-6 rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#163136]">Got it</button>
          </div>
        </div>
      )}
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
      setLaunches(data.slice(0, MAX_HOME_ITEMS));
    }
    load();
    const interval = setInterval(load, 30000);
    const onFocus = () => { if (!cancelled) load(); };
    window.addEventListener("focus", onFocus);
    return () => { cancelled = true; clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, []);

  const displayItems = launches.slice(0, MAX_HOME_ITEMS);

  if (displayItems.length === 0) return null;

  return (
    <section className="bg-white px-5 py-12 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Fresh from the oven
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#1D3C42] sm:text-3xl md:text-4xl">
              New Launches
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {displayItems.map((item, i) => (
            <LaunchCard key={item.id} item={item} index={i} />
          ))}
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
            className="inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#163136] hover:shadow-md sm:px-8 sm:py-3 sm:text-sm"
          >
            View All
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

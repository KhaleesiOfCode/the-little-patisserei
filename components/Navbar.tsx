"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartContext";
import { isOrderWindowOpen, refreshStoreStatus } from "../lib/store-hours";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(isOrderWindowOpen());

  useEffect(() => {
    refreshStoreStatus().then(() => setStoreOpen(isOrderWindowOpen()));
    const interval = setInterval(() => {
      refreshStoreStatus().then(() => setStoreOpen(isOrderWindowOpen()));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[#1D3C42] sm:text-xl"
        >
          <img
              src="/logo.png"
              alt="The Little Patisserie"
              className="h-10 w-10 rounded-full object-contain sm:h-11 sm:w-11"
            />
            <span className="hidden sm:inline">The Little Patisserie</span>
        </Link>

        <div className="hidden items-center gap-7 text-[15px] font-serif font-semibold text-[#1D3C42] md:flex">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/custom-cake">Custom Cakes</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About</Link>

          {storeOpen ? (
            <Link
              href="/cart"
              className="relative rounded-full bg-[#1D3C42] px-5 py-2.5 text-white shadow-sm transition hover:bg-[#163136]"
            >
              <ShoppingBag size={16} className="mr-1 inline" />
              Cart

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#D4AF37] px-1.5 text-xs font-bold text-[#1D3C42] ring-2 ring-[#FFF8E4]">
                  {cartCount}
                </span>
              )}
            </Link>
          ) : (
            <span className="relative cursor-not-allowed rounded-full bg-[#1D3C42]/50 px-5 py-2.5 text-white/60 shadow-sm">
              <ShoppingBag size={16} className="mr-1 inline" />
              Cart
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {storeOpen ? (
            <Link
              href="/cart"
              className="relative rounded-full bg-[#1D3C42] px-4 py-2 text-sm font-bold text-white shadow-sm"
            >
              <ShoppingBag size={16} className="mr-1 inline" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#D4AF37] px-1 text-xs font-bold text-[#1D3C42] ring-2 ring-[#FFF8E4]">
                  {cartCount}
                </span>
              )}
            </Link>
          ) : (
            <span className="relative cursor-not-allowed rounded-full bg-[#1D3C42]/50 px-4 py-2 text-sm font-bold text-white/60 shadow-sm">
              <ShoppingBag size={16} className="mr-1 inline" />
              Cart
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-full text-[#1D3C42] hover:bg-[#FADCD4]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[#D4AF37]/20 bg-[#FFF8E4] px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-0.5 text-[15px] font-serif font-semibold text-[#1D3C42]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 transition hover:bg-[#FADCD4]">Home</Link>
            <Link href="/menu" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 transition hover:bg-[#FADCD4]">Menu</Link>
            <Link href="/custom-cake" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 transition hover:bg-[#FADCD4]">Custom Cakes</Link>
            <Link href="/gallery" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 transition hover:bg-[#FADCD4]">Gallery</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 transition hover:bg-[#FADCD4]">About</Link>
          </div>
        </div>
      )}
    </header>
  );
}

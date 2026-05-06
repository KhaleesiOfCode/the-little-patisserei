"use client";

import Link from "next/link";
import { CakeSlice, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#1D3C42]"
        >
          <img
              src="/logo.png"
              alt="The Little Patisserie"
              className="h-11 w-11 rounded-full object-contain"
            />
            <span>The Little Patisserie</span>

        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-[#1D3C42]">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/custom-cake">Custom Cake</Link>

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
        </div>
      </nav>
    </header>
  );
}

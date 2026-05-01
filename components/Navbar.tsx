"use client";

import Link from "next/link";
import { CakeSlice, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const cartCount = cart.reduce((sum: number, item: any) => sum + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-[#F4CFC8] bg-[#FFF8E4]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#3A2A2A]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#F08C9B] text-white">
            <CakeSlice size={21} />
          </span>
          The Little Patisserie
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-[#3A2A2A]">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/custom-cake">Custom Cake</Link>

          <Link
            href="/cart"
            className="relative rounded-full bg-[#F08C9B] px-5 py-2.5 text-white shadow-sm transition hover:bg-[#E77E8D]"
          >
            <ShoppingBag size={16} className="mr-1 inline" />
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#3A2A2A] px-1.5 text-xs font-bold text-white ring-2 ring-[#FFF8E4]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
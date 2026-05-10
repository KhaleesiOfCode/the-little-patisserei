"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/new", label: "New Product" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8E4]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <Link href="/admin/orders" className="flex items-center gap-2 text-lg font-bold text-[#1D3C42] sm:text-xl">
            <img src="/logo.png" alt="The Little Patisserie" className="h-10 w-10 rounded-full object-contain sm:h-11 sm:w-11" />
            <span className="hidden sm:inline">The Little Patisserie</span>
          </Link>

          <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 transition-all ${active ? "bg-[#F4CFC8]/50 text-[#1D3C42]" : "text-[#7A6262] hover:bg-[#F4CFC8]/30 hover:text-[#1D3C42]"}`}>
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { fetch("/api/admin/logout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; }); }}
              className="ml-4 cursor-pointer rounded-full bg-[#1D3C42] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#163136] hover:shadow-md"
            >
              <LogOut size={16} className="mr-1 inline" />
              Logout
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => { fetch("/api/admin/logout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; }); }}
              className="cursor-pointer rounded-full bg-[#1D3C42] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#163136]"
            >
              <LogOut size={16} className="mr-1 inline" />
              Logout
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid h-10 w-10 place-items-center rounded-full text-[#1D3C42] transition hover:bg-[#FADCD4]"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-[#D4AF37]/20 bg-[#FFF8E4] px-4 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1 text-sm font-semibold">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`rounded-2xl px-4 py-3 transition-all ${active ? "bg-[#F4CFC8]/50 text-[#1D3C42]" : "text-[#7A6262] hover:bg-[#FADCD4] hover:text-[#1D3C42]"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="pt-[68px] sm:pt-[76px]">{children}</main>
    </div>
  );
}

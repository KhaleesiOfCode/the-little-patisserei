"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/admin/orders": "Orders",
  "/admin/menu": "Menu",
  "/admin/new": "New Product",
  "/admin/gallery": "Gallery",
  "/admin/store-status": "Store Hours",
  "/admin/login": "Admin Login",
};
import { Menu, X, ClipboardList, Box, Plus, Image, Clock, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu", icon: Box },
  { href: "/admin/new", label: "New Product", icon: Plus },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/store-status", label: "Store Hours", icon: Clock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const title = Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(path)
    )?.[1];
    if (title) {
      document.title = `${title} | The Little Patisserie`;
    }
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 pt-6 pb-8">
        <img src="/logo.png" alt="" className="h-10 w-10 rounded-full object-contain" />
        <div>
          <p className="text-sm font-bold leading-tight text-[#1D3C42]">The Little</p>
          <p className="text-sm font-bold leading-tight text-[#1D3C42]">Patisserie</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition-all ${
                active
                  ? "bg-[#F4CFC8]/40 text-[#1D3C42]"
                  : "text-[#7A6262] hover:bg-[#FFF8E4] hover:text-[#1D3C42]"
              }`}
            >
              <item.icon size={18} className={active ? "text-[#D4AF37]" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6 pt-4">
        <button
          onClick={() => {
            fetch("/api/admin/logout", { method: "POST" }).then(() => {
              window.location.href = "/admin/login";
            });
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold text-[#7A6262] transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8E4]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-[#F4CFC8]/50 bg-white shadow-sm lg:block">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#F4CFC8]/50 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/orders" className="flex items-center gap-2 text-lg font-bold text-[#1D3C42]">
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-full object-contain" />
            <span className="text-sm">The Little Patisserie</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-full text-[#1D3C42] transition hover:bg-[#FADCD4]"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#F4CFC8]/50 bg-white shadow-xl lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="min-h-screen lg:ml-64">{children}</main>
    </div>
  );
}

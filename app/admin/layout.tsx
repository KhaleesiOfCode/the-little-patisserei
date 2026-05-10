"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/new", label: "New Product" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFF8E4]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 -translate-x-full border-r border-[#D4AF37]/30 bg-white transition-transform md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : ""}`}>
        <div className="flex h-16 items-center justify-between border-b border-[#D4AF37]/30 px-5">
          <Link href="/admin/menu" className="text-lg font-extrabold text-[#1D3C42]">
            🧁 Patisserie
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#7A6262]">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#1D3C42] text-white" : "text-[#7A6262] hover:bg-[#F4CFC8]/30 hover:text-[#1D3C42]"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={() => { fetch("/api/admin/logout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; }); }}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 px-5 backdrop-blur-md md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-[#1D3C42]">
            <Menu size={24} />
          </button>
          <span className="text-lg font-extrabold text-[#1D3C42]">🧁 Patisserie</span>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface AdminMenuItem {
  id: string;
  name: string;
  slug: string;
  food_type: string;
  is_available: boolean;
  is_new_launch: boolean;
  is_bestseller: boolean;
  display_order: number;
  category: { name: string } | { name: string }[] | null;
  prices: { quantity_label: string; price: number }[];
  media: { url: string }[];
  created_at: string;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/menu?id=${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setNotification("Product deleted");
      setTimeout(() => setNotification(null), 3000);
    }
    setDeleteId(null);
  }

  const catName = (item: AdminMenuItem) => {
    const c = item.category;
    if (!c) return "—";
    if (Array.isArray(c)) return c[0]?.name || "—";
    return (c as { name: string }).name || "—";
  };

  const thumb = (item: AdminMenuItem) => {
    if (item.media?.length) return item.media[0].url;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      {notification && (
        <div className="mb-4 rounded-xl bg-green-100 px-5 py-3 text-sm font-semibold text-green-800">
          {notification}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1D3C42]">Menu</h1>
          <p className="text-sm text-[#7A6262]">{items.length} products</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#163136]"
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/30 p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0DC]">
            <Plus size={28} className="text-[#D4AF37]" />
          </div>
          <p className="text-lg font-semibold text-[#1D3C42]">No products yet</p>
          <p className="mt-1 text-sm text-[#7A6262]">Create your first product to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group rounded-2xl border border-[#F4CFC8] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {thumb(item) ? (
                    <div className="h-16 w-16 overflow-hidden rounded-xl">
                      <img src={thumb(item)!} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F4CFC8] text-xs text-[#7A6262]">
                      No img
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#1D3C42]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#7A6262]">{catName(item)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Link
                        href={`/admin/menu/${item.id}`}
                        className="rounded-lg p-1.5 text-[#7A6262] transition hover:bg-[#F4CFC8]/40 hover:text-[#1D3C42]"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-lg p-1.5 text-[#7A6262] transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${item.is_available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.is_available ? "bg-green-500" : "bg-red-500"}`} />
                      {item.is_available ? "Active" : "Hidden"}
                    </span>
                    {item.is_new_launch && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        NEW
                      </span>
                    )}
                    {item.is_bestseller && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        BEST
                      </span>
                    )}
                    {item.food_type === "veg" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">VEG</span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">NON-VEG</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1D3C42]">
                      {item.prices?.length
                        ? `₹${Math.min(...item.prices.map((p) => p.price))}${item.prices.length > 1 ? "+" : ""}`
                        : "—"}
                    </span>
                    <span className="text-[#7A6262]">#{item.display_order}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-[#1D3C42]">Delete product?</h3>
            <p className="mt-2 text-sm text-[#7A6262]">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full border border-[#F4CFC8] px-5 py-3 text-sm font-semibold text-[#7A6262] transition hover:bg-[#F4CFC8]/30"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

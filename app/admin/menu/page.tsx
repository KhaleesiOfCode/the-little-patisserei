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
          <p className="text-lg font-semibold text-[#7A6262]">No products yet</p>
          <p className="mt-1 text-sm text-[#7A6262]/70">Create your first product to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#F4CFC8]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#F4CFC8] bg-[#FFF0DC]">
              <tr>
                <th className="px-5 py-4 font-extrabold text-[#1D3C42]">Product</th>
                <th className="px-5 py-4 font-extrabold text-[#1D3C42] hidden md:table-cell">Category</th>
                <th className="px-5 py-4 font-extrabold text-[#1D3C42] hidden sm:table-cell">Price</th>
                <th className="px-5 py-4 font-extrabold text-[#1D3C42] hidden lg:table-cell">Order</th>
                <th className="px-5 py-4 font-extrabold text-[#1D3C42]">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4CFC8]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/60 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {thumb(item) ? (
                        <img src={thumb(item)!} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4CFC8] text-xs text-[#7A6262]">
                          No img
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#1D3C42]">{item.name}</p>
                        <p className="text-xs text-[#7A6262]">{item.food_type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#7A6262] hidden md:table-cell">{catName(item)}</td>
                  <td className="px-5 py-4 text-[#7A6262] hidden sm:table-cell">
                    {item.prices?.length
                      ? `₹${Math.min(...item.prices.map((p) => p.price))}+`
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-[#7A6262] hidden lg:table-cell">{item.display_order}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${item.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.is_available ? "Active" : "Hidden"}
                    </span>
                    {item.is_new_launch && (
                      <span className="ml-1 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        NEW
                      </span>
                    )}
                    {item.is_bestseller && (
                      <span className="ml-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        BEST
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/menu/${item.id}`}
                        className="rounded-lg p-2 text-[#7A6262] transition hover:bg-[#F4CFC8]/40 hover:text-[#1D3C42]"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-lg p-2 text-[#7A6262] transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

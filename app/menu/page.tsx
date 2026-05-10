"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ShoppingBag, Trash2 } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../components/CartContext";
import { getMenuCategories } from "../../lib/supabase/menu";
import type { MenuCategory, MenuItem } from "../../types/menu";
import { isOrderWindowOpen } from "../../lib/store-hours";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState<"all" | "veg" | "nonveg">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [orderClosedPopup, setOrderClosedPopup] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const { cart, updateQty, removeFromCart, total } = useCart();

  useEffect(() => {
    const open = isOrderWindowOpen();
    setStoreOpen(open);
    if (!open) setOrderClosedPopup(true);
  }, []);

  const allItems = useMemo(() => categories.flatMap((cat) => cat.items), [categories]);

  const availableTags = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    allItems.forEach((item) => item.ingredient_tags?.forEach((t) => {
      const key = t.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (key && !seen.has(key)) {
        seen.add(key);
        result.push(t.trim());
      }
    }));
    return result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [allItems]);

  const availableBadges = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    allItems.forEach((item) => item.badges?.forEach((b) => {
      const key = b.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (key && !seen.has(key)) {
        seen.add(key);
        result.push(b.trim());
      }
    }));
    return result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [allItems]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) => prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedBadges([]);
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedBadges.length > 0;

  const scrollDoneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setError(false);
        const data = await getMenuCategories();
        if (cancelled) return;
        setCategories(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMenu();
    const interval = setInterval(loadMenu, 30000);
    const onFocus = () => { if (!cancelled) loadMenu(); };
    window.addEventListener("focus", onFocus);
    return () => { cancelled = true; clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, []);

  useEffect(() => {
    if (loading || scrollDoneRef.current) return;
    const productId = searchParams.get("product");
    if (!productId) return;
    const el = document.getElementById(`product-${productId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      scrollDoneRef.current = true;
    }
  }, [loading, searchParams]);

  const activeItems = useMemo(() => {
    let items: MenuItem[] = [];

    if (activeCategory === "All") {
      items = categories.flatMap((cat) => cat.items);
    } else {
      const selected = categories.find((cat) => cat.name === activeCategory);
      items = selected?.items || [];
    }

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesType = foodType === "all" || item.type === foodType;

      const matchesTags = selectedTags.length === 0 || selectedTags.some((t) => item.ingredient_tags?.some((it) => it.trim().toLowerCase().replace(/[^a-z0-9]/g, "") === t.toLowerCase().replace(/[^a-z0-9]/g, "")));

      const matchesBadges = selectedBadges.length === 0 || selectedBadges.some((b) => item.badges?.some((ib) => ib.trim().toLowerCase().replace(/[^a-z0-9]/g, "") === b.toLowerCase().replace(/[^a-z0-9]/g, "")));

      return matchesSearch && matchesType && matchesTags && matchesBadges;
    });
  }, [categories, activeCategory, search, foodType, selectedTags, selectedBadges]);

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#1D3C42] sm:text-4xl">Our Menu</h1>
          <p className="mt-3 text-[#7A6262]">
            Browse cakes, pastries, brownies and fresh bakery favourites.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-[#F4CFC8]">
            <p className="font-semibold text-[#1D3C42]">Loading menu...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8] lg:sticky lg:top-24">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex w-full items-center justify-between lg:cursor-default"
              >
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Categories
                </h2>
                <ChevronDown size={16} className={`text-[#D4AF37] transition lg:hidden ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`mt-4 space-y-2 ${categoriesOpen ? "block" : "hidden"} lg:block`}>
                <button
                  onClick={() => { setActiveCategory("All"); setCategoriesOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeCategory === "All"
                      ? "bg-[#1D3C42] text-white shadow-md"
                      : "bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                  }`}
                >
                  <span>All</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#1D3C42]">
                    {totalItems}
                  </span>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => { setActiveCategory(category.name); setCategoriesOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activeCategory === category.name
                        ? "bg-[#1D3C42] text-white shadow-md"
                        : "bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeCategory === category.name
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#1D3C42]"
                      }`}
                    >
                      {category.items.length}
                    </span>
                  </button>
                ))}
              </div>

              {(availableTags.length > 0 || availableBadges.length > 0) && (
                <div className="mt-6 border-t border-[#F4CFC8] pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">Filters</h3>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-[10px] font-semibold text-[#D4AF37] underline transition hover:text-[#1D3C42]">
                        Clear
                      </button>
                    )}
                  </div>

                  {availableTags.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-left text-[11px] font-semibold text-[#7A6262]">Dietary</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full px-3 py-1 text-left text-[10px] font-bold uppercase tracking-wider transition ${
                              selectedTags.includes(tag)
                                ? "bg-[#1D3C42] text-white shadow-sm"
                                : "bg-[#FFF8E4] text-[#7A6262] ring-1 ring-[#F4CFC8] hover:ring-[#D4AF37] hover:text-[#1D3C42]"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableBadges.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-left text-[11px] font-semibold text-[#7A6262]">Popular</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableBadges.map((badge) => (
                          <button
                            key={badge}
                            onClick={() => toggleBadge(badge)}
                            className={`rounded-full px-3 py-1 text-left text-[10px] font-bold uppercase tracking-wider transition ${
                              selectedBadges.includes(badge)
                                ? "bg-[#1D3C42] text-white shadow-sm"
                                : "bg-[#FFF8E4] text-[#7A6262] ring-1 ring-[#F4CFC8] hover:ring-[#D4AF37] hover:text-[#1D3C42]"
                            }`}
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-6 border-t border-[#F4CFC8] pt-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-[#D4AF37]" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">Cart ({cart.length})</h3>
                  </div>
                  <div className="mt-3 space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#1D3C42]">{item.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#7A6262]">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="font-bold hover:text-[#1D3C42]">−</button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="font-bold hover:text-[#1D3C42]">+</button>
                            <span>· ₹{item.price * item.qty}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="shrink-0 text-[#D4AF37] hover:text-red-500">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#F4CFC8] pt-3">
                    <span className="text-xs font-bold text-[#1D3C42]">Total</span>
                    <span className="text-sm font-extrabold text-[#1D3C42]">₹{total}</span>
                  </div>
                  {storeOpen ? (
                    <Link
                      href="/cart"
                      className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-[#1D3C42] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#163136]"
                    >
                      View Cart
                    </Link>
                  ) : (
                    <span className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-full bg-[#1D3C42]/50 px-4 py-2 text-xs font-bold text-white/60 shadow-sm">
                      Cart unavailable
                    </span>
                  )}
                </div>
              )}
            </aside>

            <div>
              {error && (
                <div className="mb-4 rounded-2xl bg-amber-50 px-5 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                  Could not connect to the database. Showing offline menu.
                </div>
              )}

              <div className="mb-6 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8]">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="relative">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search cakes, pastries, brownies..."
                        className="w-full rounded-full border border-[#F4CFC8] bg-[#FFF8E4] px-5 py-3 pr-11 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#1D3C42]"
                      />

                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full text-lg font-bold text-[#7A6262] hover:text-[#1D3C42]"
                          aria-label="Clear search"
                        >
                          ×
                        </button>
                      )}
                    </div>


                  <div className="flex rounded-full bg-[#FFF8E4] p-1">
                    {[
                      { label: "All", value: "all" as const },
                      { label: "Egg-free", value: "veg" as const },
                      { label: "Egg-based", value: "nonveg" as const },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setFoodType(filter.value)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                          foodType === filter.value
                            ? "bg-[#1D3C42] text-white"
                            : "text-[#1D3C42] hover:bg-white"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                    {activeCategory === "All" ? "All Items" : activeCategory}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-[#1D3C42]">
                    {activeCategory}
                  </h2>
                </div>

                <p className="text-sm text-[#7A6262]">
                  {activeItems.length} item{activeItems.length !== 1 ? "s" : ""}
                </p>
              </div>

              {activeItems.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-[#F4CFC8]">
                  <p className="font-semibold text-[#3A2A2A]">No items found</p>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Try another category, search term, or filter.
                  </p>
                </div>
              ) : (
                <div className="min-h-[60vh]">
                  <div className="grid gap-6">
                    {activeItems.map((item) => (
                      <div key={item.id} id={`product-${item.id}`}>
                        <ProductCard product={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
      </section>
    </main>
  );
}

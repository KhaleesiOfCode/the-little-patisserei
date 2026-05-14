"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import { getMenuCategories } from "../../lib/supabase/menu";
import { isOrderWindowOpen, refreshStoreStatus, getFormattedClosureEnd, getClosureReason, getClosureType, getClosureEndMessage } from "../../lib/store-hours";
import type { MenuCategory } from "../../types/menu";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Recommended";

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState<"all" | "veg" | "nonveg">("all");
  const [deliveryMode, setDeliveryMode] = useState<"local" | "courier" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [popupPending, setPopupPending] = useState<"local" | "courier">("local");
  const [showClosurePopup, setShowClosurePopup] = useState(false);

  useEffect(() => {
    if (deliveryMode) {
      try { sessionStorage.setItem("menuMode", deliveryMode); } catch {}
    }
  }, [deliveryMode]);

  useEffect(() => {
    refreshStoreStatus().then(() => {
      if (!isOrderWindowOpen()) setShowClosurePopup(true);
    });
  }, []);

  const allItems = useMemo(() => categories.flatMap((cat) => cat.items), [categories]);

  const recommendedItems = useMemo(
    () => allItems.filter((item) => item.badges?.some((b) => b.toLowerCase().includes("best seller"))),
    [allItems]
  );

  const categoryList = useMemo(
    () => ["Recommended", ...categories.map((cat) => cat.name)],
    [categories]
  );

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
    let items;

    if (activeCategory === "Recommended") {
      items = recommendedItems;
    } else {
      const selected = categories.find((cat) => cat.name === activeCategory);
      items = selected?.items || [];
    }

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesType = foodType === "all" || item.type === foodType;

      const matchesDeliveryMode = !deliveryMode || deliveryMode === "local" || item.category === "Brownies";

      return matchesSearch && matchesType && matchesDeliveryMode;
    });
  }, [categories, activeCategory, search, foodType, recommendedItems, deliveryMode]);

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
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
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
                {categoryList.map((cat) => {
                  const count = cat === "Recommended"
                    ? recommendedItems.length
                    : categories.find((c) => c.name === cat)?.items.length || 0;

                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setCategoriesOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        activeCategory === cat
                          ? "bg-[#1D3C42] text-white shadow-md"
                          : "bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          activeCategory === cat
                            ? "bg-white/20 text-white"
                            : "bg-white text-[#1D3C42]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div>
              {error && (
                <div className="mb-4 rounded-2xl bg-amber-50 px-5 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                  Could not connect to the database. Showing offline menu.
                </div>
              )}

              <div className="mb-6 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8]">
                <LayoutGroup>
                  <div className="mx-auto flex w-fit items-center gap-0 rounded-full bg-[#FFF8E4] p-1 ring-1 ring-[#F4CFC8]">
                    {[
                      { value: "local" as const, label: "Chennai", desc: "Pickup · Chennai delivery" },
                      { value: "courier" as const, label: "Courier", desc: "Brownies only · India-wide" },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setDeliveryMode(mode.value)}
                        className="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
                      >
                        {deliveryMode === mode.value && (
                          <motion.div
                            layoutId="mode-pill"
                            className="absolute inset-0 rounded-full bg-[#1D3C42]"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                        <span className={`relative z-10 transition-colors ${deliveryMode === mode.value ? "text-white" : "text-[#1D3C42]/60"}`}>
                          {mode.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </LayoutGroup>
                <div className="mt-4 border-t border-[#F4CFC8] pt-4">
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
                      { label: "Veg", value: "veg" as const },
                      { label: "Egg", value: "nonveg" as const },
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
              </div>

              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                    {activeCategory === "Recommended" ? "Recommended" : activeCategory}
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
                        <ProductCard product={item} modeRequired={deliveryMode === null} onModeRequired={() => setShowPopup(true)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl"
          >
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">How would you like your order?</h2>
            <p className="mt-2 text-sm text-[#7A6262]">Choose a mode to see available items</p>

            <div className="mt-6">
              <LayoutGroup>
                <div className="mx-auto flex w-fit items-center gap-0 rounded-full bg-[#FFF8E4] p-1 ring-1 ring-[#F4CFC8]">
                  {[
                    { value: "local" as const, label: "Chennai" },
                    { value: "courier" as const, label: "Courier" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setPopupPending(mode.value)}
                      className="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
                    >
                      {popupPending === mode.value && (
                        <motion.div
                          layoutId="popup-pill"
                          className="absolute inset-0 rounded-full bg-[#1D3C42]"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors ${popupPending === mode.value ? "text-white" : "text-[#1D3C42]"}`}>
                        {mode.label}
                      </span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>

              <p className="mt-4 text-sm leading-relaxed text-[#7A6262]">
                {popupPending === "courier"
                  ? "Shipped via courier across South India. Brownies only."
                  : "Pickup from Arumbakkam or delivery within Chennai."}
              </p>

              <button
                onClick={() => { setDeliveryMode(popupPending); setShowPopup(false); }}
                className="mt-6 w-full rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#163136]"
              >
                Browse {popupPending === "courier" ? "Courier" : "Chennai"} Menu
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="mt-3 text-xs font-bold text-[#7A6262] underline-offset-2 hover:underline hover:text-[#1D3C42]"
              >
                Skip — show all items
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showClosurePopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4" onClick={() => setShowClosurePopup(false)}>
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <svg viewBox="0 0 120 80" className="mx-auto h-20 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="15" width="100" height="55" rx="8" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="2"/>
              <rect x="45" y="5" width="30" height="15" rx="3" fill="#D4AF37"/>
              <circle cx="60" cy="12" r="3" fill="white"/>
              <text x="60" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1D3C42" fontFamily="system-ui">PAUSED</text>
              <text x="60" y="55" textAnchor="middle" fontSize="8" fill="#7A6262" fontFamily="system-ui">BACK SOON</text>
            </svg>
            {getClosureType() === "daily" ? (
              <>
                <h3 className="mt-4 font-display text-xl font-bold text-[#3A2A2A]">Orders are closed for the day 🌙</h3>
                <p className="mt-2 text-sm text-[#7A6262]">We&apos;ll be back {getClosureEndMessage()} with fresh bakes</p>
              </>
            ) : (
              <>
                <h3 className="mt-4 font-display text-xl font-bold text-[#3A2A2A]">We&apos;re taking a short pause on orders at the moment.</h3>
                {getClosureReason() && <p className="mt-2 text-sm text-[#7A6262]">{getClosureReason()}</p>}
                <p className="mt-2 text-sm text-[#7A6262]">Thank you for your patience and support 💛 We&apos;ll be back soon with fresh bakes.</p>
              </>
            )}
            <button onClick={() => setShowClosurePopup(false)} className="mt-6 rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#163136]">Okay</button>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import { getMenuCategories } from "../../lib/supabase/menu";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      const data = await getMenuCategories();
      setCategories(data);
      setLoading(false);
    }

    loadMenu();
  }, []);

  const activeItems = useMemo(() => {
    let items: any[] = [];

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

      return matchesSearch && matchesType;
    });
  }, [categories, activeCategory, search, foodType]);

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#1D3C42]">Our Menu</h1>
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
              <h2 className="mb-4 px-3 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Categories
              </h2>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory("All")}
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
                    onClick={() => setActiveCategory(category.name)}
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
            </aside>

            <div>
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
                      { label: "All", value: "all" },
                      { label: "Veg", value: "veg" },
                      { label: "Non-Veg", value: "nonveg" },
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
                  <h2 className="mt-2 text-3xl font-extrabold text-[#1D3C42]">
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
                <div className="grid gap-6">
                  {activeItems.map((item: any) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
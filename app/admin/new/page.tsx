"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface PriceRow {
  quantity_label: string;
  price: number;
  display_order: number;
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState<"veg" | "nonveg">("veg");
  const [categoryId, setCategoryId] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ingredientTags, setIngredientTags] = useState("");
  const [shelfLife, setShelfLife] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const [prices, setPrices] = useState<PriceRow[]>([
    { quantity_label: "", price: 0, display_order: 0 },
  ]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [courierSupported, setCourierSupported] = useState(true);
  const [courierWeight, setCourierWeight] = useState("");
  const [courierFragile, setCourierFragile] = useState(false);
  const [courierCategory, setCourierCategory] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      });
  }, []);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function addPrice() {
    setPrices((prev) => [
      ...prev,
      { quantity_label: "", price: 0, display_order: prev.length },
    ]);
  }

  function updatePrice(index: number, field: keyof PriceRow, value: string | number) {
    setPrices((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function removePrice(index: number) {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNotification("Product name is required");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setSaving(true);
    setNotification(null);

    // First create the product with basic info
    const payload: Record<string, unknown> = {
      name: name.trim(),
      description,
      food_type: foodType,
      category_id: categoryId || null,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      ingredient_tags: ingredientTags.split(",").map((k) => k.trim()).filter(Boolean),
      shelf_life: shelfLife || null,
      is_bestseller: isBestseller,
      is_new_launch: isNewLaunch,
      is_available: isAvailable,
      display_order: displayOrder,
      courier_supported: courierSupported,
      courier_weight_grams: courierWeight ? Number(courierWeight) : null,
      courier_fragile: courierFragile,
      courier_category: courierCategory || null,
      prices: prices.filter((p) => p.quantity_label.trim()),
    };

    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setNotification("Failed to create product");
      setSaving(false);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const product = await res.json();

      // Upload images
    if (imageFiles.length > 0) {
      setUploading(true);
      const urls: string[] = [];
      let uploadErrors = 0;

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("menuItemId", product.id);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          urls.push(url);
        } else {
          uploadErrors++;
        }
      }

      // Link images to product
      if (urls.length > 0) {
        await fetch("/api/admin/menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: product.id, image_urls: urls }),
        });
      }

      setUploading(false);

      if (uploadErrors > 0) {
        setNotification(`${uploadErrors} image(s) failed to upload. Product was created.`);
        setTimeout(() => setNotification(null), 5000);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/menu");
  }

  return (
    <div className="p-5 md:p-8">
      {notification && (
        <div className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold ${notification.includes("Fail") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {notification}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-[#7A6262] hover:bg-[#F4CFC8]/40">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1D3C42]">New Product</h1>
          <p className="text-sm text-[#7A6262]">Add a new item to the menu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic info */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 text-base font-extrabold text-[#1D3C42]">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Chocolate Truffle Cake" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Rich chocolate sponge layered with smooth truffle cream." />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Food Type</label>
              <select value={foodType} onChange={(e) => setFoodType(e.target.value as "veg" | "nonveg")} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]">
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]">
                <option value="">— Select —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Shelf Life</label>
              <input value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="3 days" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Display Order</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Keywords (comma separated)</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Chocolate, Truffle, Best Seller" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Ingredient Tags (comma separated)</label>
              <input value={ingredientTags} onChange={(e) => setIngredientTags(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Egg and Eggless" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isNewLaunch} onChange={(e) => setIsNewLaunch(e.target.checked)} className="h-4 w-4 accent-[#1D3C42]" />
              <span className="text-sm text-[#7A6262]">New Launch</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="h-4 w-4 accent-[#1D3C42]" />
              <span className="text-sm text-[#7A6262]">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="h-4 w-4 accent-[#1D3C42]" />
              <span className="text-sm text-[#7A6262]">Available</span>
            </label>
          </div>
        </section>

        {/* Prices */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#1D3C42]">Prices</h2>
            <button type="button" onClick={addPrice} className="inline-flex items-center gap-1 rounded-full bg-[#1D3C42] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#163136]">
              <Plus size={14} /> Add size
            </button>
          </div>
          {prices.map((p, i) => (
            <div key={i} className="mb-3 flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Label</label>
                <input value={p.quantity_label} onChange={(e) => updatePrice(i, "quantity_label", e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="500g" />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Price (₹)</label>
                <input type="number" step="0.01" value={p.price} onChange={(e) => updatePrice(i, "price", Number(e.target.value))} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
              </div>
              {prices.length > 1 && (
                <button type="button" onClick={() => removePrice(i)} className="mb-1 rounded-lg p-2 text-[#7A6262] hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 text-base font-extrabold text-[#1D3C42]">Images</h2>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#F4CFC8]">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-[#D4AF37]/30 text-[#7A6262] transition hover:border-[#D4AF37] hover:text-[#1D3C42]">
              <Upload size={24} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </div>
        </section>

        {/* Courier settings */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 text-base font-extrabold text-[#1D3C42]">Courier Settings</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Weight (grams)</label>
              <input type="number" value={courierWeight} onChange={(e) => setCourierWeight(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="500" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Category</label>
              <input value={courierCategory} onChange={(e) => setCourierCategory(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Cake, Cookies..." />
            </div>
            <div className="flex items-end gap-4 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={courierSupported} onChange={(e) => setCourierSupported(e.target.checked)} className="h-4 w-4 accent-[#1D3C42]" />
                <span className="text-sm text-[#7A6262]">Courier eligible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={courierFragile} onChange={(e) => setCourierFragile(e.target.checked)} className="h-4 w-4 accent-[#1D3C42]" />
                <span className="text-sm text-[#7A6262]">Fragile</span>
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4 pb-10">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-[#1D3C42] px-10 py-4 font-bold text-white transition hover:bg-[#163136] disabled:opacity-50"
          >
            {saving || uploading ? "Saving..." : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-full border border-[#F4CFC8] px-6 py-4 font-semibold text-[#7A6262] transition hover:bg-[#F4CFC8]/30">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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

const PRICE_UNITS = ["kg", "pack", "box", "g"] as const;

function getPriceValue(label: string): string {
  const lower = label.toLowerCase().trim();
  for (const unit of PRICE_UNITS) {
    if (lower.endsWith(unit)) {
      return label.slice(0, -unit.length).trim();
    }
  }
  return label;
}

function getPriceUnit(label: string): string {
  const lower = label.toLowerCase().trim();
  for (const unit of PRICE_UNITS) {
    if (lower.endsWith(unit)) return unit;
  }
  return "g";
}

interface ExistingMedia {
  id: string;
  url: string;
  display_order: number;
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>([]);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");

  const [courierSupported, setCourierSupported] = useState(true);
  const [courierWeight, setCourierWeight] = useState("");
  const [courierFragile, setCourierFragile] = useState(false);
  const [courierCategory, setCourierCategory] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    async function load() {
      const [catRes, itemRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch(`/api/admin/menu?id=${id}`),
      ]);

      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : []);

      if (itemRes.ok) {
        const item = await itemRes.json();
        setName(item.name || "");
        setDescription(item.description || "");
        setFoodType(item.food_type || "veg");
        setCategoryId(item.category_id || "");
        setKeywords((item.keywords || []).join(", "));
        setIngredientTags((item.ingredient_tags || []).join(", "));
        setShelfLife(item.shelf_life || "");
        setDisplayOrder(item.display_order || 0);
        setIsBestseller(item.is_bestseller || false);
        setIsNewLaunch(item.is_new_launch || false);
        setIsAvailable(item.is_available ?? true);

        setPrices(
          (item.prices || []).map(
            (p: { quantity_label: string; price: number; display_order: number }, i: number) => ({
              quantity_label: p.quantity_label,
              price: Number(p.price),
              display_order: p.display_order ?? i,
            })
          )
        );
        if (!item.prices?.length) {
          setPrices([{ quantity_label: "", price: 0, display_order: 0 }]);
        }

        setExistingMedia(
          (item.media || [])
            .filter((m: { media_type: string }) => m.media_type === "image")
            .map((m: ExistingMedia) => ({ id: m.id, url: m.url, display_order: m.display_order }))
        );

        const existingVideo = (item.media || []).find((m: { media_type: string }) => m.media_type === "video");
        setVideoUrl(existingVideo?.url || "");

        setCourierSupported(item.courier_supported ?? true);
        setCourierWeight(item.courier_weight_grams ? String(item.courier_weight_grams) : "");
        setCourierFragile(item.courier_fragile || false);
        setCourierCategory(item.courier_category || "");
      }

      setLoading(false);
    }
    load();
  }, [id]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(mediaId: string) {
    setMediaToRemove((prev) => [...prev, mediaId]);
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
  }

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setVideoUrl("");
    }
  }

  function removeVideo() {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview("");
    setVideoUrl("");
  }

  function addPrice() {
    setPrices((prev) => [...prev, { quantity_label: "", price: 0, display_order: prev.length }]);
  }

  function updatePrice(index: number, field: keyof PriceRow, value: string | number) {
    setPrices((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function removePrice(index: number) {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  }

  function onValueChange(index: number, val: string) {
    const unit = getPriceUnit(prices[index].quantity_label);
    updatePrice(index, "quantity_label", val + " " + unit);
  }

  function onUnitChange(index: number, unit: string) {
    const val = getPriceValue(prices[index].quantity_label);
    updatePrice(index, "quantity_label", val + " " + unit);
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, cat]);
      setCategoryId(cat.id);
      setNewCategoryName("");
    }
  }

  async function handleDeleteCategory(id: string) {
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (categoryId === id) setCategoryId("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    const validPrices = prices.filter((p) => p.quantity_label.trim() && p.price > 0);
    if (validPrices.length === 0) newErrors.prices = "Add at least one size with a price";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSaving(true);
    setNotification(null);

    // Upload new images
    const newUrls: string[] = [];
    if (newImageFiles.length > 0) {
      setUploading(true);
      for (const file of newImageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("menuItemId", id);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          newUrls.push(url);
        }
      }
      setUploading(false);
    }

    // Upload new video if selected
    let finalVideoUrl = videoUrl;
    if (videoFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("menuItemId", id);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        finalVideoUrl = url;
      }
      setUploading(false);
    }

    const payload: Record<string, unknown> = {
      id,
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
      video_url: finalVideoUrl || null,
      courier_category: courierCategory || null,
      prices: prices.filter((p) => p.quantity_label.trim()),
      media_to_remove: mediaToRemove,
      image_urls: newUrls,
    };

    const res = await fetch("/api/admin/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/menu");
    } else {
      setNotification("Failed to save changes");
      setTimeout(() => setNotification(null), 3000);
      setSaving(false);
    }
  }

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
        <div className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold ${notification.includes("Fail") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {notification}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-[#7A6262] hover:bg-[#F4CFC8]/40">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1D3C42]">Edit Product</h1>
          <p className="text-sm text-[#7A6262]">{name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
        {/* Basic info */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 border-l-2 border-[#D4AF37]/50 pl-3 text-base font-extrabold text-[#1D3C42]">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Name *</label>
              <input value={name} onChange={(e) => { setName(e.target.value); clearError("name"); }} className={`w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-[#1D3C42] ${errors.name ? "border-red-400" : "border-[#F4CFC8]"}`} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
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
              <div className="flex gap-2">
                <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); clearError("category"); }} className="flex-1 rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]">
                  <option value="">— Select —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowNewCategory(!showNewCategory)} className="rounded-xl border border-[#F4CFC8] px-3 text-[#1D3C42] hover:bg-[#F4CFC8]/30">
                  <Plus size={18} />
                </button>
              </div>
              {showNewCategory && (
                <div className="mt-3 space-y-2 rounded-xl border border-[#F4CFC8] bg-[#FFF8E4] p-3">
                  {categories.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#7A6262]">Existing categories</p>
                      {categories.map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm">
                          <span className="text-[#1D3C42]">{c.name}</span>
                          <button type="button" onClick={() => handleDeleteCategory(c.id)} className="ml-2 rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" className="flex-1 rounded-xl border border-[#F4CFC8] bg-white px-4 py-2 text-sm outline-none focus:border-[#1D3C42]" />
                    <button type="button" onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="rounded-xl bg-[#1D3C42] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#163136] disabled:opacity-50">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Shelf Life</label>
              <input value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Display Order</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Keywords (comma separated)</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Ingredient Tags (comma separated)</label>
              <input value={ingredientTags} onChange={(e) => setIngredientTags(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
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
            <h2 className="border-l-2 border-[#D4AF37]/50 pl-3 text-base font-extrabold text-[#1D3C42]">Prices</h2>
            <button type="button" onClick={addPrice} className="inline-flex items-center gap-1 rounded-full bg-[#1D3C42] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#163136]">
              <Plus size={14} /> Add size
            </button>
          </div>
          {errors.prices && <p className="mb-2 text-xs text-red-500">{errors.prices}</p>}
          {prices.map((p, i) => (
            <div key={i} className="mb-3 flex items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Size</label>
                <div className="flex gap-2">
                  <input type="number" min="1" max="9999" value={getPriceValue(p.quantity_label)} onChange={(e) => { onValueChange(i, e.target.value); clearError("prices"); }} className="w-20 rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-center outline-none focus:border-[#1D3C42]" placeholder="200" />
                  <select value={getPriceUnit(p.quantity_label)} onChange={(e) => { onUnitChange(i, e.target.value); clearError("prices"); }} className="rounded-xl border border-[#F4CFC8] bg-white px-3 py-3 outline-none focus:border-[#1D3C42]">
                    {PRICE_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-36">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Price (₹)</label>
                <input type="number" min="0" max="9999" value={p.price || ""} onChange={(e) => { updatePrice(i, "price", Number(e.target.value)); clearError("prices"); }} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-right text-lg font-bold outline-none focus:border-[#1D3C42]" placeholder="0" />
              </div>
              {prices.length > 1 && (
                <button type="button" onClick={() => removePrice(i)} className="mb-1 rounded-lg p-2 text-[#7A6262] hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </section>

        {/* Video */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 border-l-2 border-[#D4AF37]/50 pl-3 text-base font-extrabold text-[#1D3C42]">Video</h2>
          {videoPreview ? (
            <div className="relative inline-block">
              <video src={videoPreview} className="h-40 rounded-xl border border-[#F4CFC8]" controls />
              <button type="button" onClick={removeVideo} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                <Trash2 size={14} />
              </button>
            </div>
          ) : videoUrl ? (
            <div className="relative inline-block">
              <video src={videoUrl} className="h-40 rounded-xl border border-[#F4CFC8]" controls />
              <button type="button" onClick={removeVideo} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                <Trash2 size={14} />
              </button>
              <button type="button" onClick={() => videoFileInputRef.current?.click()} className="mt-2 w-full rounded-lg bg-[#F4CFC8] px-3 py-1.5 text-xs font-semibold text-[#1D3C42] hover:bg-[#E8BFB8]">
                Replace Video
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => videoFileInputRef.current?.click()} className="flex h-32 w-full items-center justify-center rounded-xl border-2 border-dashed border-[#D4AF37]/30 text-[#7A6262] transition hover:border-[#D4AF37] hover:text-[#1D3C42]">
              <div className="text-center">
                <Upload size={28} className="mx-auto mb-2" />
                <span className="text-sm font-semibold">Click to upload video</span>
                <p className="mt-1 text-xs">MP4, WebM, etc.</p>
              </div>
            </button>
          )}
          <input ref={videoFileInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <h2 className="mb-4 border-l-2 border-[#D4AF37]/50 pl-3 text-base font-extrabold text-[#1D3C42]">Images</h2>
          <div className="flex flex-wrap gap-3">
            {existingMedia.map((m) => (
              <div key={m.id} className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#F4CFC8]">
                <img src={m.url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(m.id)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {newImagePreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#F4CFC8]">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
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
          <h2 className="mb-4 border-l-2 border-[#D4AF37]/50 pl-3 text-base font-extrabold text-[#1D3C42]">Courier Settings</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Weight (grams)</label>
              <input type="number" value={courierWeight} onChange={(e) => setCourierWeight(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Category</label>
              <input value={courierCategory} onChange={(e) => setCourierCategory(e.target.value)} className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
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
            {saving || uploading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-full border border-[#F4CFC8] px-6 py-4 font-semibold text-[#7A6262] transition hover:bg-[#F4CFC8]/30">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

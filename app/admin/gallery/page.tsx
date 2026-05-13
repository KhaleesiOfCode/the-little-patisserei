"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, Link, ChevronUp, ChevronDown, Check, X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  display_order: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function addImage(url: string, caption: string) {
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, caption: caption || null }),
    });

    if (res.ok) {
      const img = await res.json();
      setImages((prev) => [...prev, img]);
      setUrlInput("");
      setCaptionInput("");
      showMessage("Image added");
    } else {
      const errBody = await res.json().catch(() => ({}));
      console.error("Add image failed:", res.status, errBody);
      showMessage(errBody.error || "Failed to add image");
    }
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      showMessage("Image deleted");
    } else {
      showMessage("Failed to delete");
    }
  }

  async function updateCaption(id: string, caption: string) {
    const res = await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, caption: caption || null }),
    });
    if (res.ok) {
      setImages((prev) => prev.map((img) => img.id === id ? { ...img, caption: caption || null } : img));
      showMessage("Caption updated");
    }
    setEditingCaption(null);
  }

  async function moveImage(id: string, direction: "up" | "down") {
    const idx = images.findIndex((img) => img.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === images.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
    const current = sorted[idx];
    const swap = sorted[swapIdx];
    if (!current || !swap) return;

    const temp = current.display_order;
    current.display_order = swap.display_order;
    swap.display_order = temp;

    await Promise.all([
      fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, display_order: current.display_order }),
      }),
      fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swap.id, display_order: swap.display_order }),
      }),
    ]);

    setImages((prev) => prev.map((img) => {
      if (img.id === current.id) return { ...img, display_order: current.display_order };
      if (img.id === swap.id) return { ...img, display_order: swap.display_order };
      return img;
    }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("menuItemId", "gallery");

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      await addImage(url, "");
    } else {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      showMessage(err.error || "Upload failed");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1D3C42]">Gallery</h1>
        <p className="text-sm text-[#7A6262]">{images.length} images &middot; Shown on homepage and /gallery page</p>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold ${message.includes("Fail") || message.includes("fail") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}

      {/* Upload */}
      <div className="mb-8 rounded-2xl border border-[#F4CFC8] bg-white p-6">
        <h2 className="mb-4 font-bold text-[#1D3C42]">Add Image</h2>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-36 w-full items-center justify-center rounded-xl border-2 border-dashed border-[#D4AF37]/30 bg-[#FFF8E4] text-[#7A6262] transition hover:border-[#D4AF37] hover:text-[#1D3C42] disabled:opacity-50"
        >
          <div className="text-center">
            <Upload size={32} className="mx-auto mb-2" />
            <span className="text-sm font-semibold">{uploading ? "Uploading..." : "Click to upload from device"}</span>
            <p className="mt-1 text-xs text-[#7A6262]/70">JPG, PNG, WebP &middot; Showcases your custom cakes</p>
          </div>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6262] hover:text-[#1D3C42]"
          >
            <Link size={14} />
            {showUrlInput ? "Hide URL input" : "Add via URL instead"}
          </button>

          {showUrlInput && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
                placeholder="https://example.com/image.jpg"
              />
              <input
                type="text"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
                placeholder="Caption (optional)"
              />
              <button
                onClick={() => addImage(urlInput, captionInput)}
                disabled={!urlInput.trim()}
                className="rounded-full bg-[#1D3C42] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:opacity-50"
              >
                Add Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {sorted.map((img, i) => (
          <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-[#F4CFC8] bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-[#F5E6D3]">
              <img src={img.url} alt={img.caption || ""} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <div className="p-3">
              {editingCaption === img.id ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 rounded-lg border border-[#F4CFC8] px-2 py-1 text-xs outline-none focus:border-[#1D3C42]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateCaption(img.id, editValue);
                      if (e.key === "Escape") setEditingCaption(null);
                    }}
                  />
                  <button onClick={() => updateCaption(img.id, editValue)} className="rounded p-1 text-green-600 hover:bg-green-50">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingCaption(null)} className="rounded p-1 text-red-500 hover:bg-red-50">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingCaption(img.id); setEditValue(img.caption || ""); }}
                  className="w-full text-left truncate text-xs text-[#7A6262] hover:text-[#1D3C42]"
                  title="Click to edit caption"
                >
                  {img.caption || <span className="italic text-[#7A6262]/40">Add caption</span>}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              {i > 0 && (
                <button onClick={() => moveImage(img.id, "up")} className="rounded-full bg-white/90 p-1.5 text-[#7A6262] shadow backdrop-blur-sm hover:bg-white hover:text-[#1D3C42]">
                  <ChevronUp size={14} />
                </button>
              )}
              {i < sorted.length - 1 && (
                <button onClick={() => moveImage(img.id, "down")} className="rounded-full bg-white/90 p-1.5 text-[#7A6262] shadow backdrop-blur-sm hover:bg-white hover:text-[#1D3C42]">
                  <ChevronDown size={14} />
                </button>
              )}
              <button onClick={() => deleteImage(img.id)} className="rounded-full bg-red-500 p-1.5 text-white shadow hover:bg-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/30 p-16 text-center">
          <p className="text-lg font-semibold text-[#1D3C42]">No gallery images</p>
          <p className="mt-1 text-sm text-[#7A6262]">Upload your first custom cake photo above.</p>
        </div>
      )}
    </div>
  );
}

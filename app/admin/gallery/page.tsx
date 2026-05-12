"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";

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
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
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
      setMessage("Image added");
    } else {
      setMessage("Failed to add image");
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      setMessage("Image deleted");
    } else {
      setMessage("Failed to delete");
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function moveImage(id: string, newOrder: number) {
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, display_order: newOrder }),
    });
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
      setMessage("Upload failed");
      setTimeout(() => setMessage(null), 3000);
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

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1D3C42]">Gallery</h1>
        <p className="text-sm text-[#7A6262]">{images.length} images</p>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold ${message.includes("Fail") || message.includes("fail") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message}
        </div>
      )}

      <div className="mb-8 rounded-2xl border border-[#F4CFC8] bg-white p-6">
        <h2 className="mb-4 font-bold text-[#1D3C42]">Add Image</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Image URL</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Caption (optional)</label>
            <input
              type="text"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
              placeholder="Cake description..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => addImage(urlInput, captionInput)}
              disabled={!urlInput.trim()}
              className="rounded-full bg-[#1D3C42] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:opacity-50"
            >
              Add Image
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full border border-[#F4CFC8] px-6 py-3 text-sm font-semibold text-[#7A6262] transition hover:bg-[#F4CFC8]/30 disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-[#F4CFC8] bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-[#F5E6D3]">
              <img src={img.url} alt={img.caption || ""} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs text-[#7A6262]">{img.caption || "No caption"}</p>
              <p className="text-[10px] text-[#7A6262]/60">Order: {img.display_order}</p>
            </div>
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/30 p-16 text-center">
          <p className="text-lg font-semibold text-[#1D3C42]">No gallery images</p>
          <p className="mt-1 text-sm text-[#7A6262]">Add your first image above.</p>
        </div>
      )}
    </div>
  );
}

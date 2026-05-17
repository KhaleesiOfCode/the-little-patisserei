"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, Camera } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "919488407130";
const FALLBACK = Array.from({ length: 29 }, (_, i) => ({
  id: `fallback-${i}`,
  url: `/gallery/cake-${i + 1}.jpg`,
  caption: null,
  display_order: i,
}));

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  display_order: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages(FALLBACK);
        }
        setLoading(false);
      })
      .catch(() => {
        setImages(FALLBACK);
        setLoading(false);
      });
  }, []);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-10 md:pt-28 md:pb-14">
          <div className="mx-auto h-1 w-16 rounded-full bg-[#D4AF37]" />
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Your stories, our creations
          </p>
          <h1 className="mt-4 text-center font-display text-4xl font-bold leading-tight text-[#1D3C42] md:text-5xl">
            Every Cake Tells a Story,{" "}
            <span className="text-[#D4AF37]">Your Story!!</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-8 text-[#7A6262]">
            At The Little Patisserie, custom cakes are more than just desserts, they are stories, your
            stories thoughtfully brought to life. We believe custom cakes should feel deeply personal.
            From adding elements that feel personal and meaningful to designing cakes that reflect your
            vision, every creation is made with care, intention, and heart. Each cake is handcrafted to
            suit your preferences, themes, colours, and intricate details.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-8 text-[#7A6262]">
            Browse through our collection of past creations and find inspiration for your own special
            celebration.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to order a custom celebration cake. Can you help me design one?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-[#1D3C42] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#D4AF37]/90 hover:shadow-xl"
            >
              <Sparkles size={18} />
              Order a Custom Cake
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#163136] hover:shadow-xl"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
            </div>
          ) : (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(i)}
                  className="group relative mb-4 w-full overflow-hidden rounded-2xl break-inside-avoid shadow-md ring-1 ring-[#F4CFC8] transition duration-300 hover:shadow-xl"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Custom cake creation"}
                    className="w-full transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full px-3 pb-3 transition duration-300 group-hover:translate-y-0">
                      <p className="text-left text-xs font-semibold text-white drop-shadow-lg">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {!loading && images.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/30 p-16 text-center">
              <Camera size={40} className="mx-auto text-[#D4AF37]" />
              <p className="mt-4 text-lg font-semibold text-[#1D3C42]">Gallery coming soon</p>
              <p className="mt-1 text-sm text-[#7A6262]">Check back for our latest custom creations.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#1D3C42] py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Have a Cake in Mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-white/70">
            Tell us your flavour, theme, size, and occasion — we&apos;ll bring your dream cake to
            life. Every custom order starts with a conversation.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to discuss a custom cake order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-10 py-4 text-sm font-bold text-[#1D3C42] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#D4AF37]/90 hover:shadow-xl"
          >
            <Sparkles size={18} />
            Start Your Custom Order
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="mx-4 max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption || "Custom cake creation"}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
            {images[lightboxIndex].caption && (
              <p className="mt-4 text-center text-sm font-semibold text-white">
                {images[lightboxIndex].caption}
              </p>
            )}
            <p className="mt-2 text-center text-xs text-white/60">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const GALLERY_IMAGES = [
  { src: "/gallery/cake-1.jpg", label: "Chocolate Truffle Cake" },
  { src: "/gallery/cake-2.jpg", label: "Mango Cream Cake" },
  { src: "/gallery/cake-3.jpg", label: "Red Velvet Delight" },
  { src: "/gallery/cake-4.jpg", label: "Birthday Special Cake" },
  { src: "/gallery/cake-5.jpg", label: "Cupcake Box" },
  { src: "/gallery/cake-6.jpg", label: "Anniversary Cake" },
];

const COPIES = 5;
const IMG = [...Array(COPIES)].flatMap(() => GALLERY_IMAGES);
const LEN = GALLERY_IMAGES.length;

export default function GallerySection() {
  const [pos, setPos] = useState(LEN * Math.floor(COPIES / 2));
  const [x, setX] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = ((pos % LEN) + LEN) % LEN;

  const updateOffset = useCallback(() => {
    if (!rowRef.current || !containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    const child = rowRef.current.children[0] as HTMLElement | null;
    if (!child) return;
    const itemW = child.offsetWidth;
    const gap = 16;
    const offset = containerW / 2 - itemW / 2 - pos * (itemW + gap);
    setX(offset);
  }, [pos]);

  const next = useCallback(() => {
    setPos((p) => p + 1);
  }, []);

  const prev = useCallback(() => {
    setPos((p) => p - 1);
  }, []);

  useEffect(() => {
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [updateOffset]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  return (
    <section className="bg-[#FFF8E4] px-0 pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            Our Creations
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-[#1D3C42] sm:text-4xl">
            Gallery
          </h2>
        </div>

        <div className="relative mx-auto max-w-5xl" ref={containerRef}>
          <div className="overflow-hidden">
            <div
              ref={rowRef}
              className="flex items-center gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${x}px)` }}
            >
              {IMG.map((img, i) => {
                const localIndex = ((i % LEN) + LEN) % LEN;
                const dist = Math.abs(i - pos);
                return (
                  <button
                    key={`${localIndex}-${i}`}
                    onClick={() => setPos(i)}
                    className="w-[70%] shrink-0 sm:w-[55%] lg:w-[42%]"
                  >
                    <div
                      className="aspect-[4/3] overflow-hidden rounded-2xl"
                      style={{
                        opacity: dist === 0 ? 1 : dist < 3 ? 0.45 : 0.1,
                        filter: dist > 1 ? "blur(3px)" : "none",
                        transform: `scale(${dist === 0 ? 1 : 0.9})`,
                        transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.label}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {dist === 0 && (
                      <p className="mt-3 text-center font-display text-sm font-bold text-[#3A2A2A] sm:text-base">
                        {img.label}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-left-4 sm:p-2.5"
          >
            <svg className="h-4 w-4 text-[#3A2A2A]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-right-4 sm:p-2.5"
          >
            <svg className="h-4 w-4 text-[#3A2A2A]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
          {GALLERY_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPos(LEN * Math.floor(COPIES / 2) + i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-6 bg-[#D4AF37]"
                  : "w-2 bg-[#3A2A2A]/20 hover:bg-[#3A2A2A]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCart } from "./CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }: any) {
  const { cart, addToCart, updateQty } = useCart();
  const itemInCart = cart.find((item: any) => item.id === product.id);

  const mediaItems = [
    ...(product.images || [product.image]).map((src: string) => ({
      type: "image",
      src,
    })),
    ...(product.video ? [{ type: "video", src: product.video }] : []),
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeMedia = mediaItems[activeIndex];
  const extraCount = Math.max(mediaItems.length - 1, 0);

  const next = () => setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleEsc);
  }

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [isOpen]);

  return (
    <>
      <article className="grid gap-5 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8] transition hover:shadow-lg md:grid-cols-[260px_1fr_auto]">
        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsOpen(true);
          }}
          className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#FADCD4] text-left"
        >
          <img
            src={mediaItems[0]?.src || product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          {extraCount > 0 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-[#1D3C42] px-3 py-1.5 text-xs font-bold text-white shadow-md">
              +{extraCount}
            </span>
          )}

          {mediaItems.some((m) => m.type === "video") && (
            <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white">
              <Play size={16} fill="white" />
            </span>
          )}
        </button>

        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-[3px] border ${
                product.type === "nonveg" ? "border-red-500" : "border-green-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  product.type === "nonveg" ? "bg-red-500" : "bg-green-600"
                }`}
              />
            </span>

            <h3 className="text-2xl font-extrabold text-[#3A2A2A]">
              {product.name}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                product.type === "nonveg"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product.type === "nonveg" ? "Non-Veg" : "Veg"}
            </span>
                      </div>
                    {product.tags?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          <p className="max-w-2xl text-sm leading-7 text-[#7A6262]">
            {product.description}
          </p>

          <p className="mt-4 text-xl font-extrabold text-[#1D3C42]">
            ₹{product.price}
          </p>
        </div>

        <div className="flex items-center justify-start md:justify-end">
          {!itemInCart ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => addToCart(product)}
              className="rounded-full bg-[#1D3C42] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#163136]"
            >
              Add
            </motion.button>
          ) : (
            <div className="flex items-center rounded-full border border-[#1D3C42]">
              <button
                onClick={() => updateQty(product.id, itemInCart.qty - 1)}
                className="px-4 py-2 text-[#1D3C42]"
              >
                −
              </button>

              <span className="px-4 py-2 text-sm font-bold text-[#3A2A2A]">
                {itemInCart.qty}
              </span>

              <button
                onClick={() => updateQty(product.id, itemInCart.qty + 1)}
                className="px-4 py-2 text-[#1D3C42]"
              >
                +
              </button>
            </div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center rounded-full border border-[#1D3C42]"
        ></motion.div>
      </article>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 px-4 py-6" onClick={() => setIsOpen(false)}>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#1D3C42]"
          >
            <X size={22} />
          </button>

          <div className="mx-auto flex h-full max-w-5xl flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3">
              <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-[#FADCD4]">
                {activeMedia?.type === "video" ? (
                  <video
                    src={activeMedia.src}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia?.src}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1D3C42] shadow"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1D3C42] shadow"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto rounded-2xl bg-white/10 p-3">
              {mediaItems.map((media, index) => (
                <button
                  key={`${media.src}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border ${
                    activeIndex === index
                      ? "border-[#D4AF37] ring-2 ring-[#D4AF37]"
                      : "border-white/30"
                  }`}
                >
                  {media.type === "video" ? (
                    <div className="grid h-full w-full place-items-center bg-[#1D3C42] text-white">
                      <Play size={18} fill="white" />
                    </div>
                  ) : (
                    <img
                      src={media.src}
                      alt={`${product.name} preview`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
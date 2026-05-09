"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Clock,
} from "lucide-react";
import { useCart } from "./CartContext";
import { motion } from "framer-motion";
import type { MenuItem, CartItem } from "../types/menu";
import LiveDesignStudio from "./LiveDesignStudio";

const WHATSAPP_NUMBER = "919488407130";

export default function ProductCard({ product }: { product: MenuItem }) {
  const { cart, addToCart, updateQty, updateCartItem } = useCart();

  const prices = product.prices || [];

  const [selectedPrice, setSelectedPrice] = useState(
    prices[0] || { quantity_label: "Default", price: product.price || 0, display_order: 0 }
  );

  const hasEggChoice = product.ingredient_tags?.some((tag) =>
    tag.toLowerCase().includes("egg and eggless")
  );

  const [eggOption, setEggOption] = useState(hasEggChoice ? "Eggless" : "");

  const isCelebrationCake = product.category === "Celebration Cakes" || product.badges?.some((b) => b.toLowerCase().includes("celebration"))

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cakeMessage, setCakeMessage] = useState("");
  const [cakeOccasion, setCakeOccasion] = useState("");
  const [cakeDesign, setCakeDesign] = useState("");
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const baseCartId = `${product.id}-${selectedPrice.quantity_label}-${
    eggOption || "default"
  }`;

  const cartId = baseCartId;

  const cartProduct: CartItem = {
    ...product,
    id: cartId,
    originalId: product.id,
    selectedQuantity: selectedPrice.quantity_label,
    selectedEggOption: eggOption,
    price: Number(selectedPrice.price),
    qty: 1,
  };

  const itemInCart = cart.find((item) => item.id === cartId);
  const fallbackImage = "/cakes/chocolate-cake-1.jpg";

  const compactTags = useMemo(
    () =>
      [...(product.keywords || []), ...(product.ingredient_tags || [])].slice(
        0,
        3
      ),
    [product.keywords, product.ingredient_tags]
  );

  const mediaItems = [
    ...(product.images?.length
      ? product.images
      : [product.image || fallbackImage]
    ).map((src: string) => ({ type: "image" as const, src })),
    ...(product.video ? [{ type: "video" as const, src: product.video }] : []),
  ];

  const activeMedia = mediaItems[activeIndex];
  const extraCount = Math.max(mediaItems.length - 1, 0);

  const next = () => setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsGalleryOpen(false);
        setIsDetailsOpen(false);
        setIsDropdownOpen(false);
      }
      if (isGalleryOpen && mediaItems.length > 1) {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isGalleryOpen, isDetailsOpen, mediaItems.length]);

  return (
    <>
      <article className="grid gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#F4CFC8] transition hover:-translate-y-0.5 hover:shadow-xl grid-cols-[90px_1fr] sm:gap-4 sm:p-4 sm:grid-cols-[140px_1fr] sm:rounded-[2rem] md:grid-cols-[230px_1fr] md:gap-5">
        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsGalleryOpen(true);
          }}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#FADCD4] text-left sm:aspect-square sm:rounded-[1.5rem]"
        >
          <img
            src={mediaItems[0]?.src || fallbackImage}
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

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                    product.type === "nonveg"
                      ? "border-red-500"
                      : "border-green-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.type === "nonveg" ? "bg-red-500" : "bg-green-600"
                    }`}
                  />
                </span>

                <h3 className="font-serif text-sm font-bold leading-tight text-[#3A2A2A] sm:text-xl md:text-2xl">
                  {product.name}
                </h3>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  product.type === "nonveg"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {product.type === "nonveg" ? "Non-Veg" : "Veg"}
              </span>
            </div>

            {product.badges?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-1 max-w-4xl overflow-hidden text-xs leading-5 text-[#7A6262] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] sm:mt-3 sm:text-sm sm:leading-6">
              {product.description}
            </p>

            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="mt-0 text-xs font-bold text-[#1D3C42] underline-offset-4 hover:underline sm:mt-1 sm:text-sm"
            >
              View more
            </button>

            {compactTags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
                {compactTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#FFF8E4] px-3 py-1 text-xs font-semibold text-[#7A6262] ring-1 ring-[#F4CFC8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {product.shelf_life && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#7A6262] sm:mt-3 sm:gap-2 sm:text-xs">
                <Clock size={12} className="sm:hidden" />
                <Clock size={14} className="hidden sm:block" />
                Shelf life: {product.shelf_life}
              </p>
            )}

            {hasEggChoice && (
              <div className="mt-1 flex flex-wrap items-center gap-1 sm:mt-3 sm:gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Choose option
                </span>

                <div className="flex rounded-full bg-[#FFF8E4] p-1 ring-1 ring-[#F4CFC8]">
                  {["Eggless", "Egg"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setEggOption(option)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition sm:px-4 sm:py-2 sm:text-xs ${
                        eggOption === option
                          ? "bg-[#1D3C42] text-white shadow-sm"
                          : "text-[#1D3C42] hover:bg-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 sm:mt-4 sm:gap-3">
            {prices.length > 1 ? (
              <div className="relative min-w-0 sm:min-w-[220px]" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-full border border-[#D4AF37] bg-[#FFF8E4] px-3 py-1.5 text-xs font-extrabold text-[#1D3C42] shadow-sm transition hover:bg-white sm:px-5 sm:py-3 sm:text-sm"
                >
                  <span className="truncate">
                    {selectedPrice.quantity_label} · ₹
                    {Number(selectedPrice.price)}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 transition sm:size-[18px] ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 z-30 mb-2 w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[#F4CFC8]">
                    {prices.map((p) => {
                      const isSelected =
                        selectedPrice.quantity_label === p.quantity_label;

                      return (
                        <button
                          key={p.quantity_label}
                          type="button"
                          onClick={() => {
                            setSelectedPrice(p);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold transition ${
                            isSelected
                              ? "bg-[#1D3C42] text-white"
                              : "text-[#1D3C42] hover:bg-[#FFF8E4]"
                          }`}
                        >
                          <span>{p.quantity_label}</span>
                          <span>₹{Number(p.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : prices.length === 1 ? (
              <div className="flex min-w-0 items-center rounded-full border border-[#D4AF37] bg-[#FFF8E4] px-3 py-1.5 text-xs font-extrabold text-[#1D3C42] sm:min-w-[220px] sm:px-5 sm:py-3 sm:text-sm">
                <span className="truncate">
                  {selectedPrice.quantity_label} · ₹
                  {Number(selectedPrice.price)}
                </span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-base font-black text-[#1D3C42] sm:text-xl">
                ₹{Number(selectedPrice.price)}
              </p>

              {!itemInCart ? (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (isCelebrationCake) {
                      setCustomizationOpen(true);
                    } else {
                      addToCart(cartProduct);
                    }
                  }}
                  className="rounded-full bg-[#1D3C42] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#163136] sm:px-7 sm:py-3 sm:text-sm"
                >
                  {isCelebrationCake ? "Customize" : "Add"}
                </motion.button>
              ) : (
                <div className="flex items-center rounded-full border border-[#1D3C42]">
                  <button
                    onClick={() => updateQty(cartId, itemInCart.qty - 1)}
                    className="px-3 py-1.5 text-[#1D3C42] sm:px-4 sm:py-2"
                  >
                    −
                  </button>

                  <span className="px-3 py-1.5 text-xs font-bold text-[#3A2A2A] sm:px-4 sm:py-2 sm:text-sm">
                    {itemInCart.qty}
                  </span>

                  <button
                    onClick={() => updateQty(cartId, itemInCart.qty + 1)}
                    className="px-3 py-1.5 text-[#1D3C42] sm:px-4 sm:py-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {isCelebrationCake && customizationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 space-y-3"
              >
                <LiveDesignStudio
                  cakeMessage={cakeMessage}
                  setCakeMessage={setCakeMessage}
                  cakeOccasion={cakeOccasion}
                  setCakeOccasion={setCakeOccasion}
                  cakeDesign={cakeDesign}
                  setCakeDesign={setCakeDesign}
                  productName={product.name}
                />

                <motion.button
                  whileTap={cakeMessage || cakeOccasion ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (!cakeMessage && !cakeOccasion) return;
                    const msg = encodeURIComponent(
                      `Hi, I'd like to enquire about the ${product.name} (${selectedPrice.quantity_label} · ₹${Number(selectedPrice.price)}) for a celebration.\n\nMessage on cake: ${cakeMessage || "Not specified"}\nOccasion: ${cakeOccasion || "Not specified"}\nDesign description: ${cakeDesign || "Not specified"}\n\nPlease let me know the customization options, pricing, and delivery details.`
                    );
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
                  }}
                  className={`w-full rounded-full px-6 py-3 text-sm font-extrabold shadow-sm transition ${
                    cakeMessage || cakeOccasion
                      ? "bg-[#D4AF37] text-[#1D3C42] hover:bg-[#D4AF37]/90 cursor-pointer"
                      : "bg-[#D4AF37]/40 text-[#1D3C42]/50 cursor-not-allowed"
                  }`}
                >
                  Enquire on WhatsApp
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </article>

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 px-4 py-6"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-3xl items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-[#FFF8E4] text-[#1D3C42]"
              >
                <X size={20} />
              </button>

              <h2 className="pr-12 text-3xl font-extrabold text-[#3A2A2A]">
                {product.name}
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    product.type === "nonveg"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.type === "nonveg" ? "Non-Veg" : "Veg"}
                </span>

                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-[#7A6262]">
                {product.description}
              </p>

              {product.keywords?.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                    Taste Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F7F1DF] px-3 py-1 text-xs font-semibold text-[#1D3C42]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.ingredient_tags?.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                    Ingredients / Contains
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredient_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#FFF8E4] px-3 py-1 text-xs font-semibold text-[#7A6262] ring-1 ring-[#F4CFC8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.shelf_life && (
                <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#7A6262]">
                  <Clock size={16} />
                  Shelf life: {product.shelf_life}
                </p>
              )}

              {hasEggChoice && (
                <p className="mt-4 text-sm font-semibold text-[#7A6262]">
                  Selected option:{" "}
                  <span className="font-extrabold text-[#1D3C42]">
                    {eggOption}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 px-4 py-6"
          onClick={() => setIsGalleryOpen(false)}
        >
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#1D3C42]"
          >
            <X size={22} />
          </button>

          <div
            className="mx-auto flex h-full max-w-5xl flex-col justify-center"
            onClick={(e) => e.stopPropagation()}
          >
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
                    src={activeMedia?.src || fallbackImage}
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
          </div>
        </div>
      )}
    </>
  );
}

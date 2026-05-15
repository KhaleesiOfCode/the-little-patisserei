"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, MessageCircle } from "lucide-react";
import { getMenuCategories } from "../../lib/supabase/menu";
import type { MenuItem } from "../../types/menu";
import { formatQuantityLabel } from "../../types/menu";

const WHATSAPP_NUMBER = "919488407130";

const STEPS = [
  { num: 1, label: "Choose Flavour" },
  { num: 2, label: "Personalise" },
  { num: 3, label: "Review & Enquire" },
];

const OCCASION_SUGGESTIONS = [
  "Birthday", "Anniversary", "Wedding", "Graduation", "Baby Shower", "Get Well",
];

export default function CustomCakeStudioPage() {
  const [celebrationCakes, setCelebrationCakes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [selectedCake, setSelectedCake] = useState<MenuItem | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<MenuItem["prices"][number] | null>(null);
  const [eggOption, setEggOption] = useState("Eggless");
  const [cakeMessage, setCakeMessage] = useState("");
  const [cakeOccasion, setCakeOccasion] = useState("");
  const [cakeDesign, setCakeDesign] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const cats = await getMenuCategories();
        const celebration = cats.find(
          (c) => c.name === "Celebration Cakes"
        );
        setCelebrationCakes(celebration?.items ?? []);
      } catch {
        setCelebrationCakes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasEggChoice = selectedCake?.ingredient_tags?.some((tag) =>
    tag.toLowerCase().includes("egg and eggless")
  );

  const currentPrice = selectedPrice ?? selectedCake?.prices?.[0] ?? null;
  const currentPriceAmount = currentPrice ? Number(currentPrice.price) : (selectedCake?.price ?? 0);

  function selectCake(cake: MenuItem) {
    setSelectedCake(cake);
    setSelectedPrice(cake.prices?.[0] ?? null);
    setEggOption(
      cake.ingredient_tags?.some((t) => t.toLowerCase().includes("egg and eggless"))
        ? "Eggless"
        : ""
    );
    setCakeMessage("");
    setCakeOccasion("");
    setCakeDesign("");
  }

  const whatsappMessage = useMemo(() => {
    if (!selectedCake) return "";
    const lines = [
      "Hi, I'd like to order a custom cake:",
      "",
      `• Flavour: ${selectedCake.name}`,
      `• Size: ${currentPrice ? formatQuantityLabel(currentPrice.quantity_label) : "Default"}`,
      `• Price: ₹${currentPriceAmount}`,
      hasEggChoice ? `• Egg option: ${eggOption}` : null,
      cakeMessage ? `• Message: ${cakeMessage}` : null,
      cakeOccasion ? `• Occasion: ${cakeOccasion}` : null,
      cakeDesign ? `• Design: ${cakeDesign}` : null,
    ].filter(Boolean).join("\n");
    return encodeURIComponent(lines);
  }, [selectedCake, currentPrice, currentPriceAmount, hasEggChoice, eggOption, cakeMessage, cakeOccasion, cakeDesign]);

  const canGoNext = step === 1 ? selectedCake !== null : step === 2 ? true : true;
  const canEnquire = selectedCake !== null;

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8E4] via-[#FFF8E4] to-[#FADCD4]/30 px-5 pt-20 pb-10 md:pt-28 md:pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#D4AF37]/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Custom Cakes
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[#1D3C42] md:text-5xl">
            Your Vision, <span className="text-[#D4AF37]">Handcrafted</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#7A6262]">
            Describe your dream cake and we&apos;ll bring it to life. Choose
            your flavour, add a message, and send us your ideas.
          </p>
        </div>

        {/* Step indicator */}
        <div className="relative mx-auto mt-10 flex max-w-2xl items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition-all duration-500 ${
                    step > s.num
                      ? "bg-[#1D3C42] text-white"
                      : step === s.num
                      ? "bg-[#D4AF37] text-[#1D3C42] shadow-lg shadow-[#D4AF37]/30"
                      : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8]"
                  }`}
                >
                  {step > s.num ? <Check size={18} /> : s.num}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                    step >= s.num ? "text-[#1D3C42]" : "text-[#7A6262]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-3 mb-6 h-0.5 w-12 transition-colors duration-500 md:w-20 ${
                    step > s.num ? "bg-[#1D3C42]" : "bg-[#F4CFC8]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Step content */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-display text-2xl font-bold text-[#1D3C42]">
                Choose your flavour
              </h2>
              <p className="mt-2 text-sm text-[#7A6262]">
                Pick a base for your custom cake. Each comes with standard
                sizing and pricing — just tell us your design.
              </p>

              {loading ? (
                <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-[#F4CFC8]">
                  <p className="font-semibold text-[#1D3C42]">Loading cakes...</p>
                </div>
              ) : celebrationCakes.length === 0 ? (
                <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-[#F4CFC8]">
                  <p className="font-semibold text-[#3A2A2A]">No celebration cakes available</p>
                  <p className="mt-2 text-sm text-[#7A6262]">Check back later or browse our menu.</p>
                </div>
              ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {celebrationCakes.map((cake) => {
                  const isSelected = selectedCake?.id === cake.id;
                  return (
                    <button
                      key={cake.id}
                      onClick={() => selectCake(cake)}
                      className={`group relative overflow-hidden rounded-[2rem] bg-white p-5 text-left shadow-sm ring-1 transition-all hover:-translate-y-1 hover:shadow-lg ${
                        isSelected
                          ? "ring-2 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
                          : "ring-[#F4CFC8]"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden rounded-xl">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      {isSelected && (
                        <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-[#D4AF37] text-white shadow">
                          <Check size={16} />
                        </div>
                      )}

                      <h3 className="mt-4 font-display text-lg font-bold text-[#1D3C42]">
                        {cake.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#7A6262] line-clamp-2">
                        {cake.description}
                      </p>

                      {cake.keywords && cake.keywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {cake.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="rounded-full bg-[#FFF8E4] px-2.5 py-0.5 text-[10px] font-semibold text-[#7A6262] ring-1 ring-[#F4CFC8]"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-[#F4CFC8]/50 pt-4">
                        <span className="text-sm text-[#7A6262]">
                          Starts from
                        </span>
                        <span className="text-xl font-extrabold text-[#1D3C42]">
                          ₹{cake.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              )}
            </motion.div>
          )}

          {step === 2 && selectedCake && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center gap-4">
                <img
                  src={selectedCake.image}
                  alt={selectedCake.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1D3C42]">
                    Personalise your cake
                  </h2>
                  <p className="text-sm text-[#7A6262]">
                    {selectedCake.name}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-5">
                  {/* Size selector */}
                  {selectedCake.prices && selectedCake.prices.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1D3C42]">
                        Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCake.prices.map((p) => {
                          const active = currentPrice?.quantity_label === p.quantity_label;
                          return (
                            <button
                              key={p.quantity_label}
                              onClick={() => setSelectedPrice(p)}
                              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                                active
                                  ? "bg-[#1D3C42] text-white shadow"
                                  : "bg-white text-[#3A2A2A] ring-1 ring-[#F4CFC8] hover:bg-[#FFF8E4]"
                              }`}
                            >
                              {formatQuantityLabel(p.quantity_label)} — ₹{p.price}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Egg choice */}
                  {hasEggChoice && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1D3C42]">
                        Egg preference
                      </label>
                      <div className="flex rounded-full bg-[#FFF8E4] p-1 ring-1 ring-[#F4CFC8] w-fit">
                        {["Eggless", "Egg"].map((option) => (
                          <button
                            key={option}
                            onClick={() => setEggOption(option)}
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                              eggOption === option
                                ? "bg-[#1D3C42] text-white shadow-sm"
                                : "text-[#1D3C42]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1D3C42]">
                      Message on cake
                    </label>
                    <div className="relative">
                      <input
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        placeholder="e.g. Happy Birthday!"
                        maxLength={50}
                        className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#7A6262]">
                        {cakeMessage.length}/50
                      </span>
                    </div>
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1D3C42]">
                      Occasion
                    </label>
                    <input
                      value={cakeOccasion}
                      onChange={(e) => setCakeOccasion(e.target.value)}
                      placeholder="Type or pick a suggestion"
                      className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {OCCASION_SUGGESTIONS.map((occ) => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() =>
                            setCakeOccasion(occ === cakeOccasion ? "" : occ)
                          }
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            cakeOccasion === occ
                              ? "bg-[#1D3C42] text-white shadow-sm"
                              : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8] hover:bg-[#FFF8E4]"
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Design */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1D3C42]">
                      Design description
                    </label>
                    <div className="relative">
                      <textarea
                        value={cakeDesign}
                        onChange={(e) => setCakeDesign(e.target.value)}
                        placeholder="e.g. Pastel floral design, gold topper..."
                        maxLength={200}
                        className="min-h-[4rem] w-full resize-none rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-[#7A6262]">
                        {cakeDesign.length}/200
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview card */}
                <div className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:sticky md:top-24">
                  <h3 className="font-display text-lg font-bold text-[#1D3C42]">
                    Your Custom Cake
                  </h3>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7A6262]">Flavour</span>
                      <span className="font-semibold text-[#1D3C42]">
                        {selectedCake.name}
                      </span>
                    </div>
                    {currentPrice && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Size</span>
                        <span className="font-semibold text-[#1D3C42]">
                          {formatQuantityLabel(currentPrice.quantity_label)}
                        </span>
                      </div>
                    )}
                    {hasEggChoice && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Egg</span>
                        <span className="font-semibold text-[#1D3C42]">
                          {eggOption}
                        </span>
                      </div>
                    )}
                    {cakeMessage && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Message</span>
                        <span className="font-semibold text-[#D4AF37]">
                          {cakeMessage}
                        </span>
                      </div>
                    )}
                    {cakeOccasion && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Occasion</span>
                        <span className="font-semibold text-[#1D3C42]">
                          {cakeOccasion}
                        </span>
                      </div>
                    )}
                    {cakeDesign && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Design</span>
                        <span className="font-semibold text-[#1D3C42] max-w-[200px] text-right">
                          {cakeDesign}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 border-t border-[#F4CFC8] pt-5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-[#1D3C42]">
                        Estimated price
                      </span>
                      <span className="text-2xl font-extrabold text-[#1D3C42]">
                        ₹{currentPriceAmount}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#7A6262]">
                      Final pricing confirmed via WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && selectedCake && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#D4AF37]/20">
                  <Check size={28} className="text-[#D4AF37]" />
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-[#1D3C42]">
                  Almost ready!
                </h2>
                <p className="mt-2 text-[#7A6262]">
                  Review your custom cake details and send us an enquiry on
                  WhatsApp. We&apos;ll get back to you to confirm pricing and
                  delivery.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-lg rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F4CFC8]">
                    <span className="font-bold text-[#1D3C42]">Flavour</span>
                    <span className="font-semibold text-[#3A2A2A]">{selectedCake.name}</span>
                  </div>
                  {currentPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6262]">Size</span>
                      <span className="font-semibold text-[#3A2A2A]">{formatQuantityLabel(currentPrice.quantity_label)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6262]">Price</span>
                    <span className="text-xl font-extrabold text-[#1D3C42]">₹{currentPriceAmount}</span>
                  </div>
                  {hasEggChoice && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6262]">Egg option</span>
                      <span className="font-semibold text-[#3A2A2A]">{eggOption}</span>
                    </div>
                  )}
                  {cakeMessage && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6262]">Message</span>
                      <span className="font-semibold text-[#D4AF37]">{cakeMessage}</span>
                    </div>
                  )}
                  {cakeOccasion && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6262]">Occasion</span>
                      <span className="font-semibold text-[#3A2A2A]">{cakeOccasion}</span>
                    </div>
                  )}
                  {cakeDesign && (
                    <div className="flex items-start justify-between gap-4 pt-4 border-t border-[#F4CFC8]">
                      <span className="text-[#7A6262] shrink-0">Design</span>
                      <span className="font-semibold text-[#3A2A2A] text-right">{cakeDesign}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#1D3C42] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#163136] hover:-translate-y-0.5"
                >
                  <MessageCircle size={20} />
                  Send Enquiry on WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-[#7A6262]">
                  We typically respond within a few hours
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#F4CFC8] bg-white px-6 py-3 text-sm font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext}
              className="rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#163136] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 1 ? "Continue" : "Review Order"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

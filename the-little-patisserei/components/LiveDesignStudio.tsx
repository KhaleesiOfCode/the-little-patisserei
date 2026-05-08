"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveDesignStudioProps {
  cakeMessage: string;
  setCakeMessage: (v: string) => void;
  cakeOccasion: string;
  setCakeOccasion: (v: string) => void;
  cakeDesign: string;
  setCakeDesign: (v: string) => void;
  productName: string;
}

const OCCASION_SUGGESTIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Graduation",
  "Baby Shower",
  "Get Well",
];

export default function LiveDesignStudio({
  cakeMessage,
  setCakeMessage,
  cakeOccasion,
  setCakeOccasion,
  cakeDesign,
  setCakeDesign,
  productName,
}: LiveDesignStudioProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF8E4] via-[#FFF8E4] to-[#FADCD4]/30 p-5 ring-1 ring-[#F4CFC8]"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 flex items-center gap-3"
      >
        <motion.div
          animate={{ rotate: [0, -10, 0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20"
        >
          <span className="text-lg leading-none">🎨</span>
        </motion.div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            Design Studio
          </p>
          <p className="text-[10px] leading-tight text-[#7A6262]">
            Personalise your {productName}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        {/* ---- Cake Preview ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center py-2"
        >
          <div className="relative h-44 w-44">
            {/* Cake stand */}
            <div className="absolute bottom-2 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37] shadow" />
            <div className="absolute bottom-4 left-1/2 h-8 w-2.5 -translate-x-1/2 rounded-full bg-[#D4AF37]/30" />

            {/* Cake body */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-6 left-1/2 h-28 w-40 -translate-x-1/2 rounded-b-full rounded-t-[40%] bg-gradient-to-b from-[#FADCD4] to-[#F4CFC8] shadow-lg"
            >
              {/* Message rendered on cake */}
              <div className="flex h-full items-center justify-center p-4">
                <p className="max-h-16 overflow-hidden text-center text-xs font-bold leading-snug text-[#1D3C42]">
                  {cakeMessage || (
                    <span className="text-[#7A6262]/40 italic">
                      Your message
                    </span>
                  )}
                </p>
              </div>

              {/* Gold ribbon stripe */}
              <div className="absolute -top-1 left-0 right-0 h-3 rounded-t-[40%] bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30" />
            </motion.div>

            {/* Occasion badge */}
            <AnimatePresence>
              {cakeOccasion && (
                <motion.div
                  initial={{ scale: 0, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, y: -20, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 15,
                  }}
                  className="absolute -right-3 -top-3 z-10"
                >
                  <span className="inline-block whitespace-nowrap rounded-full bg-[#1D3C42] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {cakeOccasion}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle gold shimmer */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-0 rounded-full opacity-0"
            >
              <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#D4AF37]/8 to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* ---- Form Fields ---- */}
        <div className="space-y-3.5">
          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative"
          >
            <label
              className={`mb-1.5 block text-xs font-semibold transition-colors duration-300 ${
                focusedField === "message"
                  ? "text-[#D4AF37]"
                  : "text-[#7A6262]"
              }`}
            >
              Message on cake
            </label>
            <div className="relative">
              <input
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Happy Birthday!"
                maxLength={50}
                className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-2.5 pr-12 text-sm outline-none transition-all duration-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
              <motion.span
                animate={cakeMessage.length > 40 ? { color: "#D4AF37" } : {}}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#7A6262]"
              >
                {cakeMessage.length}/50
              </motion.span>
            </div>
          </motion.div>

          {/* Occasion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative"
          >
            <label
              className={`mb-1.5 block text-xs font-semibold transition-colors duration-300 ${
                focusedField === "occasion"
                  ? "text-[#D4AF37]"
                  : "text-[#7A6262]"
              }`}
            >
              Occasion
            </label>
            <input
              value={cakeOccasion}
              onChange={(e) => setCakeOccasion(e.target.value)}
              onFocus={() => setFocusedField("occasion")}
              onBlur={() => setFocusedField(null)}
              placeholder="Type or pick a suggestion"
              className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
            {/* Occasion suggestion chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 flex flex-wrap gap-1.5"
            >
              {OCCASION_SUGGESTIONS.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() =>
                    setCakeOccasion(occ === cakeOccasion ? "" : occ)
                  }
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    cakeOccasion === occ
                      ? "scale-105 bg-[#1D3C42] text-white shadow-sm"
                      : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8] hover:scale-105 hover:bg-[#FFF8E4] hover:text-[#1D3C42]"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Design description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group relative"
          >
            <label
              className={`mb-1.5 block text-xs font-semibold transition-colors duration-300 ${
                focusedField === "design"
                  ? "text-[#D4AF37]"
                  : "text-[#7A6262]"
              }`}
            >
              Design description
            </label>
            <div className="relative">
              <textarea
                value={cakeDesign}
                onChange={(e) => setCakeDesign(e.target.value)}
                onFocus={() => setFocusedField("design")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Pastel floral design, gold topper..."
                maxLength={200}
                className="min-h-[3.5rem] w-full resize-none rounded-xl border border-[#F4CFC8] bg-white px-4 py-2.5 pr-12 text-sm outline-none transition-all duration-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
              <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[#7A6262]">
                {cakeDesign.length}/200
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

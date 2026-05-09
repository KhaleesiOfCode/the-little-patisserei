"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
    </motion.div>
  );
}

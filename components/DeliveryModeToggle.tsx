"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

const modes = [
  {
    value: "local" as const,
    label: "Chennai",
    tagline: "Pickup or local delivery",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
        <path d="M12 3v6" />
        <circle cx="9" cy="16" r="1.5" fill="currentColor" />
        <circle cx="15" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    description: "Collect from our Arumbakkam bakery or get it delivered within Chennai. Same-day slots available.",
  },
  {
    value: "courier" as const,
    label: "Courier",
    tagline: "South India delivery",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    description: "Shipped via courier across Tamil Nadu, Karnataka, Kerala, Andhra Pradesh & Telangana. 2–5 day transit.",
  },
];

interface DeliveryModeToggleProps {
  value: "local" | "courier" | null;
  onChange: (mode: "local" | "courier") => void;
}

export default function DeliveryModeToggle({ value, onChange }: DeliveryModeToggleProps) {
  const [pending, setPending] = useState<"local" | "courier">("local");

  if (value) return null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-[#1D3C42] sm:text-4xl">
            How would you like your order?
          </h1>
          <p className="mt-3 text-sm text-[#7A6262]">
            Choose your delivery mode to browse what&apos;s available
          </p>
        </div>

        <div className="mt-10">
          <LayoutGroup>
            <div className="mx-auto flex w-fit items-center gap-0 rounded-full bg-[#FFF8E4] p-1 ring-1 ring-[#F4CFC8]">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setPending(mode.value)}
                  className="relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
                >
                  {pending === mode.value && (
                    <motion.div
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-full bg-[#1D3C42]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 transition-colors ${pending === mode.value ? "text-white" : "text-[#1D3C42]"}`}>
                    {mode.icon}
                    <span>{mode.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <motion.div
            key={pending}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm leading-relaxed text-[#7A6262]">
              {modes.find((m) => m.value === pending)?.description}
            </p>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(pending)}
            className="mt-8 w-full rounded-full bg-[#1D3C42] px-8 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#163136]"
          >
            Browse {modes.find((m) => m.value === pending)?.label} Menu
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

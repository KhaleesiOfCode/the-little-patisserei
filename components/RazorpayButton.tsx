"use client";

import { useCallback, useEffect, useState, startTransition } from "react";
import { CreditCard } from "lucide-react";
import { useCart } from "./CartContext";

interface RazorpayButtonProps {
  className?: string;
  label?: string;
  disabled?: boolean;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: () => void;
  modal: { ondismiss: () => void };
  prefill: { contact: string };
  theme: { color: string };
}

interface RazorpayInstance {
  on: (event: string, handler: () => void) => void;
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function RazorpayButton({
  className = "",
  label = "Pay with Razorpay",
  disabled = false,
}: RazorpayButtonProps) {
  const { cart, total } = useCart();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window.Razorpay !== "undefined") {
      startTransition(() => setLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => startTransition(() => setLoaded(true));
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = useCallback(() => {
    if (!loaded || cart.length === 0) return;

    setLoading(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: total * 100,
      currency: "INR",
      name: "The Little Patisserie",
      description: "Bakery order payment",
      image: "/logo.png",
      handler: function () {
        setLoading(false);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
      prefill: {
        contact: "",
      },
      theme: {
        color: "#1D3C42",
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setLoading(false));
      rzp.open();
    } catch {
      setLoading(false);
    }
  }, [loaded, cart.length, total]);

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || !loaded || loading || cart.length === 0}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <CreditCard size={18} />
      {loading ? "Processing..." : !loaded ? "Loading..." : label}
    </button>
  );
}

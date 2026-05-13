"use client";

import { useEffect, useState, startTransition, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { getOrderById } from "../../../lib/supabase/orders";
import type { Order, OrderStatus, DeliveryMode } from "../../../types/menu";
import { ORDER_STATUS_LABELS, getStatusFlow } from "../../../types/menu";

const statusIcons: Record<string, string> = {
  order_received: "📥", baker_confirmed: "✅",
  ready_for_pickup: "📦", picked_up: "✅📦",
  out_for_delivery: "🚚", courier_booked: "📦🚚",
  delivered: "🎉", date_change_requested: "📅", cancelled: "❌",
  refund_initiated: "💰", refunded: "✅💰",
};

function Stamp({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="absolute select-none"
      style={{
        transform: "rotate(-12deg)",
        top: "28%",
        right: "8%",
        zIndex: 10,
        opacity: 0.5,
      }}
    >
      <div
        className="rounded border-2 px-4 py-1 text-sm font-black uppercase tracking-[0.2em] shadow-lg"
        style={{ borderColor: color, color }}
      >
        {label}
      </div>
    </div>
  );
}

function PrinterIcon() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="flex h-16 w-20 items-end justify-center rounded-lg bg-gradient-to-b from-gray-200 to-gray-300 shadow-inner">
          <div className="mb-1 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          </div>
        </div>
        <div className="absolute -top-2 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-sm bg-gray-800" />
        <div className="absolute -top-3 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-gray-800" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#1D3C42]">Printing</p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(true);
  const [showStamps, setShowStamps] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    async function load() {
      const data = await getOrderById(orderId as string);
      if (cancelled) return;
      startTransition(() => { setOrder(data); setLoading(false); });
    }
    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderId]);

  useEffect(() => {
    if (!loading && order) {
      const t1 = setTimeout(() => setPrinting(false), 2000);
      const t2 = setTimeout(() => setShowStamps(true), 2800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [loading, order]);

  const status = order?.status as OrderStatus | undefined;
  const mode = order?.delivery_mode as DeliveryMode | undefined;
  const flow = mode ? getStatusFlow(mode) : [];
  const statusIndex = status ? flow.indexOf(status) : -1;
  const showFlow = statusIndex >= 0;

  if (loading) return (
    <main className="min-h-screen bg-[#FFF8E4]">
      <div className="flex items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D3C42] border-t-transparent" />
      </div>
    </main>
  );

  if (!order) return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-[#D4AF37]/40" />
        <h1 className="mt-6 text-3xl font-extrabold text-[#1D3C42]">Order not found</h1>
        <p className="mt-2 text-[#7A6262]">We couldn&apos;t find this order.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#1D3C42] px-8 py-3 font-semibold text-white transition hover:bg-[#163136]">Back to home</Link>
      </section>
    </main>
  );

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const orderTime = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const isPaid = order.payment_status === "paid" || order.payment_status === "completed";

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-10 md:py-14">
        {/* Printer animation phase */}
        {printing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <PrinterIcon />
            <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-full rounded-full bg-[#1D3C42]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`w-full transition-all duration-[1500ms] ease-out ${printing ? "max-h-0 overflow-hidden opacity-0" : "max-h-[3000px] opacity-100"}`}
        >
          <div
            ref={receiptRef}
            className="relative mx-auto max-w-sm rounded-[2rem] border-2 border-dashed border-[#D4AF37]/40 bg-white px-6 pb-6 pt-8 shadow-xl ring-1 ring-[#F4CFC8]"
          >
            {/* Top perforation */}
            <div className="absolute left-0 right-0 top-0 flex justify-between px-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-3 w-1 rounded-full bg-[#FFF8E4]" />
              ))}
            </div>

            {/* Stamps */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
              {isPaid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={showStamps ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Stamp label="PAID" color="#16A34A" />
                </motion.div>
              )}
            </div>

            {/* Store header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D3C42]">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h1 className="mt-3 font-display text-xl font-extrabold text-[#1D3C42]">Order placed!</h1>
              <p className="mt-0.5 text-xs text-[#7A6262]">The Little Patisserie</p>
            </div>

            {/* Order number & date */}
            <div className="mt-4 border-t border-dashed border-[#F4CFC8] pt-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Bill No.</p>
              <p className="font-mono text-xl font-extrabold text-[#1D3C42]">{order.order_number}</p>
              <p className="mt-1 font-mono text-sm text-[#7A6262]">{orderDate} &middot; {orderTime}</p>
              {mode && (
                <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                  mode === "pickup" ? "bg-teal-100 text-teal-700" : mode === "courier" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                }`}>
                  {mode === "pickup" ? "Pickup" : mode === "courier" ? "Courier" : "Local Delivery"}
                </span>
              )}
            </div>

            {/* Customer */}
            <div className="mt-3 border-t border-dashed border-[#F4CFC8] pt-3">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <span className="text-[#7A6262]">Customer</span>
                <span className="font-semibold text-right">{order.customer_name}</span>
                <span className="text-[#7A6262]">Phone</span>
                <span className="font-semibold text-right">{order.customer_phone}</span>
                {mode !== "pickup" && order.address_line_1 && (
                  <>
                    <span className="text-[#7A6262]">Address</span>
                    <span className="text-right text-[#7A6262]">
                      {order.address_line_1}
                      {order.address_line_2 ? `, ${order.address_line_2}` : ""}
                      {order.city ? `, ${order.city}` : ""}
                      {order.pincode ? ` - ${order.pincode}` : ""}
                    </span>
                  </>
                )}
                {order.preferred_delivery_date && (
                  <>
                    <span className="text-[#7A6262]">Date</span>
                    <span className="font-semibold text-right">
                      {new Date(order.preferred_delivery_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </>
                )}
                {order.preferred_delivery_slot && (
                  <>
                    <span className="text-[#7A6262]">Slot</span>
                    <span className="font-semibold text-right">{order.preferred_delivery_slot}</span>
                  </>
                )}
                {order.pickup_date && (
                  <>
                    <span className="text-[#7A6262]">Pickup</span>
                    <span className="font-semibold text-right">
                      {new Date(order.pickup_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div className="mt-3 border-t border-dashed border-[#F4CFC8] pt-3 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Status</p>
                <p className="mt-1 text-lg font-extrabold text-[#1D3C42]">
                  {statusIcons[status]} {ORDER_STATUS_LABELS[status] || status}
                </p>
                {showFlow && (
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {flow.map((step, i) => {
                      const isActive = i <= statusIndex;
                      const isLast = i === flow.length - 1;
                      return (
                        <div key={step} className="flex items-center">
                          <div className={`grid h-7 w-7 place-items-center rounded-full text-xs transition ${
                            isActive ? "bg-[#1D3C42] text-white" : "bg-[#FFF8E4] text-[#7A6262]"
                          }`}>{statusIcons[step]}</div>
                          {!isLast && <div className={`mx-0.5 h-px w-4 ${i < statusIndex ? "bg-[#1D3C42]" : "bg-[#F4CFC8]"}`} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="mt-4 border-t border-dashed border-[#D4AF37]/40" />

            {/* Items */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Items</p>
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-[#3A2A2A]">{item.item_name}</p>
                    <p className="font-mono text-sm text-[#7A6262]">
                      ₹{Number(item.unit_price)} x {item.quantity}
                      {item.quantity_label ? ` (${item.quantity_label})` : ""}
                      {item.egg_option ? ` · ${item.egg_option}` : ""}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-mono text-base font-bold text-[#1D3C42]">₹{Number(item.line_total)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-1.5 border-t border-dashed border-[#F4CFC8] pt-3">
              <div className="flex justify-between font-mono text-sm text-[#7A6262]">
                <span>Subtotal</span><span>₹{order.subtotal}</span>
              </div>
              {(order.delivery_fee ?? 0) > 0 && (
                <div className="flex justify-between font-mono text-sm text-[#7A6262]">
                  <span>{mode === "courier" ? "Courier charge" : "Delivery"}</span><span>₹{order.delivery_fee}</span>
                </div>
              )}
              {mode === "courier" && order.fragile_surcharge > 0 && (
                <div className="flex justify-between font-mono text-sm text-[#7A6262]">
                  <span>Fragile packaging</span><span>₹{order.fragile_surcharge}</span>
                </div>
              )}
              {order.estimated_delivery_at && (
                <div className="flex justify-between font-mono text-sm text-[#D4AF37]">
                  <span>Est. delivery</span>
                  <span>{new Date(order.estimated_delivery_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                </div>
              )}
              <div className="flex justify-between font-mono text-xl font-extrabold text-[#1D3C42]">
                <span>Total</span><span>₹{order.total}</span>
              </div>
              <div className="flex justify-between font-mono text-xs text-[#7A6262]">
                <span>Payment</span>
                <span className={isPaid ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                  {isPaid ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            {/* Bottom tear line */}
            <div className="mt-5 border-t-2 border-dashed border-[#D4AF37]/30 pt-3 text-center">
              <p className="font-mono text-sm text-[#7A6262]">Thank you for your order! 💛</p>
              <p className="mt-0.5 font-mono text-xs text-[#D4AF37]/60">The Little Patisserie &middot; Chennai</p>
            </div>

            {/* Perforation dots bottom */}
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-3 w-1 rounded-full bg-[#FFF8E4]" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className={`mt-8 w-full max-w-sm space-y-3 transition-all duration-500 ${showStamps ? "opacity-100" : "opacity-0"}`}>
          <a
            href={`/track/${order.order_number}`}
            className="flex items-center justify-center gap-2 rounded-full bg-[#1D3C42] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#163136]"
          >
            Track your order <span className="text-lg">→</span>
          </a>
          <div className="flex gap-3">
            <Link href="/menu" className="flex-1 rounded-full border border-[#D4AF37] px-5 py-3 text-center text-sm font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]">
              Order more
            </Link>
            <a
              href={`https://wa.me/919488407130?text=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}`)}`}
              target="_blank"
              className="flex-1 rounded-full border border-[#D4AF37] px-5 py-3 text-center text-sm font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

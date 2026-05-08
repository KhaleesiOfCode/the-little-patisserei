"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, MapPin, Package, ShoppingBag, ExternalLink } from "lucide-react";
import Navbar from "../../../components/Navbar";
import { getOrderById } from "../../../lib/supabase/orders";
import type { Order, OrderStatus, DeliveryMode } from "../../../types/menu";
import { ORDER_STATUS_LABELS, getStatusFlow } from "../../../types/menu";

const statusIcons: Record<string, string> = {
  order_received: "📥", baker_confirmed: "✅", preparing: "👨‍🍳",
  ready_for_pickup: "📦", picked_up: "✅📦", ready_for_delivery: "📦",
  out_for_delivery: "🚚", courier_booked: "📦🚚", in_transit: "🚚",
  delivered: "🎉", date_change_requested: "📅", cancelled: "❌",
  refund_initiated: "💰", refunded: "✅💰",
};

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    let cancelled = false;
    async function load() {
      const data = await getOrderById(orderId as string);
      if (cancelled) return;
      setOrder(data); setLoading(false);
    }
    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderId]);

  const status = order?.status as OrderStatus | undefined;
  const mode = order?.delivery_mode as DeliveryMode | undefined;
  const flow = mode ? getStatusFlow(mode) : [];
  const statusIndex = status ? flow.indexOf(status) : -1;
  const showFlow = statusIndex >= 0;

  if (loading) return (
    <main className="min-h-screen bg-[#FFF8E4]">
      <Navbar />
      <div className="flex items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D3C42] border-t-transparent" />
      </div>
    </main>
  );

  if (!order) return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-[#D4AF37]/40" />
        <h1 className="mt-6 text-3xl font-extrabold text-[#1D3C42]">Order not found</h1>
        <p className="mt-2 text-[#7A6262]">We couldn&apos;t find this order.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#1D3C42] px-8 py-3 font-semibold text-white transition hover:bg-[#163136]">Back to home</Link>
      </section>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />
      <section className="mx-auto max-w-2xl px-4 py-10 md:px-5 md:py-14">
        {/* Success header */}
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-[#1D3C42]">Order placed!</h1>
            <p className="mt-1 text-[#7A6262]">Thank you for your order.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-[#FFF8E4] px-4 py-1.5 text-sm font-bold text-[#1D3C42] ring-1 ring-[#F4CFC8]">
                {order.order_number}
              </span>
              {mode && (
                <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  mode === "pickup" ? "bg-teal-100 text-teal-700" : mode === "courier" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                }`}>
                  {mode === "pickup" ? "Pickup" : mode === "courier" ? "Courier" : "Local Delivery"}
                </span>
              )}
            </div>
          </div>

          {/* Status tracker */}
          <div className="mt-8 rounded-2xl bg-[#FFF8E4] p-5">
            {status && (
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A6262]">Current status</p>
                <p className="mt-1 text-xl font-extrabold text-[#1D3C42]">
                  {statusIcons[status]} {ORDER_STATUS_LABELS[status] || status}
                </p>
              </div>
            )}
            {showFlow && (
              <div className="mt-6">
                <div className="flex items-center justify-between px-1">
                  {flow.map((step, index) => {
                    const isActive = index <= statusIndex;
                    const isLast = index === flow.length - 1;
                    return (
                      <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
                            isActive ? "bg-[#1D3C42] text-white shadow-sm" : "bg-white text-[#7A6262]"
                          }`}>{statusIcons[step]}</div>
                          <p className={`mt-1 max-w-12 text-center text-[8px] font-bold leading-tight ${
                            isActive ? "text-[#1D3C42]" : "text-[#7A6262]"
                          }`}>{ORDER_STATUS_LABELS[step]}</p>
                        </div>
                        {!isLast && (
                          <div className={`mx-1 h-0.5 w-2 sm:mx-2 sm:w-6 ${index < statusIndex ? "bg-[#1D3C42]" : "bg-white"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Info cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {order.estimated_delivery_at && (
              <div className="rounded-2xl bg-[#FFF8E4] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#D4AF37]">Estimated</p>
                <p className="mt-1 text-lg font-extrabold text-[#1D3C42]">
                  {new Date(order.estimated_delivery_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </p>
                {order.preferred_delivery_slot && <p className="text-xs text-[#7A6262]">{order.preferred_delivery_slot}</p>}
              </div>
            )}
            {(order.delivery_fee ?? 0) > 0 && (
              <div className="rounded-2xl bg-[#FFF8E4] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#D4AF37]">Delivery fee</p>
                <p className="mt-1 text-lg font-extrabold text-[#1D3C42]">₹{order.delivery_fee}</p>
              </div>
            )}
          </div>

          {/* Delivery & Schedule */}
          <div className="mt-8 grid gap-6 border-t border-[#F4CFC8] pt-8 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                <MapPin size={14} /> {mode === "pickup" ? "Pickup" : "Delivery"}
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold text-[#3A2A2A]">{order.customer_name}</p>
                <p className="text-[#7A6262]">{order.customer_phone}</p>
                {mode !== "pickup" && order.address_line_1 && (
                  <p className="text-[#7A6262] leading-relaxed">
                    {order.address_line_1}
                    {order.address_line_2 ? `, ${order.address_line_2}` : ""}
                    {order.city ? `, ${order.city}` : ""}
                    {order.pincode ? ` - ${order.pincode}` : ""}
                  </p>
                )}
                {mode === "pickup" && (
                  <p className="text-[#7A6262]">The Little Patisserie, Chennai</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                <Clock size={14} /> Schedule
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                {order.preferred_delivery_date && (
                  <p className="text-[#7A6262]">
                    Date: <span className="font-semibold text-[#3A2A2A]">
                      {new Date(order.preferred_delivery_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </p>
                )}
                {order.preferred_delivery_slot && (
                  <p className="text-[#7A6262]">
                    Slot: <span className="font-semibold text-[#3A2A2A]">{order.preferred_delivery_slot}</span>
                  </p>
                )}
                {order.pickup_date && (
                  <p className="text-[#7A6262]">
                    Pickup: <span className="font-semibold text-[#3A2A2A]">
                      {new Date(order.pickup_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8 border-t border-[#F4CFC8] pt-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
              <Package size={14} /> Items
            </h3>
            <div className="mt-4 divide-y divide-[#F4CFC8]">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#3A2A2A]">{item.item_name}</p>
                    {item.quantity_label && (
                      <p className="text-sm text-[#7A6262]">
                        {item.quantity_label}{item.egg_option ? ` · ${item.egg_option}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold text-[#3A2A2A]">₹{Number(item.line_total)}</p>
                    <p className="text-xs text-[#7A6262]">₹{Number(item.unit_price)} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-[#F4CFC8] pt-5">
              <div className="flex justify-between text-sm text-[#7A6262]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              {(order.delivery_fee ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-[#7A6262]">
                  <span>{mode === "courier" ? "Courier charge" : "Delivery"}</span>
                  <span>₹{order.delivery_fee}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-extrabold text-[#1D3C42]">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-[#1D3C42] p-5 text-center">
              <p className="text-sm font-semibold text-white/70">Track your order live</p>
              <a
                href={`${typeof window !== "undefined" ? window.location.origin : ""}/track/${order.order_number}`}
                target="_blank"
                className="mt-2 inline-flex items-center gap-2 text-lg font-extrabold text-[#D4AF37] underline underline-offset-4 transition hover:text-white"
              >
                Track now <ExternalLink size={18} />
              </a>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/menu" className="flex-1 rounded-full bg-[#1D3C42] px-7 py-3 text-center font-semibold text-white transition hover:bg-[#163136]">Order more</Link>
              <a href={`https://wa.me/919488407130?text=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}`)}`} target="_blank"
                className="flex-1 rounded-full border border-[#D4AF37] px-7 py-3 text-center font-semibold text-[#1D3C42] transition hover:bg-[#FFF8E4]">Contact us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

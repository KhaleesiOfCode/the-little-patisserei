"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, MapPin, Package, ShoppingBag, Truck, DollarSign } from "lucide-react";
import { getOrderByNumber } from "../../../lib/supabase/orders";
import type { Order, OrderStatus, DeliveryMode } from "../../../types/menu";
import { ORDER_STATUS_LABELS, getStatusFlow, STATUS_COLORS } from "../../../types/menu";

const statusIcons: Record<string, string> = {
  order_received: "📥",
  baker_confirmed: "✅",
  preparing: "👨‍🍳",
  ready_for_pickup: "📦",
  picked_up: "✅📦",
  ready_for_delivery: "📦",
  out_for_delivery: "🚚",
  courier_booked: "📦🚚",
  in_transit: "🚚",
  delivered: "🎉",
  date_change_requested: "📅",
  cancelled: "❌",
  refund_initiated: "💰",
  refunded: "✅💰",
};

export default function TrackPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderNumber) { setLoading(false); setError(true); return; }
    let cancelled = false;
    async function load() {
      const data = await getOrderByNumber(orderNumber);
      if (cancelled) return;
      if (data) setOrder(data); else setError(true);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderNumber]);

  const status = order?.status as OrderStatus | undefined;
  const mode = order?.delivery_mode as DeliveryMode | undefined;
  const flow = mode ? getStatusFlow(mode) : [];
  const statusIndex = status ? flow.indexOf(status) : -1;
  const showFlow = statusIndex >= 0;
  const isTerminal = status && !flow.includes(status);

  if (loading) return (
    <main className="min-h-screen bg-[#FFF8E4]"><div className="flex items-center justify-center pt-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D3C42] border-t-transparent" /></div></main>
  );

  if (error || !order) return (
    <main className="min-h-screen bg-[#FFF8E4] px-5 py-20 text-center text-[#3A2A2A]">
      <div className="mx-auto max-w-md">
        <ShoppingBag size={48} className="mx-auto text-[#D4AF37]" />
        <h1 className="mt-6 text-3xl font-extrabold text-[#1D3C42]">Order not found</h1>
        <p className="mt-3 text-[#7A6262]">No order with number <strong>{orderNumber}</strong>.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white">Back to home</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <header className="border-b border-[#D4AF37]/30 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-full object-contain" />
            <span className="text-sm font-bold text-[#1D3C42]">The Little Patisserie</span>
          </Link>
          <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]">Track order</span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:p-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Tracking</p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#1D3C42]">{order.order_number}</h1>
            <p className="mt-1 text-sm text-[#7A6262]">{order.customer_name}</p>
            {mode && (
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                mode === "pickup" ? "bg-teal-100 text-teal-700" : mode === "courier" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
              }`}>
                {mode === "pickup" ? "Pickup" : mode === "courier" ? "Courier" : "Local Delivery"}
              </span>
            )}
          </div>

          {status && (
            <div className={`mt-6 rounded-2xl p-4 text-center ring-1`} style={{ backgroundColor: STATUS_COLORS[status]?.split(" ")[0] || "#FFF8E4" }}>
              <p className="text-sm font-semibold uppercase tracking-[0.15em]">Current status</p>
              <p className="mt-1 text-2xl font-extrabold">{statusIcons[status]} {ORDER_STATUS_LABELS[status] || status}</p>
            </div>
          )}

          {showFlow && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {flow.map((step, index) => {
                  const isActive = index <= statusIndex;
                  const isLast = index === flow.length - 1;
                  return (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`grid h-10 w-10 place-items-center rounded-full text-base transition ${
                          isActive ? "bg-[#1D3C42] text-white shadow-md" : "bg-[#FFF8E4] text-[#7A6262]"
                        }`}>{statusIcons[step]}</div>
                        <p className={`mt-1.5 max-w-16 text-center text-[10px] font-bold leading-tight ${
                          isActive ? "text-[#1D3C42]" : "text-[#7A6262]"
                        }`}>{ORDER_STATUS_LABELS[step]}</p>
                      </div>
                      {!isLast && <div className={`mx-1 h-0.5 w-3 sm:mx-2 sm:w-10 ${index < statusIndex ? "bg-[#1D3C42]" : "bg-[#F4CFC8]"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isTerminal && (
            <div className={`mt-6 rounded-2xl p-4 text-center text-sm font-semibold ring-1 ${
              status === "cancelled" || status === "refunded" ? "bg-red-50 text-red-600 ring-red-200" :
              status === "refund_initiated" ? "bg-pink-50 text-pink-600 ring-pink-200" :
              "bg-yellow-50 text-yellow-700 ring-yellow-200"
            }`}>
              {status === "date_change_requested" && "We need to discuss a date change. Please check your messages."}
              {status === "cancelled" && "This order has been cancelled."}
              {status === "refund_initiated" && "Refund initiated."}
              {status === "refunded" && "Order refunded."}
              {status === "picked_up" && "Order picked up. Thank you!"}
            </div>
          )}

          {/* Delivery fee */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(order.delivery_fee ?? 0) > 0 && (
              <div className="rounded-2xl bg-[#FFF8E4] p-4 text-center ring-1 ring-[#F4CFC8]">
                <p className="text-xs text-[#7A6262]">Delivery fee</p>
                <p className="text-lg font-extrabold text-[#1D3C42]">₹{order.delivery_fee}</p>
                {order.delivery_fee_status === "estimated" && <p className="text-[10px] text-[#7A6262]">Estimated</p>}
              </div>
            )}
            {order.estimated_delivery_at && (
              <div className="rounded-2xl bg-[#FFF8E4] p-4 text-center ring-1 ring-[#F4CFC8]">
                <p className="text-xs text-[#7A6262]">Estimated</p>
                <p className="text-lg font-extrabold text-[#1D3C42]">
                  {new Date(order.estimated_delivery_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </p>
                {order.preferred_delivery_slot && <p className="text-xs text-[#7A6262]">Slot: {order.preferred_delivery_slot}</p>}
              </div>
            )}
          </div>

          {/* Delivery provider info */}
          {order.delivery_provider_name && (
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-center ring-1 ring-blue-200">
              <Truck size={18} className="mx-auto text-blue-600" />
              <p className="mt-1 text-sm font-bold text-blue-700">{order.delivery_provider_name}</p>
              {order.delivery_partner_phone && <p className="text-xs text-blue-600">{order.delivery_partner_phone}</p>}
              {order.delivery_tracking_url && (
                <a href={order.delivery_tracking_url} target="_blank" className="mt-1 inline-block text-xs font-bold text-blue-700 underline">Track delivery</a>
              )}
            </div>
          )}

          {/* Courier info */}
          {order.delivery_mode === "courier" && (
            <div className="mt-4 rounded-2xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
              <Package size={18} className="mx-auto text-indigo-600" />
              {order.courier_company ? (
                <>
                  <p className="mt-1 text-center text-sm font-bold text-indigo-700">{order.courier_company}</p>
                  <p className="text-center text-xs text-indigo-600">{order.courier_tracking_number}</p>
                  {order.courier_tracking_url && (
                    <p className="text-center"><a href={order.courier_tracking_url} target="_blank" className="mt-1 inline-block text-xs font-bold text-indigo-700 underline">Track courier</a></p>
                  )}
                </>
              ) : (
                <p className="mt-1 text-center text-sm text-indigo-600">Courier details will be added once dispatched.</p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-indigo-200 pt-3 text-sm">
                <span className="text-indigo-700">Courier charge</span>
                <span className="font-extrabold text-indigo-700">
                  {order.courier_charge ? `₹${order.courier_charge}` : "Pending confirmation"}
                </span>
              </div>
              {order.courier_notes && (
                <p className="mt-2 text-xs text-indigo-600">{order.courier_notes}</p>
              )}
            </div>
          )}

          {/* Address section */}
          <div className="mt-8 grid gap-6 border-t border-[#F4CFC8] pt-8 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                <MapPin size={14} /> {mode === "pickup" ? "Pickup at bakery" : "Delivery"}
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-[#7A6262]">{order.customer_phone}</p>
                {mode !== "pickup" && order.address_line_1 && (
                  <p className="text-[#7A6262]">
                    {order.address_line_1}{order.address_line_2 ? `, ${order.address_line_2}` : ""}
                    {order.city ? `, ${order.city}` : ""}{order.pincode ? ` - ${order.pincode}` : ""}
                  </p>
                )}
              </div>
              {mode !== "pickup" && order.delivery_mode === "courier" && order.receiver_name && (
                <div className="mt-4 rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-200">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">Receiver</p>
                  <p className="mt-1 text-sm font-semibold">{order.receiver_name} · {order.receiver_phone}</p>
                  {order.full_courier_address && <p className="text-xs text-[#7A6262]">{order.full_courier_address}</p>}
                </div>
              )}
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]"><Clock size={14} /> Schedule</h3>
              <div className="mt-3 space-y-1 text-sm">
                {order.preferred_delivery_date && <p className="text-[#7A6262]">Date: <span className="font-semibold text-[#3A2A2A]">{new Date(order.preferred_delivery_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></p>}
                {order.preferred_delivery_slot && <p className="text-[#7A6262]">Slot: <span className="font-semibold text-[#3A2A2A]">{order.preferred_delivery_slot}</span></p>}
                {order.pickup_date && <p className="text-[#7A6262]">Pickup date: <span className="font-semibold text-[#3A2A2A]">{new Date(order.pickup_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></p>}
                <p className="text-xs text-[#7A6262]">Ordered: {new Date(order.created_at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#F4CFC8] pt-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]"><Package size={14} /> Items</h3>
            <div className="mt-4 space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#FFF8E4] px-5 py-3">
                  <div>
                    <p className="font-semibold text-[#3A2A2A]">{item.item_name}</p>
                    {item.quantity_label && <p className="text-xs text-[#7A6262]">{item.quantity_label}{item.egg_option ? ` · ${item.egg_option}` : ""}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(item.line_total)}</p>
                    <p className="text-xs text-[#7A6262]">₹{Number(item.unit_price)} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-[#F4CFC8] pt-5">
              <div className="flex justify-between text-sm text-[#7A6262]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              {(order.delivery_fee ?? 0) > 0 && <div className="flex justify-between text-sm text-[#7A6262]"><span>{mode === "courier" ? "Courier charge" : "Delivery"}</span><span>₹{order.delivery_fee}</span></div>}
              {mode === "courier" && !order.courier_charge && <div className="flex justify-between text-sm text-[#7A6262]"><span>Courier charge</span><span className="italic">Pending</span></div>}
              <div className="flex justify-between text-xl font-extrabold text-[#1D3C42]"><span>Total</span><span>₹{order.total}</span></div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#7A6262]">Questions? <a href={`https://wa.me/919488407130?text=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}`)}`} target="_blank" className="font-bold text-[#1D3C42] underline">WhatsApp</a></p>
            <p className="mt-1 text-[10px] text-[#7A6262]">Auto-updates every 15 seconds</p>
          </div>
        </div>
      </section>
    </main>
  );
}

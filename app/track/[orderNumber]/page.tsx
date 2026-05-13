"use client";

import { useEffect, useState, startTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, MapPin, Clock, Package, Truck, X, CheckCircle } from "lucide-react";
import { getOrderByNumber, cancelOrderByUser } from "../../../lib/supabase/orders";
import type { Order, OrderStatus, DeliveryMode } from "../../../types/menu";
import { ORDER_STATUS_LABELS, getStatusFlow, STATUS_COLORS } from "../../../types/menu";

const statusIcons: Record<string, string> = {
  order_received: "📥",
  baker_confirmed: "✅",
  ready_for_pickup: "📦",
  picked_up: "✅📦",
  out_for_delivery: "🚚",
  courier_booked: "📦🚚",
  delivered: "🎉",
  date_change_requested: "📅",
  cancelled: "❌",
  refund_initiated: "💰",
  refunded: "✅💰",
};

function Stamp({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{
        transform: "rotate(-12deg)",
        bottom: "18%",
        right: "6%",
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

export default function TrackPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;
    async function load() {
      const data = await getOrderByNumber(orderNumber);
      if (cancelled) return;
      startTransition(() => {
        if (data) setOrder(data); else setError(true);
        setLoading(false);
      });
    }
    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderNumber]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const status = order?.status as OrderStatus | undefined;
  const mode = order?.delivery_mode as DeliveryMode | undefined;
  const flow = mode ? getStatusFlow(mode) : [];
  const statusIndex = status ? flow.indexOf(status) : -1;
  const showFlow = statusIndex >= 0;
  const isTerminal = status && !flow.includes(status);
  const canCancel = status && ["order_received", "baker_confirmed"].includes(status);

  const handleCancel = async () => {
    if (!order) return;
    setActionLoading(true);
    await cancelOrderByUser(order.id, cancelReason || "No reason provided");
    setShowCancelModal(false);
    const data = await getOrderByNumber(order.order_number);
    if (data) setOrder(data);
    setActionLoading(false);
  };

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

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const orderTime = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const isPaid = order.payment_status === "paid" || order.payment_status === "completed";

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="mx-auto max-w-lg px-4 py-8">
        {/* Receipt card */}
        <div className="relative mx-auto max-w-sm rounded-[2rem] border-2 border-dashed border-[#D4AF37]/40 bg-white px-6 pb-6 pt-8 shadow-xl ring-1 ring-[#F4CFC8]">
          {/* Stamps */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            {isPaid && <Stamp label="PAID" color="#16A34A" />}
          </div>

          {/* Top perforation */}
          <div className="absolute left-0 right-0 top-0 flex justify-between px-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-3 w-1 rounded-full bg-[#FFF8E4]" />
            ))}
          </div>

          {/* Store header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D3C42]">
              <CheckCircle size={28} className="text-white" />
            </div>
            <h1 className="mt-3 font-display text-lg font-extrabold text-[#1D3C42]">{order.order_number}</h1>
            <p className="mt-0.5 text-xs text-[#7A6262]">{order.customer_name}</p>
            {mode && (
              <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                mode === "pickup" ? "bg-teal-100 text-teal-700" : mode === "courier" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
              }`}>
                {mode === "pickup" ? "Pickup" : mode === "courier" ? "Courier" : "Local Delivery"}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mt-4 border-t border-dashed border-[#D4AF37]/40" />

          {/* Status */}
          {status && (
            <div className="mt-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Current status</p>
              <div
                className={`mt-2 inline-block rounded-xl px-5 py-2 text-base font-extrabold ring-1 ${STATUS_COLORS[status] || "bg-[#FFF8E4] text-[#1D3C42] ring-[#F4CFC8]"}`}
              >
                {statusIcons[status]} {ORDER_STATUS_LABELS[status] || status}
              </div>
            </div>
          )}

          {showFlow && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                {flow.map((step, index) => {
                  const isActive = index <= statusIndex;
                  const isLast = index === flow.length - 1;
                  return (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`grid h-8 w-8 place-items-center rounded-full text-sm transition ${
                          isActive ? "bg-[#1D3C42] text-white shadow-sm" : "bg-[#FFF8E4] text-[#7A6262]"
                        }`}>{statusIcons[step]}</div>
                        <p className={`mt-1 max-w-14 text-center text-[10px] font-bold leading-tight ${
                          isActive ? "text-[#1D3C42]" : "text-[#7A6262]"
                        }`}>{ORDER_STATUS_LABELS[step]}</p>
                      </div>
                      {!isLast && <div className={`mx-1 h-0.5 w-4 sm:mx-2 sm:w-8 ${index < statusIndex ? "bg-[#1D3C42]" : "bg-[#F4CFC8]"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isTerminal && (
            <div className={`mt-3 rounded-xl p-3 text-center text-sm font-semibold ring-1 ${
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

          {/* Divider */}
          <div className="mt-4 border-t border-dashed border-[#D4AF37]/40" />

          {/* Info cards — stacked */}
          {(() => {
            const hasDeliveryFee = (order.delivery_fee ?? 0) > 0;
            const hasEstDelivery = !!order.estimated_delivery_at;
            if (hasDeliveryFee && hasEstDelivery) {
              return (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#FFF8E4] p-4 ring-2 ring-[#D4AF37]/30">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Delivery fee</p>
                      {order.delivery_fee_status === "estimated" && <p className="text-[10px] text-[#7A6262]">Estimated</p>}
                    </div>
                    <p className="font-mono text-lg font-extrabold text-[#1D3C42]">₹{order.delivery_fee}</p>
                  </div>
                  <div className="rounded-xl bg-[#FFF8E4] p-4 text-center ring-2 ring-[#D4AF37]/30">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">Estimated Delivery</p>
                    <p className="mt-1 font-mono text-lg font-extrabold text-[#1D3C42]">
                      {new Date(order.estimated_delivery_at).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    {order.preferred_delivery_slot && <p className="mt-0.5 text-sm text-[#7A6262]">Slot: {order.preferred_delivery_slot}</p>}
                  </div>
                </div>
              );
            }
            if (hasDeliveryFee) {
              return (
                <div className="mt-4 rounded-xl bg-[#FFF8E4] p-4 ring-2 ring-[#D4AF37]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Delivery fee</p>
                      {order.delivery_fee_status === "estimated" && <p className="text-[10px] text-[#7A6262]">Estimated</p>}
                    </div>
                    <p className="font-mono text-lg font-extrabold text-[#1D3C42]">₹{order.delivery_fee}</p>
                  </div>
                </div>
              );
            }
            if (hasEstDelivery) {
              return (
                <div className="mt-4 rounded-xl bg-[#FFF8E4] p-4 text-center ring-2 ring-[#D4AF37]/30">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">Estimated Delivery</p>
                  <p className="mt-1 font-mono text-lg font-extrabold text-[#1D3C42]">
                    {new Date(order.estimated_delivery_at).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  {order.preferred_delivery_slot && <p className="mt-0.5 text-sm text-[#7A6262]">Slot: {order.preferred_delivery_slot}</p>}
                </div>
              );
            }
            return null;
          })()}

          {/* Delivery provider */}
          {order.delivery_provider_name && (
            <div className="mt-3 rounded-xl bg-blue-50 p-4 text-center ring-1 ring-blue-200">
              <Truck size={20} className="mx-auto text-blue-600" />
              <p className="mt-1 text-sm font-bold text-blue-700">{order.delivery_provider_name}</p>
              {order.delivery_partner_phone && <p className="text-xs text-blue-600">{order.delivery_partner_phone}</p>}
              {order.delivery_tracking_url && (
                <a
                  href={order.delivery_tracking_url}
                  target="_blank"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Track delivery <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Courier info */}
          {order.delivery_mode === "courier" && (
            <div className="mt-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
              <Package size={20} className="mx-auto text-indigo-600" />
              {order.courier_company ? (
                <>
                  <p className="mt-1 text-center text-sm font-bold text-indigo-700">{order.courier_company}</p>
                  <p className="text-center text-xs text-indigo-600">{order.courier_tracking_number}</p>
                  {order.courier_tracking_url && (
                    <div className="mt-2 text-center">
                      <a
                        href={order.courier_tracking_url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                      >
                        Track courier <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-1 text-center text-xs text-indigo-600">Courier details will be added once dispatched.</p>
              )}
              {(order.courier_charge ?? 0) > 0 && (
                <div className="mt-3 flex items-center justify-between border-t border-indigo-200 pt-3 text-sm">
                  <span className="text-indigo-700">Courier charge</span>
                  <span className="font-extrabold text-indigo-700">₹{order.courier_charge}</span>
                </div>
              )}
              {order.courier_notes && <p className="mt-2 text-xs text-indigo-600">{order.courier_notes}</p>}
            </div>
          )}

          {/* Divider */}
          <div className="mt-4 border-t border-dashed border-[#D4AF37]/40" />

          {/* Address & Schedule */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                <MapPin size={14} /> {mode === "pickup" ? "Pickup" : "Delivery"}
              </h3>
              <div className="mt-2 space-y-0.5 text-sm">
                <p className="font-semibold text-[#3A2A2A]">{order.customer_name}</p>
                <p className="text-[#7A6262]">{order.customer_phone}</p>
                {mode !== "pickup" && order.address_line_1 && (
                  <p className="text-[#7A6262] leading-relaxed">
                    {order.address_line_1}{order.address_line_2 ? `, ${order.address_line_2}` : ""}
                    {order.city ? `, ${order.city}` : ""}{order.pincode ? ` - ${order.pincode}` : ""}
                  </p>
                )}
              </div>
              {mode !== "pickup" && order.delivery_mode === "courier" && order.receiver_name && (
                <div className="mt-2 rounded-xl bg-orange-50 p-2 ring-1 ring-orange-200">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Receiver</p>
                  <p className="text-sm font-semibold">{order.receiver_name} · {order.receiver_phone}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                <Clock size={14} /> Schedule
              </h3>
              <div className="mt-2 space-y-0.5 text-sm">
                {order.preferred_delivery_date && <p className="text-[#7A6262]">Date: <span className="font-semibold text-[#3A2A2A]">{new Date(order.preferred_delivery_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span></p>}
                {order.preferred_delivery_slot && <p className="text-[#7A6262]">Slot: <span className="font-semibold text-[#3A2A2A]">{order.preferred_delivery_slot}</span></p>}
                {order.pickup_date && <p className="text-[#7A6262]">Pickup: <span className="font-semibold text-[#3A2A2A]">{new Date(order.pickup_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span></p>}
              </div>
            </div>
          </div>

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
            {mode === "courier" && !order.courier_charge && (
              <div className="flex justify-between font-mono text-sm text-[#7A6262]">
                <span>Courier charge</span><span className="italic">Pending</span>
              </div>
            )}
            <div className="flex justify-between font-mono text-xl font-extrabold text-[#1D3C42]">
              <span>Total</span><span>₹{order.total}</span>
            </div>
            <div className="flex justify-between font-mono text-xs text-[#7A6262]">
              <span>Payment</span>
              <span className={isPaid ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                {isPaid ? "Paid" : order.payment_status === "refunded" ? "Refunded" : "Pending"}
              </span>
            </div>
          </div>

          {/* Bottom tear */}
          <div className="mt-5 border-t-2 border-dashed border-[#D4AF37]/30 pt-3 text-center">
            <p className="font-mono text-sm text-[#7A6262]">The Little Patisserie &middot; Chennai</p>
            <p className="mt-0.5 font-mono text-xs text-[#D4AF37]/60">
              Ordered {orderDate} &middot; {orderTime}
            </p>
          </div>

          {/* Bottom perforation */}
          <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-3 w-1 rounded-full bg-[#FFF8E4]" />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-4 text-center">
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-600 shadow-sm transition hover:border-red-400 hover:bg-red-100"
            >
              <X size={16} /> Cancel Order
            </button>
          )}
          <div className="space-y-1">
            <a
              href={`https://wa.me/919488407130?text=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}`)}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1D3C42] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#163136]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp us
            </a>
            <p className="text-[10px] text-[#D4AF37]/60">Auto-updates every 15 seconds</p>
          </div>
        </div>
      </section>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowCancelModal(false)}>
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-red-600">Cancel Order</h3>
              <button onClick={() => setShowCancelModal(false)}><X size={20} /></button>
            </div>
            <p className="mt-2 text-sm text-[#7A6262]">Are you sure you want to cancel <strong>{order.order_number}</strong>? This action cannot be undone.</p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Reason (optional)</label>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Tell us why you're cancelling..." />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold text-[#7A6262]">Keep Order</button>
              <button onClick={handleCancel} disabled={actionLoading} className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                {actionLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";
import { getOrders, updateOrderStatus, updateBakerNotes, updateDeliveryFee, updateDeliveryInfo, updateCourierInfo, subscribeToOrders } from "../../../lib/supabase/orders";
import type { Order, OrderItem, OrderStatus } from "../../../types/menu";
import { ORDER_STATUS_LABELS, STATUS_COLORS, getNextStatuses } from "../../../types/menu";
import Link from "next/link";
import { Clock, X, FileText, Truck, DollarSign, Package } from "lucide-react";
import { playNotificationSound, playAlertSound, initAudioOnUserGesture } from "../../../lib/notification-sound";

type FilterTab = "new" | "pickup" | "local" | "courier" | "completed" | "cancelled";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "new", label: "New Orders" },
  { key: "pickup", label: "Pickup" },
  { key: "local", label: "Local Delivery" },
  { key: "courier", label: "Courier" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function filterOrders(orders: Order[], tab: FilterTab): Order[] {
  switch (tab) {
    case "new": return orders.filter((o) => o.status === "order_received");
    case "pickup": return orders.filter((o) => o.delivery_mode === "pickup" && !["picked_up", "cancelled", "refunded"].includes(o.status));
    case "local": return orders.filter((o) => o.delivery_mode === "local_delivery" && !["delivered", "cancelled", "refunded"].includes(o.status));
    case "courier": return orders.filter((o) => o.delivery_mode === "courier" && !["delivered", "cancelled", "refunded"].includes(o.status));
    case "completed": return orders.filter((o) => ["delivered", "picked_up", "refunded"].includes(o.status));
    case "cancelled": return orders.filter((o) => ["cancelled", "refund_initiated", "date_change_requested"].includes(o.status));
    default: return orders;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("new");
  const [notification, setNotification] = useState<string | null>(null);

  // modals
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [feeValue, setFeeValue] = useState(0);
  const [deliveryModal, setDeliveryModal] = useState<Order | null>(null);
  const [courierModal, setCourierModal] = useState<Order | null>(null);

  const [dProvider, setDProvider] = useState("");
  const [dPhone, setDPhone] = useState("");
  const [dUrl, setDUrl] = useState("");
  const [dNotes, setDNotes] = useState("");

  const [cCompany, setCCompany] = useState("");
  const [cTracking, setCTracking] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cCharge, setCCharge] = useState(0);
  const [cNotes, setCNotes] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
    document.addEventListener("click", initAudioOnUserGesture, { once: true });

    const newSub = subscribeToOrders((newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setNotification(`New order: ${newOrder.order_number}`);
      playNotificationSound();
      setTimeout(() => setNotification(null), 5000);
    });

    const updateSub = supabase
      .channel("orders-updates")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const updated = payload.new as Order;
        const changedStatus = updated.status;
        if (changedStatus === "cancelled" || changedStatus === "date_change_requested") {
          setOrders((prev) => prev.map((o) => o.id === updated.id ? { ...o, ...updated } : o));
          setNotification(`${changedStatus === "cancelled" ? "Cancellation" : "Date change"} for ${updated.order_number}`);
          playAlertSound();
          setTimeout(() => setNotification(null), 5000);
        }
      })
      .subscribe();

    return () => { newSub.unsubscribe(); updateSub.unsubscribe(); };
  }, []);

  const handleStatus = async (id: string, status: OrderStatus) => {
    const ok = await updateOrderStatus(id, status);
    if (!ok) return;
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const openDeliveryModal = (order: Order) => {
    setDeliveryModal(order);
    setDProvider(order.delivery_provider_name || "");
    setDPhone(order.delivery_partner_phone || "");
    setDUrl(order.delivery_tracking_url || "");
    setDNotes(order.delivery_notes || "");
  };

  const saveDeliveryInfo = async () => {
    if (!deliveryModal) return;
    await updateDeliveryInfo(deliveryModal.id, {
      provider_name: dProvider, partner_phone: dPhone,
      tracking_url: dUrl, notes: dNotes,
    });
    setOrders((prev) => prev.map((o) => o.id === deliveryModal.id ? {
      ...o, delivery_provider_name: dProvider, delivery_partner_phone: dPhone,
      delivery_tracking_url: dUrl, delivery_notes: dNotes,
    } : o));
    await handleStatus(deliveryModal.id, "out_for_delivery");
    setDeliveryModal(null);
  };

  const openCourierModal = (order: Order) => {
    setCourierModal(order);
    setCCompany(order.courier_company || "");
    setCTracking(order.courier_tracking_number || "");
    setCUrl(order.courier_tracking_url || "");
    setCCharge(order.courier_charge ?? 0);
    setCNotes(order.courier_notes || "");
  };

  const saveCourierInfo = async () => {
    if (!courierModal) return;
    await updateCourierInfo(courierModal.id, {
      company: cCompany, tracking_number: cTracking,
      tracking_url: cUrl, charge: cCharge, notes: cNotes,
    });
    setOrders((prev) => prev.map((o) => o.id === courierModal.id ? {
      ...o, courier_company: cCompany, courier_tracking_number: cTracking,
      courier_tracking_url: cUrl, courier_charge: cCharge, courier_notes: cNotes,
      delivery_fee: cCharge, delivery_fee_status: cCharge > 0 ? "confirmed" : "pending_confirmation",
      total: o.subtotal + cCharge,
    } : o));
    await handleStatus(courierModal.id, "courier_booked");
    setCourierModal(null);
  };

  const filtered = filterOrders(orders, tab);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      {notification && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-[#1D3C42] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20">🛎️ {notification}</div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#1D3C42]">Baker&apos;s dashboard</h1>
            <p className="text-xs text-[#7A6262]">{orders.length} total · {orders.filter((o) => o.status === "order_received").length} new</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full bg-[#1D3C42] px-5 py-2 text-sm font-semibold text-white">View site</Link>
            {/* <button onClick={() => { fetch("/api/admin/logout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; }); }} className="rounded-full border border-[#F4CFC8] bg-white px-4 py-2 text-xs font-semibold text-[#7A6262] hover:text-red-500">Logout</button> */}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTER_TABS.map((t) => {
            const count = t.key === "new" ? orders.filter((o) => o.status === "order_received").length : 0;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-sm transition-all ${
                  tab === t.key ? "bg-[#1D3C42] text-white shadow-md" : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8] hover:bg-[#FFF8E4] hover:shadow-sm"
                }`}>
                {t.key === "new" && count > 0 && (
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                )}
                {t.label}
                {count > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#F4CFC8]"><p className="font-semibold text-[#1D3C42]">Loading orders...</p></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#F4CFC8]"><p className="font-semibold text-[#7A6262]">No orders in this section</p></div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((order) => {
              const nextStatuses = getNextStatuses(order.status as OrderStatus, order.delivery_mode);
              return (
                <div key={order.id} className={`rounded-[2rem] bg-white p-6 shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                  order.status === "order_received" ? "ring-2 ring-amber-300" : "ring-[#F4CFC8]"
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xl font-extrabold text-[#1D3C42]">{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold ring-1 ${STATUS_COLORS[order.status] || ""}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            order.status === "order_received" ? "bg-amber-500" :
                            order.status === "cancelled" ? "bg-red-500" :
                            ["delivered", "picked_up", "refunded"].includes(order.status) ? "bg-green-500" : "bg-blue-500"
                          }`} />
                          {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold ring-1 ${
                          order.delivery_mode === "pickup" ? "bg-green-100 text-green-800 ring-green-300" :
                          order.delivery_mode === "courier" ? "bg-orange-100 text-orange-800 ring-orange-300" :
                          "bg-blue-100 text-blue-800 ring-blue-300"
                        }`}>
                          {order.delivery_mode === "pickup" ? "Pickup" : order.delivery_mode === "courier" ? "Courier" : "Local Delivery"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-x-8 gap-y-2 md:grid-cols-2">
                        <div>
                          <p className="text-base font-bold text-[#1D3C42]">{order.customer_name}</p>
                          <p className="text-sm text-[#7A6262]">{order.customer_phone}{order.customer_email ? ` · ${order.customer_email}` : ""}</p>
                        </div>
                        <div className="text-sm text-[#7A6262]">
                          <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(order.created_at).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {order.delivery_mode !== "pickup" && (
                        <div className="mt-4 rounded-2xl bg-[#FFF8E4] p-4 text-sm leading-6 text-[#7A6262]">
                          <p className="mb-1 text-sm font-extrabold text-[#1D3C42]">Delivery address</p>
                          <p className="text-[#3A2A2A]">{order.address_line_1}{order.address_line_2 ? `, ${order.address_line_2}` : ""}</p>
                          <p className="text-[#3A2A2A]">{order.city}{order.district ? `, ${order.district}` : ""}{order.state ? `, ${order.state}` : ""} · {order.pincode}</p>
                          {order.landmark && <p className="mt-1 font-medium text-[#7A6262]">📍 {order.landmark}</p>}
                          {order.preferred_delivery_date && <p className="mt-2 flex items-center gap-1.5 text-[#7A6262]"><Clock size={13} />{new Date(order.preferred_delivery_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}{order.preferred_delivery_slot ? ` · ${order.preferred_delivery_slot}` : ""}</p>}
                        </div>
                      )}

                      {order.delivery_mode === "courier" && (order.receiver_name || order.full_courier_address) && (
                        <div className="mt-3 rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-[#7A6262]">
                          <p className="mb-1 text-sm font-extrabold text-orange-800">Courier receiver</p>
                          <p className="font-semibold text-orange-900">{order.receiver_name}{order.receiver_phone ? ` · ${order.receiver_phone}` : ""}</p>
                          {order.alternate_phone && <p className="text-orange-700">Alt: {order.alternate_phone}</p>}
                          <p className="mt-1 text-[#3A2A2A]">{order.full_courier_address}</p>
                          {order.courier_notes && <p className="mt-2 italic text-orange-700">📝 {order.courier_notes}</p>}
                        </div>
                      )}

                      {order.items && order.items.length > 0 && (
                        <div className="mt-5">
                          <p className="mb-3 text-sm font-extrabold text-[#1D3C42]">Items ({order.items.reduce((s: number, i: OrderItem) => s + i.quantity, 0)})</p>
                          <div className="divide-y divide-[#F4CFC8] rounded-2xl border border-[#F4CFC8] bg-white">
                            {order.items.map((item: OrderItem, i: number) => (
                              <div key={item.id || i} className="flex items-center gap-4 px-5 py-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D3C42] text-sm font-extrabold text-white">
                                  ×{item.quantity}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-base font-bold text-[#1D3C42]">{item.item_name}</p>
                                  {item.selected_options && (
                                    <p className="mt-0.5 text-sm text-[#7A6262]">{item.selected_options}</p>
                                  )}
                                </div>
                                <span className="shrink-0 text-base font-extrabold text-[#D4AF37]">₹{item.line_total}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.notes && <p className="mt-3 text-sm text-[#7A6262]">📝 Order note: {order.notes}</p>}
                      {order.baker_notes && <p className="mt-1.5 text-sm text-[#1D3C42]">📝 Baker: {order.baker_notes}</p>}
                    </div>

                    <div className="shrink-0 rounded-2xl bg-[#FFF8E4] p-5 text-right">
                      <p className="text-2xl font-extrabold text-[#1D3C42]">₹{order.total}</p>
                      <p className="mt-1 text-sm text-[#7A6262]">Subtotal ₹{order.subtotal}</p>
                      {(order.delivery_fee ?? 0) > 0 && <p className="text-sm text-[#7A6262]">Delivery ₹{order.delivery_fee}</p>}
                      {(order.fragile_surcharge ?? 0) > 0 && <p className="text-sm font-semibold text-purple-600">Fragile +₹{order.fragile_surcharge}</p>}
                      <button onClick={() => { setEditingFee(order.id); setFeeValue(order.delivery_fee ?? 0); }} className="mt-2 text-xs font-bold text-[#D4AF37] underline transition hover:text-[#1D3C42]">Edit fee</button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#F4CFC8] pt-5">
                    {nextStatuses.map((s) => (
                      <button key={s} onClick={() => {
                        if (order.delivery_mode === "local_delivery" && s === "out_for_delivery") { openDeliveryModal(order); return; }
                        if (order.delivery_mode === "courier" && s === "courier_booked") { openCourierModal(order); return; }
                        handleStatus(order.id, s);
                      }} className="rounded-full bg-[#1D3C42] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#163136] hover:shadow-md">
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    ))}
                    <button onClick={() => { setEditingNotes(order.id); setNotesValue(order.baker_notes || ""); }} className="flex items-center gap-1.5 rounded-full bg-[#FFF8E4] px-5 py-2.5 text-sm font-bold text-[#7A6262] ring-1 ring-[#F4CFC8] transition hover:bg-[#FADCD4]">
                      <FileText size={15} /> Notes
                    </button>
                  </div>

                  {(order.delivery_provider_name || order.courier_company) && (
                    <div className="mt-4 rounded-2xl bg-[#FFF8E4] p-4 text-sm leading-6">
                      {order.delivery_provider_name && <p className="font-medium text-[#1D3C42]">🚚 {order.delivery_provider_name}{order.delivery_partner_phone ? ` · ${order.delivery_partner_phone}` : ""}{order.delivery_tracking_url ? <> · <a href={order.delivery_tracking_url} target="_blank" rel="noopener noreferrer" className="font-bold underline text-[#D4AF37]">Track</a></> : ""}</p>}
                      {order.courier_company && <p className="mt-1 font-medium text-[#1D3C42]">📦 {order.courier_company} · {order.courier_tracking_number || "—"}{order.courier_tracking_url ? <> · <a href={order.courier_tracking_url} target="_blank" rel="noopener noreferrer" className="font-bold underline text-[#D4AF37]">Track</a></> : ""}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Baker notes modal */}
      {editingNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditingNotes(null)}>
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#1D3C42]">Baker notes</h3><button onClick={() => setEditingNotes(null)}><X size={20} /></button></div>
            <textarea value={notesValue} onChange={(e) => setNotesValue(e.target.value)} className="mt-4 min-h-28 w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Internal notes..." />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditingNotes(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={async () => { await updateBakerNotes(editingNotes, notesValue); setOrders((prev) => prev.map((o) => o.id === editingNotes ? { ...o, baker_notes: notesValue } : o)); setEditingNotes(null); }} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery fee modal */}
      {editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditingFee(null)}>
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#1D3C42]">Update delivery fee</h3><button onClick={() => setEditingFee(null)}><X size={20} /></button></div>
            <div className="mt-4 flex items-center gap-2"><DollarSign size={18} /><input type="number" value={feeValue} onChange={(e) => setFeeValue(Number(e.target.value))} className="flex-1 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-lg font-extrabold outline-none focus:border-[#1D3C42]" /></div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditingFee(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={async () => { await updateDeliveryFee(editingFee, feeValue); setOrders((prev) => prev.map((o) => o.id === editingFee ? { ...o, delivery_fee: feeValue, delivery_fee_status: "manual", total: o.subtotal + feeValue } : o)); setEditingFee(null); }} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery provider modal */}
      {deliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setDeliveryModal(null)}>
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#1D3C42]"><Truck size={18} className="mr-1 inline" /> Book delivery</h3><button onClick={() => setDeliveryModal(null)}><X size={20} /></button></div>
            <p className="mt-2 text-sm text-[#7A6262]">Enter delivery provider details. Status will be set to Out for Delivery.</p>
            <div className="mt-4 grid gap-3">
              <input value={dProvider} onChange={(e) => setDProvider(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Provider/app name *" />
              <input value={dPhone} onChange={(e) => setDPhone(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Delivery partner contact (optional)" />
              <input value={dUrl} onChange={(e) => setDUrl(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Tracking URL *" />
              <textarea value={dNotes} onChange={(e) => setDNotes(e.target.value)} className="min-h-16 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Delivery notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setDeliveryModal(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveDeliveryInfo} disabled={!dProvider || !dUrl} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50">Mark Out for Delivery</button>
            </div>
          </div>
        </div>
      )}

      {/* Courier modal */}
      {courierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setCourierModal(null)}>
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#1D3C42]"><Package size={18} className="mr-1 inline" /> Add courier details</h3><button onClick={() => setCourierModal(null)}><X size={20} /></button></div>
            <p className="mt-2 text-sm text-[#7A6262]">Enter courier company and tracking. Status will be set to Courier Booked.</p>
            <div className="mt-4 grid gap-3">
              <input value={cCompany} onChange={(e) => setCCompany(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Courier company name *" />
              <input value={cTracking} onChange={(e) => setCTracking(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Tracking number *" />
              <input value={cUrl} onChange={(e) => setCUrl(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Tracking URL *" />
              <div className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A6262]">Courier charge (₹)</label>
                <input value={cCharge} onChange={(e) => setCCharge(Number(e.target.value))} type="number" className="mt-1 w-full text-lg font-extrabold outline-none" placeholder="0" />
              </div>
              <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} className="min-h-16 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Courier notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setCourierModal(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveCourierInfo} disabled={!cCompany || !cTracking || !cUrl} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50">Mark Courier Booked</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

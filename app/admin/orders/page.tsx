"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, updateBakerNotes, updateDeliveryFee, updateDeliveryInfo, updateCourierInfo, subscribeToOrders } from "../../../lib/supabase/orders";
import type { Order, OrderStatus } from "../../../types/menu";
import { ORDER_STATUS_LABELS, STATUS_COLORS, getNextStatuses } from "../../../types/menu";
import { Clock, X, FileText, Truck, MessageCircle, DollarSign, Package } from "lucide-react";
import { playNotificationSound, initAudioOnUserGesture } from "../../../lib/notification-sound";

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
    const sub = subscribeToOrders((newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setNotification(`New order: ${newOrder.order_number}`);
      playNotificationSound();
      setTimeout(() => setNotification(null), 5000);
    });
    return () => { sub.unsubscribe(); };
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
            <a href="/" className="rounded-full bg-[#1D3C42] px-5 py-2 text-sm font-semibold text-white">View site</a>
            <button onClick={() => { fetch("/api/admin/logout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; }); }} className="rounded-full border border-[#F4CFC8] bg-white px-4 py-2 text-xs font-semibold text-[#7A6262] hover:text-red-500">Logout</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTER_TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative rounded-full px-4 py-2 text-xs font-bold transition ${
                tab === t.key ? "bg-[#1D3C42] text-white" : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8] hover:bg-[#FFF8E4]"
              }`}>
              {t.label}
              {t.key === "new" && orders.filter((o) => o.status === "order_received").length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {orders.filter((o) => o.status === "order_received").length}
                </span>
              )}
            </button>
          ))}
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
                <div key={order.id} className={`rounded-[2rem] bg-white p-5 shadow-sm ring-1 transition hover:shadow-md ${
                  order.status === "order_received" ? "ring-2 ring-amber-300" : "ring-[#F4CFC8]"
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-extrabold text-[#1D3C42]">{order.order_number}</span>
                        <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold ring-1 ${STATUS_COLORS[order.status] || ""}`}>
                          {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                        </span>
                        <span className="rounded-full bg-[#FFF8E4] px-3 py-0.5 text-[10px] font-bold text-[#7A6262] ring-1 ring-[#F4CFC8]">
                          {order.delivery_mode === "pickup" ? "Pickup" : order.delivery_mode === "courier" ? "Courier" : "Local Delivery"}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-x-8 gap-y-1.5 text-sm md:grid-cols-2">
                        <div>
                          <p className="font-semibold text-[#1D3C42]">{order.customer_name}</p>
                          <p className="text-[#7A6262]">{order.customer_phone}{order.customer_email ? ` · ${order.customer_email}` : ""}</p>
                        </div>
                        <div className="text-xs text-[#7A6262]">
                          <span className="flex items-center gap-1"><Clock size={11} />{new Date(order.created_at).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {order.delivery_mode !== "pickup" && (
                        <div className="mt-3 rounded-2xl bg-[#FFF8E4] p-3 text-xs leading-5 text-[#7A6262]">
                          <p className="font-semibold text-[#1D3C42]">Delivery address</p>
                          <p>{order.address_line_1}{order.address_line_2 ? `, ${order.address_line_2}` : ""}</p>
                          <p>{order.city}{order.district ? `, ${order.district}` : ""}{order.state ? `, ${order.state}` : ""} · {order.pincode}</p>
                          {order.landmark && <p>Landmark: {order.landmark}</p>}
                          {order.preferred_delivery_date && <p>Date: {new Date(order.preferred_delivery_date).toLocaleDateString("en-IN")}{order.preferred_delivery_slot ? ` · ${order.preferred_delivery_slot}` : ""}</p>}
                        </div>
                      )}

                      {order.delivery_mode === "courier" && (order.receiver_name || order.full_courier_address) && (
                        <div className="mt-2 rounded-2xl bg-orange-50 p-3 text-xs leading-5 text-[#7A6262]">
                          <p className="font-semibold text-orange-800">Courier receiver</p>
                          <p>{order.receiver_name}{order.receiver_phone ? ` · ${order.receiver_phone}` : ""}{order.alternate_phone ? ` · Alt: ${order.alternate_phone}` : ""}</p>
                          <p>{order.full_courier_address}</p>
                          {order.courier_notes && <p className="mt-1 italic">📝 {order.courier_notes}</p>}
                        </div>
                      )}

                      {order.items && order.items.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-sm font-extrabold text-[#1D3C42]">Items</p>
                          <div className="divide-y divide-[#F4CFC8] rounded-2xl border border-[#F4CFC8] bg-white">
                            {order.items.map((item: any, i: number) => (
                              <div key={item.id || i} className="flex items-center gap-3 px-4 py-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D3C42] text-sm font-extrabold text-white">
                                  {item.quantity}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-[#1D3C42]">{item.item_name}</p>
                                  {item.selected_options && (
                                    <p className="mt-0.5 text-xs text-[#7A6262]">{item.selected_options}</p>
                                  )}
                                </div>
                                <span className="shrink-0 text-sm font-extrabold text-[#D4AF37]">₹{item.line_total}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.notes && <p className="mt-2 text-xs italic text-[#7A6262]">📝 Order note: {order.notes}</p>}
                      {order.baker_notes && <p className="mt-1 text-xs italic text-[#1D3C42]">📝 Baker: {order.baker_notes}</p>}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xl font-extrabold text-[#1D3C42]">₹{order.total}</p>
                      <p className="text-xs text-[#7A6262]">Subtotal ₹{order.subtotal}</p>
                      {(order.delivery_fee ?? 0) > 0 && <p className="text-xs text-[#7A6262]">Delivery ₹{order.delivery_fee}</p>}
                      {(order.fragile_surcharge ?? 0) > 0 && <p className="text-xs text-purple-600">Fragile +₹{order.fragile_surcharge}</p>}
                      <button onClick={() => { setEditingFee(order.id); setFeeValue(order.delivery_fee ?? 0); }} className="mt-1 text-[10px] font-bold text-[#D4AF37] underline">Edit fee</button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F4CFC8] pt-4">
                    {nextStatuses.map((s) => (
                      <button key={s} onClick={() => {
                        if (order.delivery_mode === "local_delivery" && s === "out_for_delivery") { openDeliveryModal(order); return; }
                        if (order.delivery_mode === "courier" && s === "courier_booked") { openCourierModal(order); return; }
                        handleStatus(order.id, s);
                      }} className="rounded-full bg-[#1D3C42] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#163136]">
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    ))}
                    <button onClick={() => { setEditingNotes(order.id); setNotesValue(order.baker_notes || ""); }} className="flex items-center gap-1 rounded-full bg-[#FFF8E4] px-4 py-2 text-xs font-bold text-[#7A6262] transition hover:bg-[#FADCD4]">
                      <FileText size={14} /> Notes
                    </button>
                  </div>

                  {(order.delivery_provider_name || order.courier_company) && (
                    <div className="mt-3 rounded-2xl bg-[#FFF8E4] p-3 text-xs">
                      {order.delivery_provider_name && <p>🚚 {order.delivery_provider_name}{order.delivery_partner_phone ? ` · ${order.delivery_partner_phone}` : ""}{order.delivery_tracking_url ? <> · <a href={order.delivery_tracking_url} target="_blank" rel="noopener noreferrer" className="underline">Track</a></> : ""}</p>}
                      {order.courier_company && <p>📦 {order.courier_company} · {order.courier_tracking_number || "—"}{order.courier_tracking_url ? <> · <a href={order.courier_tracking_url} target="_blank" rel="noopener noreferrer" className="underline">Track</a></> : ""}</p>}
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
              <input value={dProvider} onChange={(e) => setDProvider(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Provider/app name e.g. Uber, Porter" />
              <input value={dPhone} onChange={(e) => setDPhone(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Delivery partner contact (optional)" />
              <input value={dUrl} onChange={(e) => setDUrl(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Tracking URL (optional)" />
              <textarea value={dNotes} onChange={(e) => setDNotes(e.target.value)} className="min-h-16 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Delivery notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setDeliveryModal(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveDeliveryInfo} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white">Mark Out for Delivery</button>
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
              <input value={cUrl} onChange={(e) => setCUrl(e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Tracking URL (optional)" />
              <div className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7A6262]">Courier charge (₹)</label>
                <input value={cCharge} onChange={(e) => setCCharge(Number(e.target.value))} type="number" className="mt-1 w-full text-lg font-extrabold outline-none" placeholder="0" />
              </div>
              <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} className="min-h-16 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Courier notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setCourierModal(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveCourierInfo} className="flex-1 rounded-full bg-[#1D3C42] py-3 text-sm font-bold text-white">Mark Courier Booked</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

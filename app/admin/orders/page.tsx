"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../lib/supabase/client";
import { getOrders, updateOrderStatus, updateBakerNotes, updateDeliveryFee, updateDeliveryInfo, updateCourierInfo, subscribeToOrders } from "../../../lib/supabase/orders";
import type { Order, OrderItem, OrderStatus } from "../../../types/menu";
import { ORDER_STATUS_LABELS, STATUS_COLORS, getNextStatuses } from "../../../types/menu";
import { Clock, Search, X, FileText, Truck, DollarSign, Package, ChevronDown, Printer, MessageCircle } from "lucide-react";
import { playNotificationSound, playAlertSound, initAudioOnUserGesture } from "../../../lib/notification-sound";

const FILTER_STATUSES: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "order_received", label: "New" },
  { key: "baker_confirmed", label: "Accepted" },
  { key: "delivered", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE: Record<string, string> = {
  order_received: "bg-amber-100 text-amber-800 ring-amber-300",
  baker_confirmed: "bg-blue-100 text-blue-800 ring-blue-300",
  ready_for_pickup: "bg-yellow-100 text-yellow-800 ring-yellow-300",
  picked_up: "bg-green-100 text-green-800 ring-green-300",
  out_for_delivery: "bg-orange-100 text-orange-800 ring-orange-300",
  courier_booked: "bg-indigo-100 text-indigo-800 ring-indigo-300",
  delivered: "bg-green-100 text-green-800 ring-green-300",
  date_change_requested: "bg-purple-100 text-purple-800 ring-purple-300",
  cancelled: "bg-red-100 text-red-800 ring-red-300",
  refund_initiated: "bg-pink-100 text-pink-800 ring-pink-300",
  refunded: "bg-gray-100 text-gray-800 ring-gray-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("order_received");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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
  const [dErrors, setDErrors] = useState<Record<string, string>>({});

  const [cCompany, setCCompany] = useState("");
  const [cTracking, setCTracking] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cCharge, setCCharge] = useState(0);
  const [cNotes, setCNotes] = useState("");
  const [cErrors, setCErrors] = useState<Record<string, string>>({});

  function isValidUrl(val: string): boolean {
    try { return !!new URL(val); } catch { return false; }
  }

  function validateDelivery(): boolean {
    const e: Record<string, string> = {};
    if (!dProvider.trim()) e.provider = "Provider name is required";
    if (dPhone.trim() && !/^\d{10}$/.test(dPhone.trim())) e.phone = "Contact must be exactly 10 digits";
    if (!dUrl.trim()) e.url = "Tracking URL is required";
    else if (!isValidUrl(dUrl.trim())) e.url = "Enter a valid URL (e.g. https://...)";
    setDErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateCourier(): boolean {
    const e: Record<string, string> = {};
    if (!cCompany.trim()) e.company = "Company name is required";
    if (!cTracking.trim()) e.tracking = "Tracking number is required";
    if (!cUrl.trim()) e.url = "Tracking URL is required";
    else if (!isValidUrl(cUrl.trim())) e.url = "Enter a valid URL (e.g. https://...)";
    setCErrors(e);
    return Object.keys(e).length === 0;
  }

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
    document.addEventListener("click", initAudioOnUserGesture, { once: true });

    const newSub = subscribeToOrders(async (newOrder) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", newOrder.id);
      setOrders((prev) => [{ ...newOrder, items: items || [] }, ...prev]);
      setNotification(`New order: ${newOrder.order_number}`);
      playNotificationSound();
      setTimeout(() => setNotification(null), 5000);
    });

    const updateSub = supabase
      .channel("orders-updates")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const updated = payload.new as Order;
        const changedStatus = updated.status;
        if (changedStatus === "cancelled") {
          setOrders((prev) => prev.map((o) => o.id === updated.id ? { ...o, ...updated } : o));
          setNotification(`Cancellation for ${updated.order_number}`);
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
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setSelectedOrder((prev) => prev?.id === id ? { ...prev, status } : prev);
  };

  const openDeliveryModal = (order: Order) => {
    setDeliveryModal(order);
    setDProvider(order.delivery_provider_name || "");
    setDPhone(order.delivery_partner_phone || "");
    setDUrl(order.delivery_tracking_url || "");
    setDNotes(order.delivery_notes || "");
  };

  const saveDeliveryInfo = async () => {
    if (!deliveryModal || !validateDelivery()) return;
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
    if (!courierModal || !validateCourier()) return;
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

  const filtered = useMemo(() => {
    let result = orders;
    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q) ||
          o.order_number.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [orders, filterStatus, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Order[]> = {};
    for (const order of filtered) {
      const dateStr = order.preferred_delivery_date || order.pickup_date || order.created_at;
      const key = dateStr.split("T")[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  function getDateLabel(dateKey: string): { label: string; urgent: boolean } {
    const d = new Date(dateKey + "T00:00:00");
    const formatted = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
    if (dateKey === todayStr) return { label: `⚡ Today — ${formatted}`, urgent: true };
    if (dateKey === tomorrowStr) return { label: `⏰ Tomorrow — ${formatted}`, urgent: true };
    return { label: formatted, urgent: false };
  }

  const newCount = orders.filter((o) => o.status === "order_received").length;

  return (
    <div className="flex min-h-screen">
      {notification && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-[#1D3C42] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20">
          🛎️ {notification}
        </div>
      )}

      {/* Main orders area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-[#F4CFC8]/50 bg-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#1D3C42]">Orders</h1>
              <p className="text-sm text-[#7A6262]">{orders.length} total &middot; {newCount} new</p>
            </div>
          </div>

          {/* Search and filter */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6262]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, order ID..."
                className="w-full rounded-xl border border-[#F4CFC8] bg-[#FFF8E4] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1D3C42] focus:bg-white"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#F4CFC8] bg-white px-4 py-2.5 text-sm font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]"
              >
                {FILTER_STATUSES.find((f) => f.key === filterStatus)?.label || "All"}
                <ChevronDown size={14} />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-2xl border border-[#F4CFC8] bg-white py-2 shadow-lg">
                    {FILTER_STATUSES.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => { setFilterStatus(f.key); setFilterOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm font-bold transition hover:bg-[#FFF8E4] ${
                          filterStatus === f.key ? "text-[#1D3C42]" : "text-[#7A6262]"
                        }`}
                      >
                        {f.key !== "all" && (
                          <span className={`h-2 w-2 rounded-full ${
                            f.key === "order_received" ? "bg-amber-500" :
                            f.key === "baker_confirmed" ? "bg-blue-500" :
                            f.key === "ready_for_pickup" ? "bg-yellow-500" :
                            f.key === "delivered" ? "bg-green-500" :
                            f.key === "cancelled" ? "bg-red-500" : "bg-gray-400"
                          }`} />
                        )}
                        {f.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-[#F4CFC8]">
              <p className="font-semibold text-[#1D3C42]">Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-[#F4CFC8]">
              <p className="font-semibold text-[#7A6262]">No orders found</p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([dateKey, dateOrders]) => {
                const { label, urgent } = getDateLabel(dateKey);
                const pendingCount = dateOrders.filter((o) => o.status === "order_received" || o.status === "baker_confirmed").length;
                return (
                  <div key={dateKey}>
                    {/* Date header */}
                    <div className={`mb-4 flex items-center gap-3 ${urgent ? "sticky top-0 z-10 -mx-6 -mt-6 rounded-b-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-6 pb-4 pt-3 shadow-sm" : ""}`}>
                      <div className={`h-3 w-3 rounded-full ${urgent ? "bg-orange-400 animate-pulse" : "bg-[#D4AF37]"}`} />
                      <h2 className={`text-lg font-extrabold ${urgent ? "text-[#1D3C42]" : "text-[#7A6262]"}`}>{label}</h2>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        pendingCount > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {dateOrders.length} order{dateOrders.length > 1 ? "s" : ""}
                        {pendingCount > 0 ? ` · ${pendingCount} to bake` : ""}
                      </span>
                    </div>

                    {/* Order cards */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {dateOrders.map((order) => {
                const nextStatuses = getNextStatuses(order.status as OrderStatus, order.delivery_mode);
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected ? "ring-2 ring-[#D4AF37]" : "ring-[#F4CFC8]"
                    } ${order.status === "order_received" ? "ring-2 ring-amber-300" : ""}`}
                  >
                    {/* Top row: order ID, name, status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-[#1D3C42]">#{order.order_number.replace("ORD-", "")}</span>
                          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-bold ring-1 ${STATUS_BADGE[order.status] || "bg-gray-100 text-gray-700 ring-gray-200"}`}>
                            {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                          </span>
                        </div>
                        <p className="mt-1.5 text-base font-bold text-[#3A2A2A]">{order.customer_name}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        order.delivery_mode === "pickup" ? "bg-green-50 text-green-700 ring-1 ring-green-200" :
                        order.delivery_mode === "courier" ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200" :
                        "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      }`}>
                        {order.delivery_mode === "pickup" ? "Pickup" : order.delivery_mode === "courier" ? "Courier" : "Delivery"}
                      </span>
                    </div>

                    {/* Date and time */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#7A6262]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(order.created_at)}
                      </span>
                      <span>{formatTime(order.created_at)}</span>
                    </div>

                    {/* Mini items table */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 rounded-xl bg-[#FFF8E4] p-3">
                        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#7A6262]">Items</span>
                          <span className="text-right font-bold uppercase tracking-wider text-[#7A6262]">Qty</span>
                          <span className="text-right font-bold uppercase tracking-wider text-[#7A6262]">Price</span>
                          {order.items.slice(0, 4).map((item: OrderItem) => (
                            <div key={item.id} className="contents">
                              <span className="truncate text-[#3A2A2A]">{item.item_name}</span>
                              <span className="text-right text-[#7A6262]">×{item.quantity}</span>
                              <span className="text-right font-semibold text-[#1D3C42]">₹{item.line_total}</span>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <span className="col-span-3 text-[11px] text-[#7A6262]">+{order.items.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bottom row: total + actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#F4CFC8]/50 pt-4">
                      <div>
                        <span className="text-xl font-extrabold text-[#1D3C42]">₹{order.total}</span>
                        <span className="ml-2 text-xs text-[#7A6262]">subtotal ₹{order.subtotal}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="rounded-lg border border-[#F4CFC8] px-3 py-1.5 text-[11px] font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]"
                        >
                          View Details
                        </button>
                        {nextStatuses.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const s = nextStatuses[0];
                              if (order.delivery_mode === "local_delivery" && s === "out_for_delivery") { openDeliveryModal(order); return; }
                              if (order.delivery_mode === "courier" && s === "courier_booked") { openCourierModal(order); return; }
                              handleStatus(order.id, s);
                            }}
                            className="rounded-lg bg-[#1D3C42] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#163136]"
                          >
                            {ORDER_STATUS_LABELS[nextStatuses[0]]}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right order details panel */}
      {selectedOrder && (
        <aside className="sticky top-0 hidden h-screen w-[420px] border-l border-[#F4CFC8]/50 bg-white shadow-sm lg:block">
          <div className="flex h-full flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[#F4CFC8]/50 px-6 py-4">
              <h2 className="text-base font-extrabold text-[#1D3C42]">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="rounded-full p-1.5 text-[#7A6262] transition hover:bg-[#F4CFC8]/40">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Status */}
              <div className="mb-6">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#7A6262]">Status</label>
                <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold ring-1 ${STATUS_BADGE[selectedOrder.status] || "bg-gray-100 text-gray-700 ring-gray-200"}`}>
                  {ORDER_STATUS_LABELS[selectedOrder.status as OrderStatus] || selectedOrder.status}
                </span>
              </div>

              {/* Customer info */}
              <section className="mb-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Recipient</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-bold text-[#3A2A2A]">{selectedOrder.customer_name}</p>
                  <p className="text-[#7A6262]">{selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && <p className="text-[#7A6262]">{selectedOrder.customer_email}</p>}
                </div>
              </section>

              <div className="mb-6 h-px bg-[#F4CFC8]/50" />

              {/* Order meta */}
              <section className="mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7A6262]">Order ID</span>
                  <span className="font-semibold text-[#1D3C42]">{selectedOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6262]">Date</span>
                  <span className="font-semibold text-[#1D3C42]">{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6262]">Time</span>
                  <span className="font-semibold text-[#1D3C42]">{formatTime(selectedOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6262]">Method</span>
                  <span className="font-semibold capitalize text-[#1D3C42]">
                    {selectedOrder.delivery_mode === "pickup" ? "Pickup" : selectedOrder.delivery_mode === "courier" ? "Courier" : "Local Delivery"}
                  </span>
                </div>
              </section>

              {/* Address */}
              {(selectedOrder.address_line_1 || selectedOrder.full_courier_address) && (
                <>
                  <div className="mb-6 h-px bg-[#F4CFC8]/50" />
                  <section className="mb-6">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Address</h3>
                    <p className="text-sm leading-relaxed text-[#3A2A2A]">
                      {selectedOrder.full_courier_address ||
                        `${selectedOrder.address_line_1}${selectedOrder.address_line_2 ? `, ${selectedOrder.address_line_2}` : ""}, ${selectedOrder.city || ""}${selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ""}`
                      }
                    </p>
                    {selectedOrder.landmark && <p className="mt-1 text-sm text-[#7A6262]">📍 {selectedOrder.landmark}</p>}
                  </section>
                </>
              )}

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <>
                  <div className="mb-6 h-px bg-[#F4CFC8]/50" />
                  <section className="mb-6">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Products ({selectedOrder.items.length})</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E4]">
                            <span className="text-xs font-bold text-[#1D3C42]">×{item.quantity}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1D3C42]">{item.item_name}</p>
                            {item.selected_options && (
                              <p className="text-xs text-[#7A6262]">{item.selected_options}</p>
                            )}
                            <p className="mt-0.5 text-xs text-[#7A6262]">{item.quantity} × ₹{item.unit_price}</p>
                          </div>
                          <span className="shrink-0 text-sm font-bold text-[#D4AF37]">₹{item.line_total}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* Notes */}
              {(selectedOrder.notes || selectedOrder.baker_notes) && (
                <>
                  <div className="mb-6 h-px bg-[#F4CFC8]/50" />
                  <section className="mb-6 space-y-2 text-sm">
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6262]">Customer note</p>
                        <p className="mt-1 text-[#3A2A2A]">{selectedOrder.notes}</p>
                      </div>
                    )}
                    {selectedOrder.baker_notes && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6262]">Baker note</p>
                        <p className="mt-1 text-[#1D3C42]">{selectedOrder.baker_notes}</p>
                      </div>
                    )}
                  </section>
                </>
              )}

              {/* Payment summary */}
              <>
                <div className="mb-6 h-px bg-[#F4CFC8]/50" />
                <section className="mb-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7A6262]">Items total</span>
                      <span className="text-[#3A2A2A]">₹{selectedOrder.subtotal}</span>
                    </div>
                    {(selectedOrder.delivery_fee ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Delivery charge</span>
                        <span className="text-[#3A2A2A]">₹{selectedOrder.delivery_fee}</span>
                      </div>
                    )}
                    {(selectedOrder.fragile_surcharge ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#7A6262]">Fragile surcharge</span>
                        <span className="text-purple-600">+₹{selectedOrder.fragile_surcharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[#F4CFC8]/50 pt-2">
                      <span className="font-bold text-[#1D3C42]">Total</span>
                      <span className="text-lg font-extrabold text-[#1D3C42]">₹{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6262]">Payment status</span>
                      <span className={`font-semibold ${
                        selectedOrder.payment_status === "paid" ? "text-green-600" : "text-red-500"
                      }`}>
                        {selectedOrder.payment_status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </section>
              </>
            </div>

            {/* Action buttons */}
            <div className="border-t border-[#F4CFC8]/50 px-6 py-4">
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-[#F4CFC8] px-3 py-2 text-[11px] font-bold text-[#1D3C42] transition hover:bg-[#FFF8E4]">
                  <Printer size={14} />
                  Print Bill
                </button>
                <button
                  onClick={() => {
                    const msg = `Hi ${selectedOrder.customer_name}, your order ${selectedOrder.order_number} is being prepared!`;
                    window.open(`https://wa.me/${selectedOrder.customer_phone}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#F4CFC8] px-3 py-2 text-[11px] font-bold text-green-700 transition hover:bg-green-50"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </button>
                {(() => {
                  const nextStatuses = getNextStatuses(selectedOrder.status as OrderStatus, selectedOrder.delivery_mode);
                  return nextStatuses.slice(0, 2).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (selectedOrder.delivery_mode === "local_delivery" && s === "out_for_delivery") { openDeliveryModal(selectedOrder); return; }
                        if (selectedOrder.delivery_mode === "courier" && s === "courier_booked") { openCourierModal(selectedOrder); return; }
                        handleStatus(selectedOrder.id, s);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-[#1D3C42] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#163136]"
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </button>
                  ));
                })()}
                <button
                  onClick={() => { setEditingNotes(selectedOrder.id); setNotesValue(selectedOrder.baker_notes || ""); }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#F4CFC8] px-3 py-2 text-[11px] font-bold text-[#7A6262] transition hover:bg-[#FFF8E4]"
                >
                  <FileText size={14} />
                  Notes
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile: show selected order as modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedOrder(null)} />
          <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[#F4CFC8]/50 px-5 py-4">
                <h2 className="text-base font-extrabold text-[#1D3C42]">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="rounded-full p-1.5 text-[#7A6262] transition hover:bg-[#F4CFC8]/40">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                {/* Same content as desktop panel - simplified */}
                <div className="mb-5">
                  <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold ring-1 ${STATUS_BADGE[selectedOrder.status] || "bg-gray-100 text-gray-700 ring-gray-200"}`}>
                    {ORDER_STATUS_LABELS[selectedOrder.status as OrderStatus] || selectedOrder.status}
                  </span>
                </div>
                <section className="mb-5">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Recipient</h3>
                  <p className="font-bold text-[#3A2A2A]">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-[#7A6262]">{selectedOrder.customer_phone}</p>
                </section>
                <div className="mb-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7A6262]">Order ID</span>
                    <span className="font-semibold text-[#1D3C42]">{selectedOrder.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6262]">Date</span>
                    <span className="font-semibold text-[#1D3C42]">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6262]">Method</span>
                    <span className="font-semibold capitalize text-[#1D3C42]">{selectedOrder.delivery_mode}</span>
                  </div>
                </div>
                <div className="mb-5 h-px bg-[#F4CFC8]/50" />
                <section className="mb-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#1D3C42]">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF8E4] text-xs font-bold text-[#1D3C42]">
                          ×{item.quantity}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#1D3C42]">{item.item_name}</p>
                          {item.selected_options && <p className="text-xs text-[#7A6262]">{item.selected_options}</p>}
                        </div>
                        <span className="text-sm font-bold text-[#D4AF37]">₹{item.line_total}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <div className="mb-5 h-px bg-[#F4CFC8]/50" />
                <section>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7A6262]">Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-[#1D3C42]">Total</span>
                      <span className="text-lg text-[#1D3C42]">₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </section>
              </div>
              <div className="border-t border-[#F4CFC8]/50 px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const nextStatuses = getNextStatuses(selectedOrder.status as OrderStatus, selectedOrder.delivery_mode);
                    return nextStatuses.slice(0, 2).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          if (selectedOrder.delivery_mode === "local_delivery" && s === "out_for_delivery") { openDeliveryModal(selectedOrder); return; }
                          if (selectedOrder.delivery_mode === "courier" && s === "courier_booked") { openCourierModal(selectedOrder); return; }
                          handleStatus(selectedOrder.id, s);
                          setSelectedOrder(null);
                        }}
                        className="flex-1 rounded-lg bg-[#1D3C42] py-2.5 text-xs font-bold text-white transition hover:bg-[#163136]"
                      >
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    ));
                  })()}
                  <button
                    onClick={() => { setEditingNotes(selectedOrder.id); setNotesValue(selectedOrder.baker_notes || ""); }}
                    className="flex items-center gap-1.5 rounded-lg border border-[#F4CFC8] px-3 py-2 text-xs font-bold text-[#7A6262]"
                  >
                    <FileText size={14} />
                    Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baker notes modal */}
      {editingNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditingNotes(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1D3C42]">Baker notes</h3>
              <button onClick={() => setEditingNotes(null)}><X size={20} /></button>
            </div>
            <textarea value={notesValue} onChange={(e) => setNotesValue(e.target.value)} className="mt-4 min-h-28 w-full rounded-xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Internal notes..." />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditingNotes(null)} className="flex-1 rounded-xl border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={async () => { await updateBakerNotes(editingNotes, notesValue); setOrders((prev) => prev.map((o) => o.id === editingNotes ? { ...o, baker_notes: notesValue } : o)); setEditingNotes(null); }} className="flex-1 rounded-xl bg-[#1D3C42] py-3 text-sm font-bold text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery fee modal */}
      {editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditingFee(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1D3C42]">Update delivery fee</h3>
              <button onClick={() => setEditingFee(null)}><X size={20} /></button>
            </div>
            <div className="mt-4 flex items-center gap-2"><DollarSign size={18} /><input type="number" value={feeValue} onChange={(e) => setFeeValue(Number(e.target.value))} className="flex-1 rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-lg font-extrabold outline-none focus:border-[#1D3C42]" /></div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditingFee(null)} className="flex-1 rounded-xl border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={async () => { await updateDeliveryFee(editingFee, feeValue); setOrders((prev) => prev.map((o) => o.id === editingFee ? { ...o, delivery_fee: feeValue, delivery_fee_status: "manual", total: o.subtotal + feeValue } : o)); setEditingFee(null); }} className="flex-1 rounded-xl bg-[#1D3C42] py-3 text-sm font-bold text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery provider modal */}
      {deliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setDeliveryModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1D3C42]"><Truck size={18} className="mr-1 inline" /> Book delivery</h3>
              <button onClick={() => setDeliveryModal(null)}><X size={20} /></button>
            </div>
            <p className="mt-2 text-sm text-[#7A6262]">Enter delivery provider details. Status will be set to Out for Delivery.</p>
            <div className="mt-4 grid gap-3">
              <div>
                <input value={dProvider} onChange={(e) => { setDProvider(e.target.value); setDErrors((p) => ({ ...p, provider: "" })); }} onBlur={() => { if (!dProvider.trim()) setDErrors((p) => ({ ...p, provider: "Provider name is required" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${dErrors.provider ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Provider/app name *" />
                {dErrors.provider && <p className="mt-1 text-xs text-red-500">{dErrors.provider}</p>}
              </div>
              <div>
                <input value={dPhone} onChange={(e) => { setDPhone(e.target.value); setDErrors((p) => ({ ...p, phone: "" })); }} onBlur={() => { if (dPhone.trim() && !/^\d{10}$/.test(dPhone.trim())) setDErrors((p) => ({ ...p, phone: "Contact must be exactly 10 digits" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${dErrors.phone ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Delivery partner contact (optional, 10 digits)" />
                {dErrors.phone && <p className="mt-1 text-xs text-red-500">{dErrors.phone}</p>}
              </div>
              <div>
                <input value={dUrl} onChange={(e) => { setDUrl(e.target.value); setDErrors((p) => ({ ...p, url: "" })); }} onBlur={() => { if (!dUrl.trim()) setDErrors((p) => ({ ...p, url: "Tracking URL is required" })); else if (!isValidUrl(dUrl.trim())) setDErrors((p) => ({ ...p, url: "Enter a valid URL (e.g. https://...)" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${dErrors.url ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Tracking URL *" />
                {dErrors.url && <p className="mt-1 text-xs text-red-500">{dErrors.url}</p>}
              </div>
              <textarea value={dNotes} onChange={(e) => setDNotes(e.target.value)} className="min-h-16 rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Delivery notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setDeliveryModal(null); setDErrors({}); }} className="flex-1 rounded-xl border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveDeliveryInfo} disabled={!dProvider.trim() || !dUrl.trim() || Object.values(dErrors).some(Boolean)} className="flex-1 rounded-xl bg-[#1D3C42] py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50">Mark Out for Delivery</button>
            </div>
          </div>
        </div>
      )}

      {/* Courier modal */}
      {courierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setCourierModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1D3C42]"><Package size={18} className="mr-1 inline" /> Add courier details</h3>
              <button onClick={() => setCourierModal(null)}><X size={20} /></button>
            </div>
            <p className="mt-2 text-sm text-[#7A6262]">Enter courier company and tracking. Status will be set to Courier Booked.</p>
            <div className="mt-4 grid gap-3">
              <div>
                <input value={cCompany} onChange={(e) => { setCCompany(e.target.value); setCErrors((p) => ({ ...p, company: "" })); }} onBlur={() => { if (!cCompany.trim()) setCErrors((p) => ({ ...p, company: "Company name is required" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${cErrors.company ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Courier company name *" />
                {cErrors.company && <p className="mt-1 text-xs text-red-500">{cErrors.company}</p>}
              </div>
              <div>
                <input value={cTracking} onChange={(e) => { setCTracking(e.target.value); setCErrors((p) => ({ ...p, tracking: "" })); }} onBlur={() => { if (!cTracking.trim()) setCErrors((p) => ({ ...p, tracking: "Tracking number is required" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${cErrors.tracking ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Tracking number *" />
                {cErrors.tracking && <p className="mt-1 text-xs text-red-500">{cErrors.tracking}</p>}
              </div>
              <div>
                <input value={cUrl} onChange={(e) => { setCUrl(e.target.value); setCErrors((p) => ({ ...p, url: "" })); }} onBlur={() => { if (!cUrl.trim()) setCErrors((p) => ({ ...p, url: "Tracking URL is required" })); else if (!isValidUrl(cUrl.trim())) setCErrors((p) => ({ ...p, url: "Enter a valid URL (e.g. https://...)" })); }} className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D3C42] ${cErrors.url ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Tracking URL *" />
                {cErrors.url && <p className="mt-1 text-xs text-red-500">{cErrors.url}</p>}
              </div>
              <div className="rounded-xl border border-[#F4CFC8] bg-white px-4 py-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A6262]">Courier charge (₹)</label>
                <input value={cCharge} onChange={(e) => setCCharge(Number(e.target.value))} type="number" className="mt-1 w-full text-lg font-extrabold outline-none" placeholder="0" />
              </div>
              <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} className="min-h-16 rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]" placeholder="Courier notes (optional)" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setCourierModal(null); setCErrors({}); }} className="flex-1 rounded-xl border border-[#F4CFC8] py-3 text-sm font-bold">Cancel</button>
              <button onClick={saveCourierInfo} disabled={!cCompany.trim() || !cTracking.trim() || !cUrl.trim() || Object.values(cErrors).some(Boolean)} className="flex-1 rounded-xl bg-[#1D3C42] py-3 text-sm font-bold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50">Mark Courier Booked</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

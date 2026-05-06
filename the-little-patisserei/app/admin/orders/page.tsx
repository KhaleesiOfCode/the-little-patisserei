"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, subscribeToOrders } from "../../../lib/supabase/orders";
import type { Order, OrderStatus } from "../../../types/menu";
import { ORDER_STATUS_LABELS } from "../../../types/menu";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-300",
  confirmed: "bg-blue-100 text-blue-800 ring-blue-300",
  preparing: "bg-purple-100 text-purple-800 ring-purple-300",
  out_for_delivery: "bg-orange-100 text-orange-800 ring-orange-300",
  delivered: "bg-green-100 text-green-800 ring-green-300",
  cancelled: "bg-red-100 text-red-800 ring-red-300",
};



export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }

    load();

    const sub = subscribeToOrders((newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setNotification(`New order: ${newOrder.order_number}`);
      setTimeout(() => setNotification(null), 5000);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const WA_MESSAGES: Record<string, (orderNumber: string, trackingUrl: string) => string> = {
    confirmed: (on, tu) => `Your order ${on} has been confirmed! ✅ We will start preparing it shortly.\n\nTrack your order here: ${tu}`,
    preparing: (on, tu) => `Your order ${on} is now being prepared by our bakers! 👨‍🍳\n\nTrack live: ${tu}`,
    out_for_delivery: (on, tu) => `Your order ${on} is out for delivery! 🚚 Get ready to enjoy!\n\nTrack live: ${tu}`,
    delivered: (on, tu) => `Your order ${on} has been delivered! 🎉 Thank you for choosing The Little Patisserie.\n\nTrack: ${tu}`,
  };

  const handleStatus = async (id: string, status: OrderStatus) => {
    const ok = await updateOrderStatus(id, status);
    if (!ok) return;

    const order = orders.find((o) => o.id === id);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, order_status: status } : o
      )
    );

    const msgFn = WA_MESSAGES[status];
    if (msgFn) {
      const origin = window.location.origin;
      const trackingUrl = `${origin}/track/${order.order_number}`;
      const msg = msgFn(order.order_number, trackingUrl);
      const phone = order.customer_phone.replace(/^0+/, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    }
  };

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => o.order_status === filter);

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      {notification && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 animate-bounce rounded-2xl bg-[#1D3C42] px-6 py-3 text-sm font-semibold text-white shadow-xl">
          🛎️ {notification}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/30 bg-[#FFF8E4]/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#1D3C42]">
              Order dashboard
            </h1>
            <p className="text-xs text-[#7A6262]">
              {orders.length} total orders
            </p>
          </div>

          <a
            href="/"
            className="rounded-full bg-[#1D3C42] px-5 py-2 text-sm font-semibold text-white"
          >
            View site
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", ...STATUS_FLOW] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === status
                  ? "bg-[#1D3C42] text-white"
                  : "bg-white text-[#7A6262] ring-1 ring-[#F4CFC8] hover:bg-[#FFF8E4]"
              }`}
            >
              {status === "all" ? "All" : ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#F4CFC8]">
            <p className="font-semibold text-[#1D3C42]">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#F4CFC8]">
            <p className="font-semibold text-[#7A6262]">No orders found</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#F4CFC8] transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-[#1D3C42]">
                        {order.order_number}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${STATUS_COLORS[order.order_status] || STATUS_COLORS.pending}`}
                      >
                        {ORDER_STATUS_LABELS[order.order_status as OrderStatus] || order.order_status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#7A6262]">
                      {order.customer_name} · {order.customer_phone}
                    </p>
                    <p className="mt-1 text-sm text-[#7A6262]">
                      {order.customer_address}, {order.customer_city}
                    </p>
                    <p className="mt-1 text-xs text-[#7A6262]">
                      <Clock size={12} className="mr-1 inline" />
                      {new Date(order.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-extrabold text-[#1D3C42]">
                      ₹{order.total}
                    </p>
                    <p className="text-xs text-[#7A6262]">
                      {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F4CFC8] pt-4">
                  {STATUS_FLOW.map((status) => {
                    const isActive = order.order_status === status;
                    const isPast =
                      STATUS_FLOW.indexOf(order.order_status as OrderStatus) >=
                      STATUS_FLOW.indexOf(status);

                    if (status === "delivered" && isPast && !isActive) return null;
                    if (order.order_status === "cancelled") return null;

                    return (
                      <button
                        key={status}
                        onClick={() => handleStatus(order.id, status)}
                        disabled={isActive || (isPast && !isActive)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition disabled:opacity-40 ${
                          isActive
                            ? "bg-[#1D3C42] text-white"
                            : "bg-[#FFF8E4] text-[#7A6262] hover:bg-[#FADCD4]"
                        }`}
                      >
                        {status === "delivered" ? (
                          <CheckCircle size={14} />
                        ) : status === "cancelled" ? (
                          <XCircle size={14} />
                        ) : null}
                        {ORDER_STATUS_LABELS[status]}
                      </button>
                    );
                  })}

                  {order.order_status !== "cancelled" && order.order_status !== "delivered" && (
                    <button
                      onClick={() => handleStatus(order.id, "cancelled")}
                      className="ml-auto rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

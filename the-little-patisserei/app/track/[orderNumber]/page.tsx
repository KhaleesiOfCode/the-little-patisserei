"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, MapPin, Package, ShoppingBag } from "lucide-react";
import { getOrderByNumber } from "../../../lib/supabase/orders";
import type { Order } from "../../../types/menu";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../../../types/menu";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const statusIcons: Record<string, string> = {
  pending: "⏳",
  confirmed: "✅",
  preparing: "👨‍🍳",
  out_for_delivery: "🚚",
  delivered: "🎉",
};

export default function TrackPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;

    async function load() {
      const data = await getOrderByNumber(orderNumber);
      if (cancelled) return;
      if (data) {
        setOrder(data);
      } else {
        setError(true);
      }
      setLoading(false);
    }

    load();

    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderNumber]);

  const statusIndex = order
    ? STATUS_STEPS.indexOf(order.order_status as OrderStatus)
    : -1;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8E4]">
        <div className="flex items-center justify-center pt-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D3C42] border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#FFF8E4] px-5 py-20 text-center text-[#3A2A2A]">
        <div className="mx-auto max-w-md">
          <ShoppingBag size={48} className="mx-auto text-[#D4AF37]" />
          <h1 className="mt-6 text-3xl font-extrabold text-[#1D3C42]">
            Order not found
          </h1>
          <p className="mt-3 text-[#7A6262]">
            No order found with number <strong>{orderNumber}</strong>. Check the number and try again.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const orderStatus = order.order_status as OrderStatus;

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <header className="border-b border-[#D4AF37]/30 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-full object-contain" />
            <span className="text-sm font-bold text-[#1D3C42]">The Little Patisserie</span>
          </Link>
          <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#1D3C42]">
            Track order
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:p-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Tracking
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#1D3C42]">
              {order.order_number}
            </h1>
            <p className="mt-1 text-sm text-[#7A6262]">
              {order.customer_name}
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= statusIndex;
                const isLast = index === STATUS_STEPS.length - 1;
                return (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-full text-lg transition ${
                          isActive
                            ? "bg-[#1D3C42] text-white shadow-md"
                            : "bg-[#FFF8E4] text-[#7A6262]"
                        }`}
                      >
                        {statusIcons[step]}
                      </div>
                      <p
                        className={`mt-2 text-center text-xs font-bold ${
                          isActive ? "text-[#1D3C42]" : "text-[#7A6262]"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[step]}
                      </p>
                    </div>
                    {!isLast && (
                      <div
                        className={`mx-1 h-0.5 w-6 sm:mx-3 sm:w-14 ${
                          index < statusIndex ? "bg-[#1D3C42]" : "bg-[#F4CFC8]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {orderStatus === "cancelled" && (
              <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center text-sm font-semibold text-red-600 ring-1 ring-red-200">
                This order has been cancelled.
              </div>
            )}

            {statusIndex >= 0 && statusIndex < STATUS_STEPS.length - 1 && orderStatus !== "cancelled" && (
              <div className="mt-6 rounded-2xl bg-[#FFF8E4] p-4 text-center">
                <p className="text-sm text-[#7A6262]">
                  Current status
                </p>
                <p className="text-lg font-extrabold text-[#1D3C42]">
                  {ORDER_STATUS_LABELS[orderStatus]}
                </p>
                <p className="mt-1 text-xs text-[#7A6262]">
                  Auto-updates every 15 seconds
                </p>
              </div>
            )}

            {orderStatus === "delivered" && (
              <div className="mt-6 rounded-2xl bg-green-50 p-4 text-center">
                <p className="text-lg font-extrabold text-green-700">
                  Delivered! 🎉
                </p>
                <p className="mt-1 text-sm text-green-600">
                  Enjoy your treats from The Little Patisserie!
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-6 border-t border-[#F4CFC8] pt-8 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                <MapPin size={14} />
                Delivery
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-[#7A6262]">{order.customer_phone}</p>
                <p className="text-[#7A6262]">
                  {order.customer_address}, {order.customer_city}
                  {order.customer_state ? `, ${order.customer_state}` : ""}
                  {order.customer_pin ? ` - ${order.customer_pin}` : ""}
                </p>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                <Clock size={14} />
                Schedule
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                {order.delivery_date && (
                  <p className="text-[#7A6262]">
                    Date:{" "}
                    <span className="font-semibold text-[#3A2A2A]">
                      {new Date(order.delivery_date).toLocaleDateString("en-IN", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </p>
                )}
                {order.delivery_time && (
                  <p className="text-[#7A6262]">
                    Time:{" "}
                    <span className="font-semibold text-[#3A2A2A]">{order.delivery_time}</span>
                  </p>
                )}
                <p className="text-xs text-[#7A6262]">
                  Ordered: {new Date(order.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#F4CFC8] pt-6">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Package size={14} />
              Items
            </h3>

            <div className="mt-4 space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-[#FFF8E4] px-5 py-3"
                >
                  <div>
                    <p className="font-semibold text-[#3A2A2A]">{item.item_name}</p>
                    {item.selected_options && (
                      <p className="text-xs text-[#7A6262]">{item.selected_options}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(item.item_price) * item.quantity}</p>
                    <p className="text-xs text-[#7A6262]">₹{Number(item.item_price)} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[#F4CFC8] pt-5">
              <div className="flex justify-between text-sm text-[#7A6262]">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-[#7A6262]">
                <span>Delivery</span>
                <span>₹{order.delivery_charge}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-[#1D3C42]">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#7A6262]">
              Questions? Contact us on{" "}
              <a
                href={`https://wa.me/919488407130?text=${encodeURIComponent(
                  `Hi, I have a question about order ${order.order_number}`
                )}`}
                target="_blank"
                className="font-bold text-[#1D3C42] underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

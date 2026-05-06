"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, MapPin, Phone, Package } from "lucide-react";
import Navbar from "../../../components/Navbar";
import { getOrderById } from "../../../lib/supabase/orders";
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

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      const data = await getOrderById(orderId as string);
      if (cancelled) return;
      setOrder(data);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderId]);

  const statusIndex = order
    ? STATUS_STEPS.indexOf(order.order_status as OrderStatus)
    : -1;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8E4]">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D3C42] border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
        <Navbar />
        <section className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="text-3xl font-extrabold text-[#1D3C42]">
            Order not found
          </h1>
          <p className="mt-3 text-[#7A6262]">
            We could not find this order. It may still be processing.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white"
          >
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  const orderStatus = order.order_status as OrderStatus;

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:p-10">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-[#1D3C42]">
              Order placed!
            </h1>
            <p className="mt-2 text-[#7A6262]">
              Thank you for your order. We will start preparing it shortly.
            </p>
            <p className="mt-1 text-sm font-bold text-[#D4AF37]">
              {order.order_number}
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
                        className={`grid h-10 w-10 place-items-center rounded-full text-lg transition ${
                          isActive
                            ? "bg-[#1D3C42] text-white"
                            : "bg-[#FFF8E4] text-[#7A6262]"
                        }`}
                      >
                        {statusIcons[step]}
                      </div>
                      <p
                        className={`mt-2 text-center text-xs font-semibold ${
                          isActive ? "text-[#1D3C42]" : "text-[#7A6262]"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[step]}
                      </p>
                    </div>
                    {!isLast && (
                      <div
                        className={`mx-2 h-0.5 w-8 sm:w-16 ${
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
              <p className="mt-6 text-center text-sm text-[#7A6262]">
                Current status:{" "}
                <span className="font-bold text-[#1D3C42]">
                  {ORDER_STATUS_LABELS[orderStatus]}
                </span>
              </p>
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
                  {order.customer_state ? `, ${order.customer_state}` : ""}{" "}
                  {order.customer_pin ? `- ${order.customer_pin}` : ""}
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
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                )}
                {order.delivery_time && (
                  <p className="text-[#7A6262]">
                    Time:{" "}
                    <span className="font-semibold text-[#3A2A2A]">
                      {order.delivery_time}
                    </span>
                  </p>
                )}
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
                    <p className="font-semibold text-[#3A2A2A]">
                      {item.item_name}
                    </p>
                    {item.selected_options && (
                      <p className="text-xs text-[#7A6262]">
                        {item.selected_options}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{Number(item.item_price) * item.quantity}
                    </p>
                    <p className="text-xs text-[#7A6262]">
                      ₹{Number(item.item_price)} x {item.quantity}
                    </p>
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

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-[#FFF8E4] p-5 text-center ring-1 ring-[#F4CFC8]">
              <p className="text-sm font-semibold text-[#7A6262]">
                Track your order live
              </p>
              <a
                href={`${typeof window !== "undefined" ? window.location.origin : ""}/track/${order.order_number}`}
                target="_blank"
                className="mt-2 inline-block text-lg font-extrabold text-[#1D3C42] underline underline-offset-4 transition hover:text-[#D4AF37]"
              >
                {typeof window !== "undefined" ? window.location.origin : ""}/track/{order.order_number}
              </a>
              <a
                href={`https://wa.me/919488407130?text=${encodeURIComponent(
                  `Hi! Your order ${order.order_number} has been placed. Track it here: ${typeof window !== "undefined" ? window.location.origin : ""}/track/${order.order_number}\n\nTotal: ₹${order.total}`
                )}`}
                target="_blank"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1DA851]"
              >
                Send to WhatsApp
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/menu"
                className="rounded-full bg-[#1D3C42] px-7 py-3 text-center font-semibold text-white transition hover:bg-[#163136]"
              >
                Order more
              </Link>
              <a
                href={`https://wa.me/919488407130?text=${encodeURIComponent(
                  `Hi, I have a question about order ${order.order_number}`
                )}`}
                target="_blank"
                className="rounded-full border border-[#D4AF37] px-7 py-3 text-center font-semibold text-[#1D3C42] transition hover:bg-[#FFF8E4]"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

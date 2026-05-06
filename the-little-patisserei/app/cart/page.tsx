"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, FileText, Lock, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";
import { createOrder } from "../../lib/supabase/orders";
import type { OrderFormData } from "../../types/menu";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, total } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const [form, setForm] = useState<OrderFormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    deliveryDate: "",
    deliveryTime: "",
    instructions: "",
  });

  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const grandTotal = total + deliveryCharge;

  const update = (field: keyof OrderFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const simulatePayment = () =>
    new Promise<void>((resolve) => {
      setSubmitting(true);
      const timer = setTimeout(() => {
        setPaid(true);
        setSubmitting(false);
        resolve();
      }, 2000);
      return () => clearTimeout(timer);
    });

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    await simulatePayment();

    const items = cart.map((item) => {
      const opts = [item.selectedQuantity, item.selectedEggOption]
        .filter(Boolean)
        .join(", ");
      return {
        name: item.name,
        price: item.price,
        qty: item.qty,
        options: opts || undefined,
      };
    });

    const order = await createOrder(form, items, total, grandTotal);
    if (order) {
      router.push(`/order/confirmation?id=${order.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8] lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF8E4] text-[#1D3C42] transition hover:bg-[#FADCD4]"
                aria-label="Back to menu"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-extrabold">My cart</h1>
            </div>

            <div className="mt-6 border-t border-[#F4CFC8]">
              {cart.length === 0 ? (
                <div className="py-10">
                  <p className="text-[#7A6262]">Your cart is empty.</p>
                  <Link
                    href="/menu"
                    className="mt-6 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white hover:bg-[#E77E8D]"
                  >
                    View Menu
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[90px_1fr] gap-5 border-b border-[#F4CFC8] py-5 md:grid-cols-[100px_1fr_auto_auto_auto]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[90px] w-[90px] rounded-xl object-cover md:h-[100px] md:w-[100px]"
                    />

                    <div>
                      <h2 className="font-bold">{item.name}</h2>
                      <p className="mt-2 text-sm text-[#7A6262]">
                        ₹{item.price}
                      </p>
                      {item.selectedQuantity && (
                        <p className="mt-1 text-sm text-[#7A6262]">
                          Size: {item.selectedQuantity}
                        </p>
                      )}
                      {item.selectedEggOption && (
                        <p className="mt-1 text-sm text-[#7A6262]">
                          {item.selectedEggOption}
                        </p>
                      )}
                    </div>

                    <div className="flex h-9 w-fit items-center rounded-full border border-[#F08C9B]">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-3 text-[#D4AF37]"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-3 text-[#D4AF37]"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold md:min-w-[70px] md:text-right">
                      ₹{item.price * item.qty}
                    </p>

                    <button
                      onClick={() => setConfirmRemoveId(item.id)}
                      className="cursor-pointer text-[#D4AF37] transition hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1D3C42]">
                <FileText size={16} />
                Add a note
              </label>
              <textarea
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-sm text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#1D3C42]"
              />
            </div>

            {showCheckout && cart.length > 0 && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 ring-1 ring-[#F4CFC8]">
                <h2 className="text-2xl font-extrabold">Delivery details</h2>
                <p className="mt-2 text-sm text-[#7A6262]">
                  Fill in your details to place the order.
                </p>

                <div className="mt-6 grid gap-4">
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                    placeholder="Full name *"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                    placeholder="Mobile number *"
                  />
                  <input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                    placeholder="Address line *"
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                      placeholder="City *"
                    />
                    <input
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                      placeholder="State"
                    />
                    <input
                      value={form.pin}
                      onChange={(e) => update("pin", e.target.value)}
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                      placeholder="PIN code *"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Preferred delivery date
                      </label>
                      <input
                        type="date"
                        value={form.deliveryDate}
                        onChange={(e) => update("deliveryDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Preferred delivery time
                      </label>
                      <input
                        type="time"
                        value={form.deliveryTime}
                        onChange={(e) => update("deliveryTime", e.target.value)}
                        className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside>
            <h2 className="text-2xl font-extrabold">Order summary</h2>

            <div className="mt-6 space-y-4 border-t border-[#F4CFC8] pt-6">
              <div className="flex justify-between text-[#7A6262]">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-[#7A6262]">
                <span>Delivery</span>
                <span>{cart.length > 0 ? `₹${deliveryCharge}` : "--"}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-[#F4CFC8] pt-6">
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={cart.length === 0}
                  className="mt-6 block w-full rounded-full bg-[#1D3C42] px-8 py-3 text-center font-semibold text-white hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Checkout
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || cart.length === 0 || !form.name || !form.phone || !form.address || !form.city}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3 font-semibold text-white transition hover:bg-[#163136] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing payment...
                    </>
                  ) : paid ? (
                    <>
                      <CheckCircle size={18} />
                      Saving order...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay ₹{grandTotal}
                    </>
                  )}
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#7A6262]">
                <Lock size={14} />
                Dummy payment — no real charge
              </div>
            </div>
          </aside>
        </div>
      </section>
      {confirmRemoveId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setConfirmRemoveId(null)}
        >
          <div
            className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-[#3A2A2A]">
              Remove item?
            </h3>
            <p className="mt-2 text-sm text-[#7A6262]">
              This item will be removed from your cart.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmRemoveId(null)}
                className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold text-[#3A2A2A] transition hover:bg-[#FFF8E4]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeFromCart(confirmRemoveId);
                  setConfirmRemoveId(null);
                }}
                className="flex-1 rounded-full bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

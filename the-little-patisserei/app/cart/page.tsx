"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, FileText, Lock, MessageCircle, CreditCard } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const grandTotal = total + deliveryCharge;

  const whatsappMessage = encodeURIComponent(
    `Hi, I would like to place an order:\n\nItems:\n${cart
      .map(
        (item: any) =>
          `- ${item.name} x ${item.qty} = ₹${item.price * item.qty}`
      )
      .join("\n")}\n\nSubtotal: ₹${total}\nDelivery charge: ₹${deliveryCharge}\nTotal: ₹${grandTotal}`
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8] lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h1 className="text-2xl font-extrabold">My cart</h1>

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
                cart.map((item: any) => (
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
                      <p className="mt-1 text-sm text-[#7A6262]">
                        Size: Regular
                      </p>
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
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#D4AF37]"
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
                placeholder="Any special instructions for your order..."
                className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-sm text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#1D3C42]"
              />
            </div>

            {showCheckout && cart.length > 0 && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 ring-1 ring-[#F4CFC8]">
                <h2 className="text-2xl font-extrabold">Delivery details</h2>
                <p className="mt-2 text-sm text-[#7A6262]">
                  Add address and choose how you want to confirm the order.
                </p>

                <div className="mt-6 grid gap-4">
                  <input
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                    placeholder="Full name"
                  />

                  <input
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                    placeholder="Mobile number"
                  />

                  <input
                    className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                    placeholder="Address line"
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                      placeholder="City"
                    />
                    <input
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                      placeholder="State"
                    />
                    <input
                      className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                      placeholder="PIN code"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Preferred delivery date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Preferred delivery time
                      </label>
                      <input
                        type="time"
                        className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                      />
                    </div>
                  </div>

                  <textarea
                    className="min-h-24 rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#F08C9B]"
                    placeholder="Special instructions"
                  />

                  <div className="flex justify-center">
                    <button className="flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3 font-semibold text-white transition hover:bg-[#163136]">
                      <CreditCard size={18} />
                      Pay with Razorpay
                    </button>
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

              <button
                onClick={() => setShowCheckout(true)}
                disabled={cart.length === 0}
                className="mt-6 block w-full rounded-full bg-[#1D3C42] px-8 py-3 text-center font-semibold text-white hover:bg-[#E77E8D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#7A6262]">
                <Lock size={14} />
                Secure Checkout
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
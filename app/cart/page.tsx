"use client";

import Link from "next/link";
import { Trash2, FileText, Lock } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart();

  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const grandTotal = total + deliveryCharge;

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8] lg:grid-cols-[1.4fr_0.8fr]">
          
          {/* LEFT CART */}
          <div>
            <h1 className="text-2xl font-extrabold">My cart</h1>

            <div className="mt-6 border-t border-[#F4CFC8]">
              {cart.length === 0 ? (
                <div className="py-10">
                  <p className="text-[#7A6262]">Your cart is empty.</p>
                  <Link
                    href="/menu"
                    className="mt-6 inline-block rounded-full bg-[#F08C9B] px-7 py-3 text-white font-semibold hover:bg-[#E77E8D]"
                  >
                    View Menu
                  </Link>
                </div>
              ) : (
                cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[100px_1fr_auto_auto_auto] items-start gap-5 border-b border-[#F4CFC8] py-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[100px] w-[100px] rounded-xl object-cover"
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

                    {/* QTY STEPPER */}
                    <div className="flex h-9 items-center rounded-full border border-[#F08C9B]">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-3 text-[#F08C9B]"
                      >
                        −
                      </button>

                      <span className="px-3 text-sm font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-3 text-[#F08C9B]"
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-[70px] text-right font-semibold">
                      ₹{item.price * item.qty}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#F08C9B]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* NOTE */}
            <div className="space-y-5 border-b border-[#F4CFC8] py-7">
              <button className="flex items-center gap-3 text-sm text-[#7A6262] hover:text-[#F08C9B]">
                <FileText size={16} />
                Add a note
              </button>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <aside>
            <h2 className="text-2xl font-extrabold">Order summary</h2>

            <div className="mt-6 border-t border-[#F4CFC8] pt-6 space-y-4">
              <div className="flex justify-between text-[#7A6262]">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between text-[#7A6262]">
                <span>Delivery</span>
                <span>
                  {cart.length > 0 ? `₹${deliveryCharge}` : "--"}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-[#F4CFC8] pt-6">
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <Link
                href="/order"
                className="mt-6 block rounded-full bg-[#F08C9B] px-8 py-3 text-center font-semibold text-white hover:bg-[#E77E8D]"
              >
                Checkout
              </Link>

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
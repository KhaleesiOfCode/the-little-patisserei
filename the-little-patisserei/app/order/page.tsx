"use client";

import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";
import RazorpayButton from "../../components/RazorpayButton";

const WHATSAPP_NUMBER = "919488407130";

export default function OrderPage() {
  const { cart, total } = useCart();

  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const grandTotal = total + deliveryCharge;

  const whatsappMessage = encodeURIComponent(
    `Hi, I would like to place an order:\n\nItems:\n${cart
      .map(
        (item) =>
          `- ${item.name} x ${item.qty} = ₹${item.price * item.qty}`
      )
      .join("\n")}\n\nSubtotal: ₹${total}\nDelivery charge: ₹${deliveryCharge}\nTotal: ₹${grandTotal}`
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
          <h1 className="text-3xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-[#7A6262]">
            Enter delivery details and choose your payment method.
          </p>

          <div className="mt-8 grid gap-4">
            <input
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
              placeholder="Full name"
            />

            <input
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
              placeholder="Mobile number"
            />

            <input
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
              placeholder="Address line"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
                placeholder="City"
              />

              <input
                className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
                placeholder="State"
              />

              <input
                className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
                placeholder="PIN code"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3A2A2A]">
                  Preferred delivery date
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none focus:border-[#F08C9B]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3A2A2A]">
                  Preferred delivery time
                </label>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none focus:border-[#F08C9B]"
                />
              </div>
            </div>

            <textarea
              className="min-h-24 rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#F08C9B]"
              placeholder="Special instructions"
            />

            <RazorpayButton className="mt-4 bg-[#1D3C42]" label="Pay Online with Razorpay" />

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              className="rounded-full border border-[#F08C9B] px-6 py-3 text-center font-semibold text-[#D4AF37] transition hover:bg-[#FADCD4]"
            >
              Send Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
          <h2 className="text-2xl font-extrabold">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-[#7A6262]">
                Your cart is empty. Please add items from the menu.
              </p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-[#7A6262]">
                      ₹{item.price} x {item.qty}
                    </p>
                  </div>

                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 space-y-3 border-t border-[#F4CFC8] pt-5">
            <div className="flex justify-between text-[#7A6262]">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between text-[#7A6262]">
              <span>Delivery charge</span>
              <span>₹{deliveryCharge}</span>
            </div>

            <div className="flex justify-between text-xl font-extrabold text-[#3A2A2A]">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

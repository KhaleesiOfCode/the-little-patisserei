"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";

const steps = ["Flavour", "Size", "Message", "Delivery", "Review"];

const sizeOptions = [
  { label: "500g", price: 650 },
  { label: "1kg", price: 1200 },
  { label: "1.5kg", price: 1700 },
  { label: "2kg", price: 2200 },
  { label: "3kg+", price: 3200 },
];

export default function CustomCakePage() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    flavour: "",
    size: "",
    message: "",
    occasion: "",
    designDescription: "",
    date: "",
    time: "",
    address: "",
  });

  const selectedSize = sizeOptions.find((item) => item.label === form.size);
  const basePrice = selectedSize?.price || 0;

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#1D3C42]">
            Custom Cake Builder
          </h1>
          <p className="mt-2 text-[#7A6262]">
            Design your celebration cake step by step
          </p>
        </div>

        <div className="mb-10 flex justify-between text-xs font-bold text-[#7A6262]">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`flex-1 text-center ${
                i === step ? "text-[#1D3C42]" : ""
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
          {step === 0 && (
            <select
              value={form.flavour}
              className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
              onChange={(e) => setForm({ ...form, flavour: e.target.value })}
            >
              <option value="">Select flavour</option>
              <option>Chocolate Truffle</option>
              <option>Red Velvet</option>
              <option>Vanilla Cream</option>
              <option>Butterscotch</option>
              <option>Mango Cream</option>
              <option>Black Forest</option>
            </select>
          )}

          {step === 1 && (
            <div className="grid gap-3">
              {sizeOptions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setForm({ ...form, size: item.label })}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    form.size === item.label
                      ? "border-[#1D3C42] bg-[#1D3C42] text-white"
                      : "border-[#F4CFC8] bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                  }`}
                >
                  <span className="font-bold">{item.label}</span>
                  <span className="font-extrabold">₹{item.price}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <input
                placeholder="Message on cake"
                value={form.message}
                className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <input
                placeholder="Occasion, e.g. Birthday, Anniversary"
                value={form.occasion}
                className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              />

              <textarea
                placeholder="Describe the cake design you want, e.g. pastel theme, flowers, cartoon character, chocolate drip..."
                value={form.designDescription}
                className="min-h-28 w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) =>
                  setForm({ ...form, designDescription: e.target.value })
                }
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <input
                type="date"
                value={form.date}
                className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                type="time"
                value={form.time}
                className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />

              <textarea
                placeholder="Delivery address"
                value={form.address}
                className="min-h-24 rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-sm">
              <p>
                <b>Flavour:</b> {form.flavour || "Not selected"}
              </p>
              <p>
                <b>Size:</b> {form.size || "Not selected"}
              </p>
              <p>
                <b>Message:</b> {form.message || "Not added"}
              </p>
              <p>
                <b>Occasion:</b> {form.occasion || "Not added"}
              </p>
              <p>
                <b>Design:</b> {form.designDescription || "Not added"}
              </p>
              <p>
                <b>Date:</b> {form.date || "Not selected"}
              </p>
              <p>
                <b>Time:</b> {form.time || "Not selected"}
              </p>
              <p>
                <b>Address:</b> {form.address || "Not added"}
              </p>

              <div className="rounded-2xl bg-[#FFF8E4] p-5">
                <p className="text-lg font-extrabold text-[#1D3C42]">
                  Estimated price: ₹{basePrice}
                </p>
                <p className="mt-1 text-xs text-[#7A6262]">
                  Final price may vary based on detailed design complexity.
                </p>
              </div>

              <button className="mt-4 w-full rounded-full bg-[#1D3C42] py-3 font-semibold text-white hover:bg-[#163136]">
                Proceed to Payment
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 0 && (
              <button onClick={prev} className="text-sm font-semibold text-[#7A6262]">
                Back
              </button>
            )}

            {step < steps.length - 1 && (
              <button
                onClick={next}
                className="ml-auto rounded-full bg-[#1D3C42] px-6 py-2 font-semibold text-white hover:bg-[#163136]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
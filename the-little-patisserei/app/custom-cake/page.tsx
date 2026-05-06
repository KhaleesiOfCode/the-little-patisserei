"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { CakeSlice, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const steps = ["Flavour", "Size", "Details", "Delivery", "Review"];

const sizeOptions = [
  { label: "500g", price: 650, serves: "4–6 people" },
  { label: "1kg", price: 1200, serves: "8–10 people" },
  { label: "1.5kg", price: 1700, serves: "12–15 people" },
  { label: "2kg", price: 2200, serves: "18–22 people" },
  { label: "3kg+", price: 3200, serves: "Large celebration" },
];

const flavours = [
  "Chocolate Truffle",
  "Red Velvet",
  "Vanilla Cream",
  "Butterscotch",
  "Mango Cream",
  "Black Forest",
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
    name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
  });

  const selectedSize = sizeOptions.find((item) => item.label === form.size);
  const basePrice = selectedSize?.price || 0;

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const isStepValid = () => {
    switch (step) {
      case 0:
        return form.flavour !== "";
      case 1:
        return form.size !== "";
      case 2:
        return (
          form.message.trim() !== "" &&
          form.occasion.trim() !== "" &&
          form.designDescription.trim() !== ""
        );
      case 3:
        return (
          form.date !== "" &&
          form.time !== "" &&
          form.name.trim() !== "" &&
          form.phone.trim() !== "" &&
          form.address.trim() !== "" &&
          form.city.trim() !== "" &&
          form.pin.trim() !== ""
        );
      default:
        return true;
    }
  };

  const next = () => {
    if (!isStepValid()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const whatsappMessage = encodeURIComponent(
    `Hi, I want to enquire about a custom cake.

Flavour: ${form.flavour}
Size: ${form.size}
Estimated Price: ₹${basePrice}

Message on cake: ${form.message}
Occasion: ${form.occasion}
Design idea: ${form.designDescription}

Delivery Date: ${form.date}
Delivery Time: ${form.time}

Customer Details:
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
City: ${form.city}
PIN: ${form.pin}

Please confirm availability and final price.`
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Custom Cake Studio
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#1D3C42] md:text-5xl">
            Build your dream cake
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#7A6262]">
            Choose flavour, size, cake message and design notes. We’ll prepare
            it as a custom celebration enquiry.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] md:p-8">
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#1D3C42]">
                <span>
                  Step {step + 1} of {steps.length}
                </span>
                <span>{steps[step]}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#FFF8E4]">
                <div
                  className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-8 grid grid-cols-5 gap-2">
              {steps.map((label, index) => (
                <button
                  key={label}
                  onClick={() => {
                    if (index <= step) setStep(index);
                  }}
                  className={`rounded-2xl px-2 py-3 text-xs font-bold transition ${
                    step === index
                      ? "bg-[#1D3C42] text-white"
                      : index < step
                      ? "bg-[#D4AF37]/20 text-[#1D3C42] hover:bg-[#D4AF37]/30"
                      : "cursor-not-allowed bg-[#FFF8E4] text-[#7A6262]/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="min-h-[340px]">
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1D3C42]">
                    Choose your flavour
                  </h2>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Pick a base flavour for your celebration cake.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {flavours.map((flavour) => (
                      <button
                        key={flavour}
                        onClick={() => setForm({ ...form, flavour })}
                        className={`rounded-[1.5rem] border p-5 text-left transition ${
                          form.flavour === flavour
                            ? "border-[#1D3C42] bg-[#1D3C42] text-white"
                            : "border-[#F4CFC8] bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                        }`}
                      >
                        <CakeSlice className="mb-4" size={22} />
                        <span className="font-bold">{flavour}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1D3C42]">
                    Select cake size
                  </h2>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Price changes based on size.
                  </p>

                  <div className="mt-6 grid gap-4">
                    {sizeOptions.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setForm({ ...form, size: item.label })}
                        className={`flex items-center justify-between rounded-[1.5rem] border px-5 py-4 text-left transition ${
                          form.size === item.label
                            ? "border-[#1D3C42] bg-[#1D3C42] text-white"
                            : "border-[#F4CFC8] bg-[#FFF8E4] text-[#3A2A2A] hover:bg-[#FADCD4]"
                        }`}
                      >
                        <div>
                          <p className="font-extrabold">{item.label}</p>
                          <p
                            className={`text-sm ${
                              form.size === item.label
                                ? "text-white/75"
                                : "text-[#7A6262]"
                            }`}
                          >
                            {item.serves}
                          </p>
                        </div>
                        <span className="text-xl font-extrabold">
                          ₹{item.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1D3C42]">
                    Cake message & design
                  </h2>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Tell us what should be written and how the cake should look.
                  </p>

                  <div className="mt-6 grid gap-4">
                    <input
                      placeholder="Message on cake"
                      value={form.message}
                      className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />

                    <input
                      placeholder="Occasion, e.g. Birthday, Anniversary"
                      value={form.occasion}
                      className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                      onChange={(e) =>
                        setForm({ ...form, occasion: e.target.value })
                      }
                    />

                    <textarea
                      placeholder="Describe the design, e.g. pastel floral cake, cartoon theme, chocolate drip, gold topper..."
                      value={form.designDescription}
                      className="min-h-32 rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          designDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1D3C42]">
                    Delivery details
                  </h2>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    All delivery fields are required before review.
                  </p>

                  <div className="mt-6 grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        placeholder="Full name"
                        value={form.name}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />

                      <input
                        placeholder="Phone number"
                        value={form.phone}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="date"
                        value={form.date}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                      />

                      <input
                        type="time"
                        value={form.time}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, time: e.target.value })
                        }
                      />
                    </div>

                    <textarea
                      placeholder="Address line"
                      value={form.address}
                      className="min-h-24 rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        placeholder="City"
                        value={form.city}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                      />

                      <input
                        placeholder="PIN code"
                        value={form.pin}
                        className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#1D3C42]"
                        onChange={(e) =>
                          setForm({ ...form, pin: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1D3C42]">
                    Review your custom cake
                  </h2>
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Check your details before sending the enquiry.
                  </p>

                  <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#F4CFC8] bg-[#FFF8E4]">
                    <div className="bg-[#1D3C42] px-6 py-5 text-white">
                      <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                        Custom Cake Enquiry
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold">
                        {form.occasion || "Celebration Cake"}
                      </h3>
                    </div>

                    <div className="grid gap-4 p-6 text-sm">
                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Flavour</span>
                        <span className="font-bold text-[#3A2A2A]">
                          {form.flavour}
                        </span>
                      </div>

                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Size</span>
                        <span className="font-bold text-[#3A2A2A]">
                          {form.size}
                        </span>
                      </div>

                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Cake message</span>
                        <span className="max-w-xs text-right font-bold text-[#3A2A2A]">
                          {form.message}
                        </span>
                      </div>

                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Design idea</span>
                        <span className="max-w-xs text-right font-bold text-[#3A2A2A]">
                          {form.designDescription}
                        </span>
                      </div>

                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Delivery date</span>
                        <span className="font-bold text-[#3A2A2A]">
                          {form.date}
                        </span>
                      </div>

                      <div className="flex justify-between gap-6 border-b border-[#F4CFC8] pb-3">
                        <span className="text-[#7A6262]">Delivery time</span>
                        <span className="font-bold text-[#3A2A2A]">
                          {form.time}
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="mb-2 font-bold text-[#1D3C42]">
                          Delivery details
                        </p>
                        <p className="text-[#7A6262]">
                          {form.name}, {form.phone}
                        </p>
                        <p className="mt-1 text-[#7A6262]">
                          {form.address}, {form.city} - {form.pin}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#D4AF37]/20 p-5">
                        <span className="font-bold text-[#1D3C42]">
                          Estimated price
                        </span>
                        <span className="text-2xl font-extrabold text-[#1D3C42]">
                          ₹{basePrice}
                        </span>
                      </div>

                      <p className="text-xs leading-5 text-[#7A6262]">
                        Final price may vary depending on design complexity. The
                        bakery will confirm the final quote after reviewing your
                        enquiry.
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/919488407130?text=${whatsappMessage}`}
                    target="_blank"
                    className="mt-6 block w-full rounded-full bg-[#1D3C42] py-3 text-center font-semibold text-white hover:bg-[#163136]"
                  >
                    Proceed to WhatsApp Enquiry
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between border-t border-[#F4CFC8] pt-6">
              <button
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[#F4CFC8] px-5 py-2 text-sm font-semibold text-[#1D3C42] disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              {step < steps.length - 1 && (
                <button
                  onClick={next}
                  disabled={!isStepValid()}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition ${
                    isStepValid()
                      ? "bg-[#1D3C42] text-white hover:bg-[#163136]"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-[2.5rem] bg-[#1D3C42] p-7 text-white shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Sparkles size={18} />
              <p className="text-sm font-bold uppercase tracking-[0.2em]">
                Live Summary
              </p>
            </div>

            <div className="mt-6 rounded-[2rem] bg-white/10 p-5">
              <p className="text-sm text-white/70">Estimated price</p>
              <p className="mt-2 text-4xl font-extrabold text-[#D4AF37]">
                ₹{basePrice || 0}
              </p>
              <p className="mt-2 text-xs text-white/60">
                Final price may vary based on detailed design complexity.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Flavour</span>
                <span className="font-semibold">{form.flavour || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Size</span>
                <span className="font-semibold">{form.size || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Occasion</span>
                <span className="font-semibold">{form.occasion || "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Date</span>
                <span className="font-semibold">{form.date || "—"}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
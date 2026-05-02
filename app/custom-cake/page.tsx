"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function CustomCakePage() {
  const [form, setForm] = useState({
    flavour: "",
    size: "",
    message: "",
    occasion: "",
    date: "",
    time: "",
    notes: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const whatsappMessage = encodeURIComponent(
    `Hi, I want to order a custom cake.

Flavour: ${form.flavour}
Size: ${form.size}
Message on cake: ${form.message}
Occasion: ${form.occasion}
Preferred date: ${form.date}
Preferred time: ${form.time}
Special notes: ${form.notes}

I will attach the reference design image here.`
  );

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Custom Cake
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Design your celebration cake
          </h1>

          <p className="mt-3 text-[#7A6262]">
            Choose flavour, size, cake message and upload a reference design.
          </p>

          <div className="mt-8 grid gap-4">
            <select
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
              value={form.flavour}
              onChange={(e) => setForm({ ...form, flavour: e.target.value })}
            >
              <option value="">Choose flavour</option>
              <option>Chocolate Truffle</option>
              <option>Vanilla Cream</option>
              <option>Red Velvet</option>
              <option>Butterscotch</option>
              <option>Mango Cream</option>
              <option>Black Forest</option>
            </select>

            <select
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            >
              <option value="">Choose size</option>
              <option>500g</option>
              <option>1kg</option>
              <option>1.5kg</option>
              <option>2kg</option>
              <option>3kg+</option>
            </select>

            <input
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
              placeholder="Message to write on cake"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <input
              className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
              placeholder="Occasion, e.g. Birthday, Anniversary"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Preferred date
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Preferred time
                </label>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Upload reference design
              </label>
              <label className="block cursor-pointer">
                  <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[#D4AF37] bg-[#FFF8E4] px-4 py-6 text-center hover:bg-[#FADCD4]">
                    <span className="text-sm font-semibold text-[#1D3C42]">
                      Upload reference design
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                        setFileName(file.name);
                      }
                    }}
                  />
                </label>
                {fileName && (
                  <p className="mt-2 text-sm text-[#7A6262]">
                    Selected: <span className="font-semibold">{fileName}</span>
                  </p>
                )}
              <p className="mt-2 text-xs text-[#7A6262]">
                Note: the website prepares the WhatsApp message. Please attach
                the image manually in WhatsApp after it opens.
              </p>
            </div>

            <textarea
              className="min-h-24 rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B]"
              placeholder="Special instructions"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <a
              href={`https://wa.me/91BAKERNUMBER?text=${whatsappMessage}`}
              target="_blank"
              className="rounded-full bg-[#1D3C42] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#E77E8D]"
            >
              Send Custom Cake Enquiry
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#F4CFC8]">
          <h2 className="text-2xl font-extrabold">Preview</h2>

          <div className="mt-6 rounded-[2rem] bg-[#FFF8E4] p-5">
            {preview ? (
              <img
                src={preview}
                alt="Reference design preview"
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="grid aspect-square place-items-center rounded-[1.5rem] bg-[#FADCD4] text-center text-[#7A6262]">
                Reference design preview appears here
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <p><strong>Flavour:</strong> {form.flavour || "Not selected"}</p>
            <p><strong>Size:</strong> {form.size || "Not selected"}</p>
            <p><strong>Message:</strong> {form.message || "Not added"}</p>
            <p><strong>Occasion:</strong> {form.occasion || "Not added"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { CakeSlice, Heart, Award, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "919488407130";

export const metadata: Metadata = {
  title: "About | The Little Patisserie",
  description: "A home-based bakery in Chennai crafting fresh, small-batch cakes, cupcakes, brownies, and custom celebration desserts with premium ingredients.",
};

const features = [
  {
    icon: CakeSlice,
    title: "Freshly Baked to Order",
    desc: "Every dessert is prepared after your order is confirmed, so you receive it fresh and thoughtfully made.",
  },
  {
    icon: Heart,
    title: "Small-Batch Quality",
    desc: "We focus on quality over quantity, giving every cake and dessert the attention it deserves.",
  },
  {
    icon: Sparkles,
    title: "Custom Celebration Cakes",
    desc: "From birthdays to special events, we create cakes that match your occasion, flavour preference, and design idea.",
  },
  {
    icon: Award,
    title: "Premium Ingredients",
    desc: "We use carefully selected ingredients to create desserts that taste as good as they look.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto h-1 w-16 rounded-full bg-[#D4AF37]" />
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            About
          </p>
          <h1 className="mt-4 text-center font-display text-4xl font-bold leading-tight text-[#1D3C42] md:text-5xl">
            A Home Bakery Made for{" "}
            <span className="text-[#D4AF37]">Sweet Celebrations</span>
          </h1>

          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] bg-white/80 p-8 shadow-sm ring-1 ring-[#F4CFC8] backdrop-blur-sm md:p-10">
            <p className="text-[15px] leading-8 text-[#7A6262]">
              Welcome to The Little Patisserie — a home-based bakery created for people who love fresh, thoughtful, and beautifully made desserts.
            </p>
            <p className="mt-5 text-[15px] leading-8 text-[#7A6262]">
              Every cake, cupcake, brownie, and sweet treat is handcrafted in small batches using carefully chosen ingredients. From birthdays and celebrations to simple everyday cravings, each order is made with attention to flavour, freshness, and detail.
            </p>
            <p className="mt-5 text-[15px] leading-8 text-[#7A6262]">
              Because we bake from home, every order is prepared with care and planned ahead to ensure quality. Whether you are choosing from our menu or ordering a custom cake, we love being part of your special moments.
            </p>
            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#FFF8E4] py-5 text-center ring-1 ring-[#D4AF37]/20">
              <p className="font-display text-xl font-bold italic leading-snug text-[#1D3C42]">
                &ldquo;Freshly baked. Thoughtfully designed. Made to celebrate.&rdquo;
              </p>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-4xl">
            <div className="text-center">
              <div className="mx-auto h-1 w-12 rounded-full bg-[#D4AF37]/60" />
              <h2 className="mt-4 font-display text-3xl font-bold text-[#1D3C42] md:text-4xl">
                Why Choose The Little Patisserie?
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8] transition hover:-translate-y-1 hover:shadow-lg md:p-8"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF8E4] ring-1 ring-[#D4AF37]/20 transition group-hover:bg-[#D4AF37]/10">
                    <f.icon size={22} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#1D3C42]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#7A6262]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#163136] hover:shadow-xl"
            >
              View Menu
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-[#1D3C42] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#D4AF37]/90 hover:shadow-xl"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

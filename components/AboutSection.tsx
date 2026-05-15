"use client";

import Link from "next/link";
import { Heart, Sun, Truck, Sparkles } from "lucide-react";

const usps = [
  {
    icon: Sun,
    title: "Freshly Baked Daily",
    desc: "No pre-mixes, no preservatives — made fresh on order.",
  },
  {
    icon: Heart,
    title: "Egg & Eggless Options",
    desc: "Both choices available so everyone can indulge.",
  },
  {
    icon: Truck,
    title: "Chennai & South India",
    desc: "Free local delivery in Chennai, courier across South India.",
  },
  {
    icon: Sparkles,
    title: "Custom Creations",
    desc: "Design your dream cake with our custom cake studio.",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-[#FFF8E4] px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Top pane — Brand Story */}
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/gallery/cake-1.jpg"
              alt="Handcrafted cake at The Little Patisserie"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="h-0.5 w-16 rounded-full bg-[#D4AF37]" />
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1D3C42] md:text-4xl">
              Our Story
            </h2>
            <p className="mt-5 leading-relaxed text-[#7A6262]">
              The Little Patisserie was born in Chennai from a love for
              beautifully crafted desserts. Every cake, cupcake, and brownie is
              handcrafted in small batches using premium ingredients — because
              we believe the best desserts are made with care, not shortcuts.
            </p>
            <p className="mt-4 leading-relaxed text-[#7A6262]">
              Whether you are celebrating a birthday, a milestone, or just
              treating yourself, we bring thoughtful sweetness to every
              occasion — with the warmth of a home bakery.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-white"
            >
              About Us
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom pane — USP Badges */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className="rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-[#F4CFC8] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFF8E4]">
                <usp.icon size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#1D3C42]">
                {usp.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#7A6262]">
                {usp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

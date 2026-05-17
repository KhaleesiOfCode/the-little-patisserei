"use client";

import { Heart, Sun, Star, Sparkles } from "lucide-react";

const usps = [
  {
    icon: Sun,
    title: "Freshly Baked Daily",
    desc: "Did you know we bake everything fresh, only on order? Yes, we make every dessert specifically with the person receiving it in mind. Your dessert isn&apos;t just one among hundreds. It&apos;s the one made just for you.",
  },
  {
    icon: Heart,
    title: "Egg & Eggless Options",
    desc: "Egg based or Egg free desserts, the magic stays the same that you&apos;ll hardly know the difference.",
  },
  {
    icon: Star,
    title: "Quality Over Anything",
    desc: "We believe a dessert is only as good as the ingredients that go into it, which is why compromising on quality is something we simply cannot do. Anything that doesn&apos;t satisfy us in taste, texture, or quality never leaves our kitchen.",
  },
  {
    icon: Sparkles,
    title: "Custom Creations",
    desc: "We create celebration cakes that don&apos;t just carry your name, they tell your story. ❤️",
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
              Behind The Little Patisserie is just a girl from Chennai with a big love for French pastries,
              warm desserts, and making people smile through food. Coming from a family of food lovers,
              good food was always a given. But baking? That was never the plan.
            </p>
            <p className="mt-4 leading-relaxed text-[#7A6262]">
              It started with a TV show during my 12th grade holidays, a few YouTube rabbit holes, and a
              lot of trial and error in the kitchen. Somewhere along the way, what began as curiosity turned
              into a quiet obsession, and then, six years into a corporate career, I had to make a choice.
            </p>
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

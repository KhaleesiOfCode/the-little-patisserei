"use client";

import { Heart, Sun, Star, Sparkles } from "lucide-react";

const usps = [
  {
    icon: Sun,
    title: "Freshly Baked Daily",
    desc: "Did you know we bake everything fresh, only on order? Yes, we make every dessert specifically with the person receiving it in mind. Your dessert isn&apos;t just one among hundreds. It's the one made just for you.",
  },
  {
    icon: Heart,
    title: "Egg & Eggless Options",
    desc: "Egg based or Egg free desserts, the magic stays the same that you'll hardly know the difference.",
  },
  {
    icon: Star,
    title: "Quality Over Anything",
    desc: "We believe a dessert is only as good as the ingredients that go into it, which is why compromising on quality is something we simply cannot do. Anything that doesn't satisfy us in taste, texture, or quality never leaves our kitchen.",
  },
  {
    icon: Sparkles,
    title: "Custom Creations",
    desc: "We create celebration cakes that don't just carry your name, they tell your story. ❤️",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-[#FFF8E4] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* Brand Story — horizontal frame */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ring-[#F4CFC8] md:rounded-[3rem]">
          <div className="grid md:grid-cols-5">
            <div className="relative min-h-[300px] overflow-hidden md:col-span-2 md:min-h-full">
              <img
                src="/gallery/cake-15.jpg"
                alt="Handcrafted cake at The Little Patisserie"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
            </div>

            <div className="flex flex-col justify-center px-6 py-8 md:col-span-3 md:px-12 md:py-14">
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-8 rounded-full bg-[#D4AF37]" />
                <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Our Story</span>
              </div>
              <h2 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold leading-tight text-[#1D3C42]">
                A Girl, a TV Show, and a
                <span className="text-[#D4AF37]"> Sweet Obsession</span>
              </h2>
              <div className="mt-4 space-y-3 leading-7 text-[#7A6262] md:text-[16.5px] md:leading-8">
                <p>
                  Behind The Little Patisserie is just a girl from Chennai with a big love for French pastries,
                  warm desserts, and making people smile through food. Coming from a family of food lovers,
                  the obsession with good food was always there, but baking? That was something
                  completely new.
                </p>
                <p>
                  The Little Patisserie began with a moment that seemed small at the time,
                  but quietly changed everything. During my 12th grade holidays, I came across <em>A Cake Show</em>
                  by Yolanda Gampp, it sparked something in me that shines bright even today.
                </p>
                <p>
                  Inspiration slowly turned into aspiration. I began learning through YouTube videos, baking shows,
                  and trial, teaching myself one step at a time. Soon, I was baking cakes for
                  family, friends, and honestly, for anyone whose birthday came around.
                </p>
                <p>
                  Six years in the corporate world, I finally understood where I truly belonged. Food has always been
                  the most meaningful part of my life, and that love led me here, to all of you.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-4 border-t border-[#F4CFC8] pt-4">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-[#D4AF37]/20 ring-2 ring-white" />
                  <div className="h-8 w-8 rounded-full bg-[#1D3C42]/10 ring-2 ring-white" />
                  <div className="h-8 w-8 rounded-full bg-[#F4CFC8] ring-2 ring-white" />
                </div>
                <p className="text-xs italic text-[#7A6262] sm:text-[13px]">
                  &ldquo;We don't just bake desserts. We create moments worth remembering.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USP Badges */}
      <div className="mx-auto mt-10 max-w-7xl px-5">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className="group relative rounded-2xl bg-white pb-7 pl-6 pr-6 pt-14 shadow-sm ring-1 ring-[#F4CFC8] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute left-6 top-0 h-1 w-10 rounded-full bg-[#D4AF37] opacity-0 transition group-hover:opacity-100" />
              <div className="absolute left-6 top-0 h-1 w-6 rounded-full bg-[#D4AF37]/40 transition group-hover:opacity-0" />
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#FFF8E4] to-[#FFF8E4] shadow-sm ring-1 ring-[#D4AF37]/10 transition group-hover:from-[#D4AF37]/10 group-hover:to-[#FFF8E4] group-hover:ring-[#D4AF37]/30">
                <usp.icon size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1D3C42]">
                {usp.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[#7A6262]">
                {usp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

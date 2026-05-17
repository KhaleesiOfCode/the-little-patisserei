"use client";

import Link from "next/link";

const CAKE_THUMBS = [
  "/cakes/chocolate-cake-1.jpg",
  "/cakes/chocolate-cake-2.jpg",
  "/cakes/chocolate-cake-3.jpg",
  "/cakes/mango-cake.jpg",
  "/cakes/strawberry-pastry.jpg",
];

export default function CustomCakeSignature() {
  return (
    <section className="bg-[#FFF8E4] px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/cakes/chocolate-cake-1.jpg"
              alt="Custom celebration cake"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="inline-block rounded-full bg-[#D4AF37]/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Our Signature
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight text-[#1D3C42]">
              Custom Cakes <span className="text-[#D4AF37]">—</span> Where It All Began
            </h2>
            <p className="mt-5 leading-7 text-[#7A6262] sm:text-[16.5px]">
              Every cake is designed from scratch, hand-decorated, and made just
              for your celebration — whether it&apos;s a birthday, anniversary,
              or a moment worth frosting.
            </p>
            <Link
              href="/custom-cake"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#163136] hover:-translate-y-0.5"
            >
              Design Your Custom Cake
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-5 gap-3 md:gap-4">
          {CAKE_THUMBS.map((src, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CakeSlice, Heart, Award, Sparkles, MessageCircle, MapPin, Package, Truck, Clock, Camera, Mail } from "lucide-react";

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

const contactCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp Orders",
    content: "+91 94884 07130",
    note: "Tap a button above to start a chat",
  },
  {
    icon: Sparkles,
    title: "Custom Cake Enquiries",
    content: "Share your cake size, flavour, theme, and reference image on WhatsApp.",
  },
  {
    icon: MapPin,
    title: "Service Area",
    content: "Chennai and selected nearby locations",
  },
  {
    icon: Package,
    title: "Pickup",
    content: "Available by appointment only",
  },
  {
    icon: Truck,
    title: "Delivery",
    content: "Available based on location and order type",
  },
  {
    icon: Clock,
    title: "Order Notice",
    content: "Regular menu items: 24 hours preferred\nCustom cakes: 48 hours or more preferred",
  },
  {
    icon: Camera,
    title: "Instagram",
    content: "Follow us for daily bakes and updates",
    action: { label: "Follow on Instagram", href: "https://instagram.com/thelittlepatisserie" },
  },
  {
    icon: Mail,
    title: "Email",
    content: "For enquiries and custom orders",
    action: { label: "hello@thelittlepatisserie.com", href: "mailto:hello@thelittlepatisserie.com" },
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
          {/* About section */}
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

          {/* Features */}
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

          {/* Contact section */}
          <div id="contact" className="mx-auto mt-20 max-w-4xl">
            <div className="mx-auto h-1 w-16 rounded-full bg-[#D4AF37]" />
            <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Get in Touch
            </p>
            <h2 className="mt-4 text-center font-display text-3xl font-bold text-[#1D3C42] md:text-4xl">
              Let&apos;s Make Your{" "}
              <span className="text-[#D4AF37]">Celebration Sweeter</span>
            </h2>

            <div className="mx-auto mt-6 max-w-2xl text-center">
              <p className="text-[15px] leading-8 text-[#7A6262]">
                Have a question, want to place an order, or planning a custom cake? Reach out to us on WhatsApp and we&apos;ll help you choose the right cake, flavour, size, and design for your occasion.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-[#1D3C42] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#D4AF37]/90 hover:shadow-xl"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to enquire about a custom celebration cake.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-white px-8 py-3.5 text-sm font-bold text-[#1D3C42] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8E4] hover:shadow-lg"
              >
                <Sparkles size={18} />
                Custom Cake Enquiry
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#163136] hover:shadow-xl"
              >
                View Menu
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-[#F4CFC8] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg md:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FFF8E4] ring-1 ring-[#D4AF37]/20 transition group-hover:bg-[#D4AF37]/10">
                      <card.icon size={20} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-[#1D3C42]">{card.title}</h3>
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#7A6262]">{card.content}</p>
                      {"note" in card && card.note && (
                        <p className="mt-1 text-xs text-[#7A6262]/60">{card.note}</p>
                      )}
                      {"action" in card && card.action && (
                        <a
                          href={card.action.href}
                          target={card.action.href.startsWith("http") ? "_blank" : undefined}
                          rel={card.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-2 inline-block text-sm font-bold text-[#1D3C42] underline-offset-2 transition hover:underline"
                        >
                          {card.action.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles, MapPin, Clock, Package, Truck, Camera, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "919488407130";

export const metadata: Metadata = {
  title: "Contact Us | The Little Patisserie",
  description: "Reach out to The Little Patisserie for custom cakes, orders, and enquiries. WhatsApp-first contact for a home-based bakery in Chennai.",
};

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
    content: "Share your cake size, flavour, theme, date, and reference image on WhatsApp.",
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#F4CFC8]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto h-1 w-16 rounded-full bg-[#D4AF37]" />
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Get in Touch
          </p>
          <h1 className="mt-4 text-center font-display text-4xl font-bold leading-tight text-[#1D3C42] md:text-5xl">
            Let&apos;s Make Your{" "}
            <span className="text-[#D4AF37]">Celebration Sweeter</span>
          </h1>

          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-[15px] leading-8 text-[#7A6262]">
              Have a question, want to place an order, or planning a custom cake? Reach out to us on WhatsApp and we&apos;ll help you choose the right cake, flavour, size, and design for your occasion.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#7A6262]/80">
              Since every order is freshly prepared, we recommend placing your order at least 24–48 hours in advance.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
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

          <div className="mx-auto mt-16 grid gap-6 md:grid-cols-2">
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
      </section>
    </main>
  );
}

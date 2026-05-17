"use client";

import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "919488407130";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1D3C42] px-5 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-bold tracking-wide">
              The Little Patisserie
            </h3>
            <p className="mt-0.5 text-xs italic tracking-wide text-[#D4AF37]">
              true to the flavours
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Handcrafted cakes, pastries, and desserts made fresh with love
              for every celebration.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14px] text-white/70 transition hover:text-white"
                >
                  <MessageCircle size={14} />
                  +91 94884 07130
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@thelittlepatisserie.com"
                  className="flex items-center gap-2 text-[14px] text-white/70 transition hover:text-white"
                >
                  <Mail size={14} />
                  hello@thelittlepatisserie.com
                </a>
              </li>
              <li className="text-[14px] text-white/70">
                Chennai, Tamil Nadu
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/menu" className="text-[14px] text-white/70 transition hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[14px] text-white/70 transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[14px] text-white/70 transition hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/custom-cake" className="text-[14px] text-white/70 transition hover:text-white">
                  Custom Cake
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Follow Us
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/thelittle_patisserie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14px] text-white/70 transition hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  @thelittlepatisserie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-[14px] text-white/50">
            &copy; {year} The Little Patisserie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import HeroBanner from "../components/HeroBanner";
import CategoriesSection from "../components/CategoriesSection";
import BestSellersSection from "../components/BestSellersSection";
import CustomCakeSignature from "../components/CustomCakeSignature";
import AboutSection from "../components/AboutSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <HeroBanner />
      <CategoriesSection />
      <BestSellersSection />
      <CustomCakeSignature />
      <AboutSection />
    </main>
  );
}

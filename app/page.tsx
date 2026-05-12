"use client";

import HeroBanner from "../components/HeroBanner";
import CategoriesSection from "../components/CategoriesSection";
import BestSellersSection from "../components/BestSellersSection";
import GallerySection from "../components/GallerySection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <HeroBanner />
      <CategoriesSection />
      <BestSellersSection />
      <GallerySection />
    </main>
  );
}

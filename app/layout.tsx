import type { Metadata } from "next";
import { Fraunces, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../components/CartContext";
import AdminAwareNavbar from "../components/AdminAwareNavbar";
import Footer from "../components/Footer";
import LayoutWrapper from "../components/LayoutWrapper";
import RouteLoader from "../components/RouteLoader";
import ErrorBoundary from "../components/ErrorBoundary";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: { default: "The Little Patisserie", template: "%s | The Little Patisserie" },
  description: "Artisan bakery in Chennai crafting premium celebration cakes, pastries, and custom bakes. Freshly made to order with premium ingredients. Delivery across Chennai & South India.",
  openGraph: {
    title: "The Little Patisserie",
    description: "Artisan bakery in Chennai crafting premium celebration cakes, pastries, and custom bakes.",
    url: "https://thelittlepatisserie.com",
    siteName: "The Little Patisserie",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Little Patisserie",
    description: "Artisan bakery in Chennai crafting premium celebration cakes, pastries, and custom bakes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${quicksand.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Bakery",
              name: "The Little Patisserie",
              description: "Artisan bakery in Chennai crafting premium celebration cakes, pastries, and custom bakes.",
              url: "https://thelittlepatisserie.com",
              telephone: "+919488407130",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chennai",
                addressRegion: "Tamil Nadu",
                addressCountry: "IN",
              },
              openingHours: "Mo-Su 09:00-21:00",
            }),
          }}
        />
        <CartProvider>
          <RouteLoader />
          <AdminAwareNavbar />
          <ErrorBoundary>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Footer />
          </ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../components/CartContext";
import RouteLoader from "../components/RouteLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import SessionProvider from "../components/SessionProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "The Little Patisserie",
  description: "Premium cakes and pastries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>
        <CartProvider>
          <SessionProvider />
          <RouteLoader />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}

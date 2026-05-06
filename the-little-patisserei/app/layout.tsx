import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../components/CartContext";
import RouteLoader from "../components/RouteLoader";
import ErrorBoundary from "../components/ErrorBoundary";

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
    <html lang="en">
      <body>
        <CartProvider>
          <RouteLoader />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}
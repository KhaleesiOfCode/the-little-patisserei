"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BrandLoader from "./BrandLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <BrandLoader />
    </div>
  );
}
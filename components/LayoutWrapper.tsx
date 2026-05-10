"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  return (
    <div className={isAdmin ? "" : "pt-[68px] sm:pt-[76px]"}>
      {children}
    </div>
  );
}

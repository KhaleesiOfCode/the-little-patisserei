"use client";

import { useEffect } from "react";

export default function SessionProvider() {
  useEffect(() => {
    if (document.cookie.includes("__session=")) return;
    document.cookie = "__session=1; path=/; max-age=7200";
  }, []);

  return null;
}

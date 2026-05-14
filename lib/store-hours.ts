let cachedOpen = true;
let cachedReason = "";
let cachedClosesAt: string | null = null;
let cachedClosureType = "manual";

export function isOrderWindowOpen(): boolean {
  return cachedOpen;
}

export function getClosureReason(): string {
  return cachedReason;
}

export function getClosureEndTime(): string | null {
  return cachedClosesAt;
}

export function getClosureType(): string {
  return cachedClosureType;
}

function formatClosureEnd(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getFormattedClosureEnd(): string {
  return formatClosureEnd(cachedClosesAt);
}

export function getClosureEndMessage(): string {
  if (!cachedClosesAt) return "";
  const now = new Date();
  const end = new Date(cachedClosesAt);
  const timeStr = end.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  if (now.toDateString() === end.toDateString()) {
    return `today at ${timeStr}`;
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (end.toDateString() === tomorrow.toDateString()) {
    return `tomorrow at ${timeStr}`;
  }
  return getFormattedClosureEnd();
}

export async function refreshStoreStatus(): Promise<void> {
  try {
    const res = await fetch(`/api/store-status?_=${Date.now()}`);
    const data = await res.json();
    console.log("[store-hours] /api/store-status response:", res.status, data);
    if (!res.ok) {
      console.warn("[store-hours] Non-OK status, defaulting to open");
      cachedOpen = true;
    } else {
      cachedOpen = data.open !== false;
    }
    cachedReason = data.reason || "";
    cachedClosesAt = data.closesAt || null;
    cachedClosureType = data.closureType || "manual";
  } catch (err) {
    console.error("[store-hours] /api/store-status fetch failed:", err);
    cachedOpen = true;
    cachedReason = "";
    cachedClosesAt = null;
    cachedClosureType = "manual";
  }
}

let cachedOpen = true;
let cachedReason = "";
let cachedClosesAt: string | null = null;

export function isOrderWindowOpen(): boolean {
  return cachedOpen;
}

export function getClosureReason(): string {
  return cachedReason;
}

export function getClosureEndTime(): string | null {
  return cachedClosesAt;
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

export async function refreshStoreStatus(): Promise<void> {
  try {
    const res = await fetch("/api/store-status");
    const data = await res.json();
    cachedOpen = data.open !== false;
    cachedReason = data.reason || "";
    cachedClosesAt = data.closesAt || null;
  } catch {
    cachedOpen = true;
    cachedReason = "";
    cachedClosesAt = null;
  }
}

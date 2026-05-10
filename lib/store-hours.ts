const OPEN_HOUR = 7;
const CLOSE_HOUR = 20;
const TIMEZONE = "Asia/Kolkata";

export function isOrderWindowOpen(): boolean {
  const now = new Date();
  const ist = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    hour12: false,
  }).format(now);
  const hour = parseInt(ist, 10);
  return !isNaN(hour) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

export interface SlotInfo {
  earliestDate: Date;
  earliestHour: number;
  hasTypeB: boolean;
  prepLabel: string;
}

const SLOTS = [
  { value: "9AM-12PM", label: "9 AM - 12 PM", startHour: 9 },
  { value: "12PM-3PM", label: "12 PM - 3 PM", startHour: 12 },
  { value: "3PM-6PM", label: "3 PM - 6 PM", startHour: 15 },
  { value: "6PM-9PM", label: "6 PM - 9 PM", startHour: 18 },
];

export function isTypeBProduct(category: string): boolean {
  const lower = category.toLowerCase().trim();
  return lower.includes("celebration") || lower.includes("custom");
}

export function cartHasTypeB(cartItems: { category: string }[]): boolean {
  return cartItems.some((item) => isTypeBProduct(item.category));
}

export function getSlotInfo(cartItems: { category: string }[]): SlotInfo {
  const hasTypeB = cartHasTypeB(cartItems);
  const now = new Date();
  const hour = now.getHours();

  let daysToAdd: number;
  let earliestHour: number;

  if (hasTypeB) {
    if (hour >= 8 && hour < 15) {
      daysToAdd = 2;
      earliestHour = 10;
    } else {
      daysToAdd = 2;
      earliestHour = 13;
    }
  } else {
    if (hour >= 8 && hour < 15) {
      daysToAdd = 1;
      earliestHour = 12;
    } else {
      daysToAdd = 1;
      earliestHour = 16;
    }
  }

  const earliestDate = new Date(now);
  earliestDate.setDate(earliestDate.getDate() + daysToAdd);
  earliestDate.setHours(0, 0, 0, 0);

  const prepLabel = hasTypeB ? "48 hrs prep" : "24 hrs prep";

  return { earliestDate, earliestHour, hasTypeB, prepLabel };
}

export function getAvailableSlots(
  selectedDate: string,
  earliestDate: Date,
  earliestHour: number,
): { value: string; label: string }[] {
  if (!selectedDate) return SLOTS;

  const selected = new Date(selectedDate + "T00:00:00");
  const earliest = new Date(earliestDate);
  earliest.setHours(0, 0, 0, 0);

  if (selected.getTime() > earliest.getTime()) {
    return SLOTS;
  }

  return SLOTS.filter((slot) => slot.startHour >= earliestHour);
}

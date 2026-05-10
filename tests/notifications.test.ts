import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

vi.mock("@/lib/supabase/client", () => {
  const from = vi.fn();
  return { supabase: { from } };
});

const mockSupabase = await import("@/lib/supabase/client");
const { sendOrderConfirmation } = await import("@/lib/notifications");

describe("sendOrderConfirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true and logs confirmation for valid order", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderChain: Record<string, any> = {};
    orderChain.select = vi.fn(() => orderChain);
    orderChain.eq = vi.fn(() => orderChain);
    orderChain.single = vi.fn(() => Promise.resolve({
      data: { id: "1", order_number: "ORD-123", customer_name: "Test", customer_phone: "9876543210", delivery_mode: "pickup" },
      error: null,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsChain: Record<string, any> = {};
    itemsChain.select = vi.fn(() => itemsChain);
    itemsChain.eq = vi.fn(() => Promise.resolve({ data: [{ id: "item-1" }], error: null }));

    (mockSupabase.supabase.from as unknown as Mock)
      .mockReturnValueOnce(orderChain)
      .mockReturnValueOnce(itemsChain);

    const result = await sendOrderConfirmation("1");
    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[NOTIFICATION] Order confirmed: ORD-123",
      expect.objectContaining({ customer: "Test" })
    );
    consoleSpy.mockRestore();
  });

  it("returns false when order is not found", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain: Record<string, any> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
    chain.single = vi.fn(() => Promise.resolve({ data: null, error: null }));
    (mockSupabase.supabase.from as unknown as Mock).mockReturnValue(chain);

    const result = await sendOrderConfirmation("nonexistent");
    expect(result).toBe(false);
  });

  it("returns false on exception", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (mockSupabase.supabase.from as unknown as Mock).mockImplementation(() => {
      throw new Error("Network error");
    });

    const result = await sendOrderConfirmation("1");
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

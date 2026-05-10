import { describe, it, expect, vi, beforeEach } from "vitest";
import type { OrderFormData } from "@/types/menu";

function createMockForm(overrides: Partial<OrderFormData> = {}): OrderFormData {
  return {
    deliveryMode: "pickup",
    name: "Test User",
    phone: "9876543210",
    email: "test@example.com",
    addressLine1: "123 Test St",
    addressLine2: "",
    city: "Chennai",
    state: "Tamil Nadu",
    district: "Chengalpattu",
    pincode: "600106",
    landmark: "",
    deliveryDate: "",
    deliverySlot: "",
    instructions: "",
    pickupDate: "2026-05-15",
    pickupSlot: "10:00-12:00",
    receiverName: "",
    receiverPhone: "",
    alternatePhone: "",
    courierAddress: "",
    courierNotes: "",
    confirmCourierRisk: false,
    ...overrides,
  };
}

// Shared mock chain
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chain: Record<string, any> = {};
chain.select = vi.fn(() => chain);
chain.eq = vi.fn(() => chain);
chain.order = vi.fn(() => chain);
chain.single = vi.fn();
chain.insert = vi.fn(() => ({
  select: vi.fn(() => ({
    single: vi.fn(),
  })),
  error: null,
}));
chain.update = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null })),
}));

vi.mock("@/lib/supabase/client", () => {
  const from = vi.fn(() => chain);
  return { supabase: { from } };
});

const { createOrder, getOrders, updateDeliveryFee, updateCourierInfo, requestDateChange, cancelOrderByUser, updateBakerNotes, getOrderByNumber, getOrderById } = await import("@/lib/supabase/orders");

const items = [{ name: "Test Cake", price: 500, qty: 2, quantityLabel: "500g" }];

describe("createOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a pickup order successfully", async () => {
    const fakeOrder = { id: "order-1", order_number: "ORD-TEST" };
    const single = vi.fn(() => Promise.resolve({ data: fakeOrder, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "pickup" }),
      items, 1000, 0, null
    );

    expect(result).toEqual(fakeOrder);
    expect(chain.insert).toHaveBeenCalled();
    const payload = chain.insert.mock.calls[0][0];
    expect(payload.delivery_mode).toBe("pickup");
    expect(payload.delivery_fee).toBe(0);
    expect(payload.delivery_fee_status).toBe("included");
    expect(payload.pickup_date).toBe("2026-05-15");
    expect(payload.city).toBe("Chennai");
    expect(payload.status).toBe("order_received");
  });

  it("creates a local delivery order for Chennai", async () => {
    const fakeOrder = { id: "order-2" };
    const single = vi.fn(() => Promise.resolve({ data: fakeOrder, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "local_delivery", city: "Chennai", pincode: "600106" }),
      items, 1000, 50, "zone_a"
    );

    expect(result).toEqual(fakeOrder);
    const payload = chain.insert.mock.calls[0][0];
    expect(payload.delivery_mode).toBe("local_delivery");
    expect(payload.delivery_fee).toBe(50);
    expect(payload.delivery_fee_status).toBe("zone");
    expect(payload.delivery_type).toBe("chennai");
  });

  it("creates a local delivery order outside Chennai", async () => {
    const single = vi.fn(() => Promise.resolve({ data: { id: "order-3" }, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "local_delivery", city: "Bangalore", pincode: "560001" }),
      items, 1000, 50, null
    );

    expect(result).not.toBeNull();
    const payload = chain.insert.mock.calls[0][0];
    expect(payload.delivery_type).toBe("outside_chennai");
  });

  it("creates a courier order with calculated fee", async () => {
    const single = vi.fn(() => Promise.resolve({ data: { id: "order-4" }, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({
        deliveryMode: "courier",
        city: "Bangalore",
        pincode: "560001",
        receiverName: "Receiver",
        receiverPhone: "9876543210",
        courierAddress: "456 Test Ave",
        confirmCourierRisk: true,
      }),
      items, 1000, 250, null, "zone_b", 500, "up to 0.5 kg", 0
    );

    expect(result).not.toBeNull();
    const payload = chain.insert.mock.calls[0][0];
    expect(payload.delivery_mode).toBe("courier");
    expect(payload.delivery_fee).toBe(250);
    expect(payload.delivery_fee_status).toBe("calculated");
    expect(payload.courier_zone).toBe("zone_b");
    expect(payload.total_courier_weight_grams).toBe(500);
    expect(payload.courier_weight_slab).toBe("up to 0.5 kg");
    expect(payload.fragile_surcharge).toBe(0);
    expect(payload.receiver_name).toBe("Receiver");
    expect(payload.confirm_courier_risk).toBe(true);
  });

  it("creates a courier order with pending fee confirmation", async () => {
    const single = vi.fn(() => Promise.resolve({ data: { id: "order-5" }, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "courier", city: "Bangalore" }),
      items, 1000, 0, null
    );

    expect(result).not.toBeNull();
    const payload = chain.insert.mock.calls[0][0];
    expect(payload.delivery_fee_status).toBe("pending_confirmation");
  });

  it("returns null when order insert fails", async () => {
    const single = vi.fn(() => Promise.resolve({ data: null, error: new Error("Insert failed") }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "pickup" }),
      items, 1000, 0, null
    );
    expect(result).toBeNull();
  });

  it("returns null when order insert returns no data", async () => {
    const single = vi.fn(() => Promise.resolve({ data: null, error: null }));
    chain.insert.mockReturnValue({
      select: vi.fn(() => ({ single })),
      error: null,
    });

    const result = await createOrder(
      createMockForm({ deliveryMode: "pickup" }),
      items, 1000, 0, null
    );
    expect(result).toBeNull();
  });
});

describe("getOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapped orders with items", async () => {
    const mockData = [
      { id: "1", order_number: "ORD-1", order_items: [{ id: "item-1", item_name: "Cake" }] },
    ];
    chain.order.mockResolvedValue({ data: mockData, error: null });

    const result = await getOrders();
    expect(result).toHaveLength(1);
    expect(result[0].items).toHaveLength(1);
  });

  it("returns empty array on error", async () => {
    chain.order.mockResolvedValue({ data: null, error: new Error("DB error") });

    const result = await getOrders();
    expect(result).toEqual([]);
  });
});

describe("updateDeliveryFee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
    chain.order = vi.fn(() => chain);
    chain.single = vi.fn();
    chain.insert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
      error: null,
    }));
    chain.update = vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    }));
  });

  it("updates delivery fee and recalculates total", async () => {
    chain.single
      .mockResolvedValueOnce({ data: { id: "1", subtotal: 1000 }, error: null })
      .mockResolvedValueOnce({ data: [{ id: "item-1" }], error: null });

    const result = await updateDeliveryFee("1", 150);
    expect(result).toBe(true);
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      delivery_fee: 150,
      total: 1150,
    }));
  });

  it("returns false when order not found", async () => {
    chain.single.mockResolvedValue({ data: null, error: null });

    const result = await updateDeliveryFee("nonexistent", 150);
    expect(result).toBe(false);
  });
});

describe("updateCourierInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
    chain.order = vi.fn(() => chain);
    chain.single = vi.fn();
    chain.insert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
      error: null,
    }));
    chain.update = vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    }));
  });

  it("updates courier info and recalculates total when charge > 0", async () => {
    chain.single
      .mockResolvedValueOnce({ data: { id: "1", subtotal: 1000 }, error: null })
      .mockResolvedValueOnce({ data: [{ id: "item-1" }], error: null });

    const result = await updateCourierInfo("1", {
      company: "Delhivery",
      tracking_number: "DX123",
      charge: 300,
    });
    expect(result).toBe(true);
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      courier_company: "Delhivery",
      courier_tracking_number: "DX123",
      delivery_fee_status: "confirmed",
      delivery_fee: 300,
      total: 1300,
    }));
  });

  it("returns false when order not found", async () => {
    chain.single.mockResolvedValue({ data: null, error: null });

    const result = await updateCourierInfo("nonexistent", { charge: 300 });
    expect(result).toBe(false);
  });
});

describe("requestDateChange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("appends date change note and updates status", async () => {
    chain.single.mockResolvedValue({ data: { notes: "Initial note", baker_notes: null }, error: null });

    const result = await requestDateChange("1", "2026-06-01", "10:00-12:00");
    expect(result).toBe(true);
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      status: "date_change_requested",
      baker_notes: expect.stringContaining("2026-06-01"),
    }));
    const updateArg = chain.update.mock.calls[0][0];
    expect(updateArg.notes).toContain("Initial note");
    expect(updateArg.notes).toContain("Date change requested");
  });
});

describe("cancelOrderByUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("appends cancellation note and updates status", async () => {
    chain.single.mockResolvedValue({ data: { notes: null, baker_notes: null }, error: null });

    const result = await cancelOrderByUser("1", "Changed mind");
    expect(result).toBe(true);
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      status: "cancelled",
      baker_notes: "CANCELLED BY CUSTOMER: Changed mind",
    }));
    const updateArg = chain.update.mock.calls[0][0];
    expect(updateArg.notes).toContain("Cancelled by customer: Changed mind");
  });
});

describe("updateBakerNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates baker_notes", async () => {
    const result = await updateBakerNotes("1", "Needs extra chocolate");
    expect(result).toBe(true);
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      baker_notes: "Needs extra chocolate",
    }));
  });
});

describe("getOrderByNumber / getOrderById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getOrderByNumber returns null on error", async () => {
    chain.single.mockResolvedValue({ data: null, error: new Error("Not found") });
    chain.order.mockResolvedValue({ data: [], error: null });

    const result = await getOrderByNumber("ORD-NONEXISTENT");
    expect(result).toBeNull();
  });

  it("getOrderById returns null on error", async () => {
    chain.single.mockResolvedValue({ data: null, error: new Error("Not found") });

    const result = await getOrderById("nonexistent");
    expect(result).toBeNull();
  });
});

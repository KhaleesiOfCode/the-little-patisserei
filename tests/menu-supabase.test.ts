import { describe, it, expect, vi, beforeEach } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chain: Record<string, any> = {};
chain.select = vi.fn(() => chain);
chain.eq = vi.fn(() => chain);
chain.order = vi.fn(() => chain);
chain.single = vi.fn();

vi.mock("@/lib/supabase/client", () => {
  const from = vi.fn(() => chain);
  return { supabase: { from } };
});

const { getNewLaunches, getMenuCategories } = await import("@/lib/supabase/menu");

function makeDbItem(overrides: Record<string, unknown> = {}) {
  return {
    id: "1",
    name: "Test Cake",
    description: "A test cake",
    food_type: "veg",
    keywords: ["Chocolate", "Best Seller"],
    ingredient_tags: ["Eggless"],
    shelf_life: "3 days",
    is_bestseller: false,
    is_new_launch: true,
    is_available: true,
    display_order: 1,
    category: [{ name: "Cakes" }],
    prices: [
      { quantity_label: "500g", price: 650, display_order: 1 },
      { quantity_label: "1kg", price: 1200, display_order: 2 },
    ],
    media: [
      { media_type: "image", url: "/img1.jpg", display_order: 2 },
      { media_type: "image", url: "/img2.jpg", display_order: 1 },
      { media_type: "video", url: "/video.mp4", display_order: 1 },
    ],
    ...overrides,
  };
}

describe("getNewLaunches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns deduplicated transformed items on success", async () => {
    const mockData = [makeDbItem(), makeDbItem({ id: "2", name: "Another Cake" })];
    chain.order.mockResolvedValue({ data: mockData, error: null });

    const result = await getNewLaunches();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Test Cake");
    expect(result[0].badges).toContain("New Launch");
    expect(result[0].badges).toContain("Best Seller");
    expect(result[0].image).toBe("/img2.jpg");
    expect(result[0].prices).toHaveLength(2);
    expect(result[0].prices[0].price).toBe(650);
    expect(result[0].keywords).toContain("Chocolate");
  });

  it("returns empty array on error", async () => {
    chain.order.mockResolvedValue({ data: null, error: new Error("DB error") });

    const result = await getNewLaunches();
    expect(result).toEqual([]);
  });

  it("returns empty array when data is empty", async () => {
    chain.order.mockResolvedValue({ data: [], error: null });

    const result = await getNewLaunches();
    expect(result).toEqual([]);
  });

  it("deduplicates items with same name", async () => {
    const mockData = [makeDbItem(), makeDbItem({ id: "2" })];
    chain.order.mockResolvedValue({ data: mockData, error: null });

    const result = await getNewLaunches();
    expect(result).toHaveLength(1);
  });
});

describe("getMenuCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("groups items by category", async () => {
    const mockData = [
      makeDbItem({ id: "1", name: "Cake A", category: [{ name: "Cakes" }], is_new_launch: false }),
      makeDbItem({ id: "2", name: "Cake B", category: [{ name: "Cakes" }], is_new_launch: false }),
      makeDbItem({ id: "3", name: "Pastry A", category: [{ name: "Pastries" }], is_new_launch: false }),
    ];
    chain.order.mockResolvedValue({ data: mockData, error: null });

    const result = await getMenuCategories();
    expect(result).toHaveLength(2);
    const cakes = result.find((c) => c.name === "Cakes");
    expect(cakes?.items).toHaveLength(2);
    const pastries = result.find((c) => c.name === "Pastries");
    expect(pastries?.items).toHaveLength(1);
  });

  it("returns empty array on error", async () => {
    chain.order.mockResolvedValue({ data: null, error: new Error("DB error") });

    const result = await getMenuCategories();
    expect(result).toEqual([]);
  });

  it("returns empty array when data is empty", async () => {
    chain.order.mockResolvedValue({ data: [], error: null });

    const result = await getMenuCategories();
    expect(result).toEqual([]);
  });
});

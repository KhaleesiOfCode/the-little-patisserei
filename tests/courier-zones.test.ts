import { describe, it, expect } from "vitest";
import {
  normalizeDistrict,
  getCourierZone,
  getWeightSlab,
  estimateItemWeight,
  calculateCourierCharge,
  getCourierMessage,
} from "@/lib/delivery/courierZones";

describe("normalizeDistrict", () => {
  it("normalizes trichy to Tiruchirappalli", () => {
    expect(normalizeDistrict("trichy")).toBe("Tiruchirappalli");
  });

  it("normalizes bangalore to Bengaluru Urban", () => {
    expect(normalizeDistrict("bangalore")).toBe("Bengaluru Urban");
  });

  it("normalizes coimbatore (lowercase) to Coimbatore", () => {
    expect(normalizeDistrict("coimbatore")).toBe("Coimbatore");
  });

  it("is case insensitive", () => {
    expect(normalizeDistrict("Trichy")).toBe("Tiruchirappalli");
    expect(normalizeDistrict("TRICHY")).toBe("Tiruchirappalli");
  });

  it("returns input trimmed for unknown district", () => {
    expect(normalizeDistrict("UnknownPlace")).toBe("UnknownPlace");
  });

  it("handles leading/trailing whitespace", () => {
    expect(normalizeDistrict("  trichy  ")).toBe("Tiruchirappalli");
  });
});

describe("getCourierZone", () => {
  it("returns zone_a for nearby districts", () => {
    const zone = getCourierZone("Tamil Nadu", "Chengalpattu");
    expect(zone.key).toBe("zone_a");
  });

  it("returns unknown for non-existent district", () => {
    const zone = getCourierZone("Tamil Nadu", "FictionalDistrict");
    expect(zone.key).toBe("unknown");
  });

  it("returns unknown for non-existent state", () => {
    const zone = getCourierZone("NonExistent", "Madurai");
    expect(zone.key).toBe("unknown");
  });
});

describe("getWeightSlab", () => {
  it("returns mini for 500g or less", () => {
    expect(getWeightSlab(0).key).toBe("mini");
    expect(getWeightSlab(250).key).toBe("mini");
    expect(getWeightSlab(500).key).toBe("mini");
  });

  it("returns small for 501-1000g", () => {
    expect(getWeightSlab(501).key).toBe("small");
    expect(getWeightSlab(1000).key).toBe("small");
  });

  it("returns medium for 1001-2000g", () => {
    expect(getWeightSlab(1001).key).toBe("medium");
    expect(getWeightSlab(2000).key).toBe("medium");
  });

  it("returns large for 2001-5000g", () => {
    expect(getWeightSlab(2001).key).toBe("large");
    expect(getWeightSlab(5000).key).toBe("large");
  });

  it("returns oversize for over 5000g", () => {
    const slab = getWeightSlab(5001);
    expect(slab.key).toBe("oversize");
    expect(slab.label).toBe("over 5 kg");
  });
});

describe("estimateItemWeight", () => {
  it("returns courierWeightGrams when provided", () => {
    expect(estimateItemWeight("500g", 350)).toBe(350);
  });

  it("returns 500g for 500g label", () => {
    expect(estimateItemWeight("500g", undefined)).toBe(500);
  });

  it("returns 1000g for 1kg label", () => {
    expect(estimateItemWeight("1kg", null)).toBe(1000);
  });

  it("returns 2000g for 2kg label", () => {
    expect(estimateItemWeight("2 kg", undefined)).toBe(2000);
  });

  it("returns 500g for box of 12", () => {
    expect(estimateItemWeight("Box of 12", undefined)).toBe(500);
  });

  it("returns 250g for single/piece", () => {
    expect(estimateItemWeight("Single", undefined)).toBe(250);
    expect(estimateItemWeight("Piece", undefined)).toBe(250);
  });

  it("returns 1000g default for unknown labels", () => {
    expect(estimateItemWeight("Custom Cake", undefined)).toBe(1000);
  });

  it("returns 1000g default for undefined label", () => {
    expect(estimateItemWeight(undefined, undefined)).toBe(1000);
  });
});

describe("calculateCourierCharge", () => {
  const singleItem = [{ quantityLabel: "500g", courierWeightGrams: null, courierFragile: false }];
  const fragileItem = [{ quantityLabel: "500g", courierWeightGrams: null, courierFragile: true }];
  const singleQty = [1];

  it("returns manual_confirmation when district is empty", () => {
    const result = calculateCourierCharge(singleItem, singleQty, "Tamil Nadu", "");
    expect(result.courier_fee_status).toBe("manual_confirmation");
    expect(result.message).toContain("select your state and district");
  });

  it("returns manual_confirmation when state is empty", () => {
    const result = calculateCourierCharge(singleItem, singleQty, "", "Chengalpattu");
    expect(result.courier_fee_status).toBe("manual_confirmation");
    expect(result.message).toContain("select your state");
  });

  it("returns manual_confirmation for unknown zone", () => {
    const result = calculateCourierCharge(singleItem, singleQty, "Tamil Nadu", "FictionalDistrict");
    expect(result.courier_fee_status).toBe("manual_confirmation");
    expect(result.courier_zone).toBe("unknown");
  });

  it("returns manual_confirmation for oversize items", () => {
    const heavyItems = [{ quantityLabel: "custom", courierWeightGrams: 6000, courierFragile: false }];
    const result = calculateCourierCharge(heavyItems, [1], "Tamil Nadu", "Chengalpattu");
    expect(result.courier_fee_status).toBe("manual_confirmation");
    expect(result.courier_weight_slab).toBe("over 5 kg");
  });

  it("calculates charge for zone_a mini slab", () => {
    const result = calculateCourierCharge(singleItem, singleQty, "Tamil Nadu", "Chengalpattu");
    expect(result.courier_fee_status).toBe("calculated");
    expect(result.courier_zone).toBe("zone_a");
    expect(result.courier_weight_slab).toBe("up to 0.5 kg");
    expect(result.courier_charge).toBe(120);
  });

  it("adds fragile surcharge for fragile items", () => {
    const result = calculateCourierCharge(fragileItem, singleQty, "Tamil Nadu", "Chengalpattu");
    expect(result.fragile_surcharge).toBe(150);
    expect(result.courier_charge).toBe(120 + 150);
    expect(result.message).toContain("₹150 fragile packaging");
  });

  it("calculates weight from quantities", () => {
    const items = [{ quantityLabel: "500g", courierWeightGrams: null, courierFragile: false }];
    const result = calculateCourierCharge(items, [3], "Tamil Nadu", "Chengalpattu");
    // 500g * 3 = 1500g -> medium slab
    expect(result.courier_weight_slab).toBe("up to 2 kg");
    expect(result.courier_charge).toBe(280);
  });

  it("handles multiple items contributing to total weight", () => {
    const items = [
      { quantityLabel: "500g", courierWeightGrams: null, courierFragile: false },
      { quantityLabel: "1kg", courierWeightGrams: null, courierFragile: false },
    ];
    const result = calculateCourierCharge(items, [1, 1], "Tamil Nadu", "Chengalpattu");
    // 500g + 1000g = 1500g -> medium slab
    expect(result.courier_weight_slab).toBe("up to 2 kg");
  });
});

describe("getCourierMessage", () => {
  it("returns result.message", () => {
    const result = calculateCourierCharge(
      [{ quantityLabel: "500g", courierWeightGrams: null, courierFragile: false }],
      [1],
      "",
      ""
    );
    expect(getCourierMessage(result)).toBe(result.message);
  });
});

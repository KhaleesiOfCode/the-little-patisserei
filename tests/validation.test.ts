import { describe, it, expect } from "vitest";

describe("Pincode validation", () => {
  it("accepts South Indian pincodes (starts with 5 or 6)", () => {
    expect(/^[56]\d{5}$/.test("600001")).toBe(true);
    expect(/^[56]\d{5}$/.test("560001")).toBe(true);
    expect(/^[56]\d{5}$/.test("500001")).toBe(true);
    expect(/^[56]\d{5}$/.test("695001")).toBe(true);
  });

  it("rejects non-South-Indian pincodes", () => {
    expect(/^[56]\d{5}$/.test("110001")).toBe(false);
    expect(/^[56]\d{5}$/.test("400001")).toBe(false);
    expect(/^[56]\d{5}$/.test("700001")).toBe(false);
    expect(/^[56]\d{5}$/.test("391000")).toBe(false);
  });

  it("rejects invalid lengths", () => {
    expect(/^[56]\d{5}$/.test("600")).toBe(false);
    expect(/^[56]\d{5}$/.test("6000010")).toBe(false);
    expect(/^[56]\d{5}$/.test("")).toBe(false);
  });
});

describe("Phone validation", () => {
  it("validates 10-digit phone numbers", () => {
    expect("9876543210".replace(/\D/g, "").length === 10).toBe(true);
  });

  it("rejects short numbers", () => {
    expect("987654321".replace(/\D/g, "").length === 10).toBe(false);
  });
});

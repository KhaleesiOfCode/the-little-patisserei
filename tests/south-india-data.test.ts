import { describe, it, expect } from "vitest";
import {
  getCitiesForDistrict,
  getStateForDistrict,
  getDistrictsForState,
  getZoneForDistrict,
  SOUTH_INDIA_STATES,
} from "@/lib/delivery/southIndiaData";

describe("getCitiesForDistrict", () => {
  it("returns known cities for Tamil Nadu::Chengalpattu", () => {
    const cities = getCitiesForDistrict("Tamil Nadu", "Chengalpattu");
    expect(cities).toContain("Chengalpattu");
    expect(cities).toContain("Tambaram");
  });

  it("returns fallback with district name for unknown entry", () => {
    const cities = getCitiesForDistrict("Tamil Nadu", "UnknownDistrict");
    expect(cities).toEqual(["UnknownDistrict"]);
  });
});

describe("getStateForDistrict", () => {
  it("returns Tamil Nadu for Madurai", () => {
    expect(getStateForDistrict("Madurai")).toBe("Tamil Nadu");
  });

  it("is case insensitive", () => {
    expect(getStateForDistrict("madurai")).toBe("Tamil Nadu");
    expect(getStateForDistrict("MADURAI")).toBe("Tamil Nadu");
  });

  it("returns null for unknown district", () => {
    expect(getStateForDistrict("UnknownDistrict")).toBeNull();
  });

  it("returns Karnataka for Bengaluru Urban", () => {
    expect(getStateForDistrict("Bengaluru Urban")).toBe("Karnataka");
  });
});

describe("getDistrictsForState", () => {
  it("returns districts for Tamil Nadu", () => {
    const districts = getDistrictsForState("Tamil Nadu");
    expect(districts.length).toBeGreaterThan(0);
    expect(districts.map((d) => d.name)).toContain("Chengalpattu");
  });

  it("is case insensitive", () => {
    const districts = getDistrictsForState("tamil nadu");
    expect(districts.length).toBeGreaterThan(0);
  });

  it("returns empty array for unknown state", () => {
    expect(getDistrictsForState("Unknown State")).toEqual([]);
  });
});

describe("getZoneForDistrict", () => {
  it("returns zone_a for nearby Chennai districts", () => {
    expect(getZoneForDistrict("Tamil Nadu", "Chengalpattu")).toBe("zone_a");
    expect(getZoneForDistrict("Tamil Nadu", "Kanchipuram")).toBe("zone_a");
  });

  it("returns zone_b for mid-distance districts", () => {
    expect(getZoneForDistrict("Tamil Nadu", "Coimbatore")).toBe("zone_b");
    expect(getZoneForDistrict("Karnataka", "Bengaluru Urban")).toBe("zone_b");
  });

  it("returns zone_c for far districts", () => {
    expect(getZoneForDistrict("Tamil Nadu", "Madurai")).toBe("zone_c");
    expect(getZoneForDistrict("Kerala", "Palakkad")).toBe("zone_c");
  });

  it("returns zone_d for extended districts", () => {
    expect(getZoneForDistrict("Kerala", "Ernakulam")).toBe("zone_d");
    expect(getZoneForDistrict("Andhra Pradesh", "Visakhapatnam")).toBe("zone_d");
  });

  it("returns zone_e for far Karnataka districts", () => {
    expect(getZoneForDistrict("Karnataka", "Kalaburagi")).toBe("zone_e");
  });

  it("returns unknown for non-existent district", () => {
    expect(getZoneForDistrict("Tamil Nadu", "FictionalDistrict")).toBe("unknown");
  });

  it("returns unknown for non-existent state", () => {
    expect(getZoneForDistrict("NonExistent State", "Madurai")).toBe("unknown");
  });

  it("is case insensitive", () => {
    expect(getZoneForDistrict("tamil nadu", "madurai")).toBe("zone_c");
  });
});

describe("SOUTH_INDIA_STATES structural integrity", () => {
  it("has all 5 states", () => {
    const names = SOUTH_INDIA_STATES.map((s) => s.name);
    expect(names).toContain("Tamil Nadu");
    expect(names).toContain("Karnataka");
    expect(names).toContain("Kerala");
    expect(names).toContain("Andhra Pradesh");
    expect(names).toContain("Telangana");
  });

  it("every district has a non-empty zone", () => {
    for (const state of SOUTH_INDIA_STATES) {
      for (const district of state.districts) {
        expect(district.zone).toBeTruthy();
        expect(district.name).toBeTruthy();
      }
    }
  });
});

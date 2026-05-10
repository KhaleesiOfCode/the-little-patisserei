import { describe, it, expect } from "vitest";
import {
  getZoneByAreaName,
  getDeliveryZone,
  getDeliveryFeeMessage,
  CHENNAI_ZONES,
} from "@/lib/delivery-zones";

describe("getZoneByAreaName", () => {
  it("returns zone_a for exact area match", () => {
    const zone = getZoneByAreaName("Arumbakkam");
    expect(zone?.key).toBe("zone_a");
  });

  it("is case insensitive", () => {
    const zone = getZoneByAreaName("arumbakkam");
    expect(zone?.key).toBe("zone_a");
  });

  it("returns zone_b for area in zone_b", () => {
    const zone = getZoneByAreaName("T Nagar");
    expect(zone?.key).toBe("zone_b");
  });

  it("returns zone_c for area in zone_c", () => {
    const zone = getZoneByAreaName("Velachery");
    expect(zone?.key).toBe("zone_c");
  });

  it("returns zone_d for area in zone_d", () => {
    const zone = getZoneByAreaName("Tambaram");
    expect(zone?.key).toBe("zone_d");
  });

  it("returns zone_e for area in zone_e", () => {
    const zone = getZoneByAreaName("Mahabalipuram");
    expect(zone?.key).toBe("zone_e");
  });

  it("returns null for empty string", () => {
    expect(getZoneByAreaName("")).toBeNull();
  });

  it("returns null for unknown area", () => {
    expect(getZoneByAreaName("Mumbai")).toBeNull();
  });

  it("matches partial area names", () => {
    const zone = getZoneByAreaName("Nagar");
    // Should match Anna Nagar, T Nagar, etc.
    expect(zone).not.toBeNull();
  });
});

describe("getDeliveryZone", () => {
  it("returns zone for Chennai pincode in zone_a", () => {
    const result = getDeliveryZone("Chennai", "600106");
    expect(result.zone.key).toBe("zone_a");
    expect(result.isChennai).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it("returns zone for Chennai pincode in zone_b", () => {
    const result = getDeliveryZone("Chennai", "600001");
    expect(result.zone.key).toBe("zone_b");
    expect(result.isChennai).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it("returns unsupported for non-Chennai city", () => {
    const result = getDeliveryZone("Mumbai", "400001");
    expect(result.zone.key).toBe("unsupported");
    expect(result.isChennai).toBe(false);
    expect(result.isSupported).toBe(false);
  });

  it("detects Chennai by 600-prefix pincode even with other city name", () => {
    const result = getDeliveryZone("Unknown", "600001");
    expect(result.isChennai).toBe(true);
  });

  it("falls back to area lookup when pincode not in zones", () => {
    const result = getDeliveryZone("Chennai", "600000", "Velachery");
    expect(result.zone.key).toBe("zone_c");
    expect(result.isChennai).toBe(true);
  });

  it("returns unsupported when pincode and area both unknown", () => {
    const result = getDeliveryZone("Chennai", "000000");
    expect(result.zone.key).toBe("unsupported");
    expect(result.isSupported).toBe(false);
  });
});

describe("getDeliveryFeeMessage", () => {
  it("returns courier message for non-Chennai", () => {
    const msg = getDeliveryFeeMessage(CHENNAI_ZONES.unsupported, false);
    expect(msg).toContain("Courier orders outside Chennai");
  });

  it("returns manual confirmation for zone with null fee", () => {
    const msg = getDeliveryFeeMessage(CHENNAI_ZONES.zone_e, true);
    expect(msg).toContain("manual confirmation");
  });

  it("returns fee amount for zone with fee", () => {
    const msg = getDeliveryFeeMessage(CHENNAI_ZONES.zone_a, true);
    expect(msg).toContain("₹99");
  });
});

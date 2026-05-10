import { describe, it, expect } from "vitest";
import {
  estimateDeliveryFee,
  getMinHours,
  getStatusFlow,
  getNextStatuses,
  DEFAULT_DELIVERY_FEE_CONFIG,
} from "@/types/menu";

describe("estimateDeliveryFee", () => {
  it("returns 0 for pickup mode", () => {
    const result = estimateDeliveryFee("pickup", 100);
    expect(result).toEqual({ fee: 0, status: "included" });
  });

  it("returns base fee for local_delivery without free threshold", () => {
    const result = estimateDeliveryFee("local_delivery", 100);
    expect(result).toEqual({ fee: 50, status: "estimated" });
  });

  it("returns 0 for local_delivery above free threshold", () => {
    const config = { ...DEFAULT_DELIVERY_FEE_CONFIG, free_delivery_above: 500 };
    const result = estimateDeliveryFee("local_delivery", 600, config);
    expect(result).toEqual({ fee: 0, status: "included" });
  });

  it("returns base fee for local_delivery below free threshold", () => {
    const config = { ...DEFAULT_DELIVERY_FEE_CONFIG, free_delivery_above: 500 };
    const result = estimateDeliveryFee("local_delivery", 300, config);
    expect(result).toEqual({ fee: 50, status: "estimated" });
  });

  it("returns 0 with manual status for courier mode", () => {
    const result = estimateDeliveryFee("courier", 100);
    expect(result).toEqual({ fee: 0, status: "manual" });
  });
});

describe("getMinHours", () => {
  it("returns 24 for pickup", () => {
    expect(getMinHours("pickup")).toBe(24);
  });

  it("returns 24 for local_delivery", () => {
    expect(getMinHours("local_delivery")).toBe(24);
  });

  it("returns 48 for courier", () => {
    expect(getMinHours("courier")).toBe(48);
  });
});

describe("getStatusFlow", () => {
  it("returns pickup flow for pickup mode", () => {
    const flow = getStatusFlow("pickup");
    expect(flow).toEqual(["order_received", "baker_confirmed", "ready_for_pickup", "picked_up"]);
  });

  it("returns courier flow for courier mode", () => {
    const flow = getStatusFlow("courier");
    expect(flow).toEqual(["order_received", "baker_confirmed", "courier_booked", "delivered"]);
  });

  it("returns local delivery flow for local_delivery mode", () => {
    const flow = getStatusFlow("local_delivery");
    expect(flow).toEqual(["order_received", "baker_confirmed", "out_for_delivery", "delivered"]);
  });

  it("returns local delivery flow for null mode", () => {
    const flow = getStatusFlow(null);
    expect(flow).toEqual(["order_received", "baker_confirmed", "out_for_delivery", "delivered"]);
  });
});

describe("getNextStatuses", () => {
  describe("pickup mode", () => {
    it("order_received -> baker_confirmed, date_change_requested, cancelled", () => {
      expect(getNextStatuses("order_received", "pickup")).toEqual([
        "baker_confirmed", "date_change_requested", "cancelled",
      ]);
    });
    it("baker_confirmed -> ready_for_pickup, date_change_requested, cancelled", () => {
      expect(getNextStatuses("baker_confirmed", "pickup")).toEqual([
        "ready_for_pickup", "date_change_requested", "cancelled",
      ]);
    });
    it("ready_for_pickup -> picked_up", () => {
      expect(getNextStatuses("ready_for_pickup", "pickup")).toEqual(["picked_up"]);
    });
    it("picked_up has no next statuses", () => {
      expect(getNextStatuses("picked_up", "pickup")).toEqual([]);
    });
    it("date_change_requested -> baker_confirmed, cancelled", () => {
      expect(getNextStatuses("date_change_requested", "pickup")).toEqual([
        "baker_confirmed", "cancelled",
      ]);
    });
    it("cancelled -> refund_initiated", () => {
      expect(getNextStatuses("cancelled", "pickup")).toEqual(["refund_initiated"]);
    });
    it("refund_initiated -> refunded", () => {
      expect(getNextStatuses("refund_initiated", "pickup")).toEqual(["refunded"]);
    });
    it("refunded has no next statuses", () => {
      expect(getNextStatuses("refunded", "pickup")).toEqual([]);
    });
    it("delivered has no next statuses in pickup mode", () => {
      expect(getNextStatuses("delivered", "pickup")).toEqual([]);
    });
  });

  describe("courier mode", () => {
    it("order_received -> baker_confirmed, date_change_requested, cancelled", () => {
      expect(getNextStatuses("order_received", "courier")).toEqual([
        "baker_confirmed", "date_change_requested", "cancelled",
      ]);
    });
    it("baker_confirmed -> courier_booked, date_change_requested, cancelled", () => {
      expect(getNextStatuses("baker_confirmed", "courier")).toEqual([
        "courier_booked", "date_change_requested", "cancelled",
      ]);
    });
    it("courier_booked -> delivered", () => {
      expect(getNextStatuses("courier_booked", "courier")).toEqual(["delivered"]);
    });
    it("cancelled -> refund_initiated", () => {
      expect(getNextStatuses("cancelled", "courier")).toEqual(["refund_initiated"]);
    });
  });

  describe("local_delivery mode (default)", () => {
    it("order_received -> baker_confirmed, date_change_requested, cancelled", () => {
      expect(getNextStatuses("order_received", "local_delivery")).toEqual([
        "baker_confirmed", "date_change_requested", "cancelled",
      ]);
    });
    it("baker_confirmed -> out_for_delivery, date_change_requested, cancelled", () => {
      expect(getNextStatuses("baker_confirmed", "local_delivery")).toEqual([
        "out_for_delivery", "date_change_requested", "cancelled",
      ]);
    });
    it("out_for_delivery -> delivered", () => {
      expect(getNextStatuses("out_for_delivery", "local_delivery")).toEqual(["delivered"]);
    });
    it("delivered has no next statuses", () => {
      expect(getNextStatuses("delivered", "local_delivery")).toEqual([]);
    });
  });

  describe("null/undefined mode", () => {
    it("defaults to local_delivery flow", () => {
      const nullResult = getNextStatuses("order_received", null);
      const undefResult = getNextStatuses("order_received", undefined);
      const expected = ["baker_confirmed", "date_change_requested", "cancelled"];
      expect(nullResult).toEqual(expected);
      expect(undefResult).toEqual(expected);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("verifyPassword", () => {
  it("returns true when password matches ADMIN_PASSWORD", async () => {
    process.env.ADMIN_PASSWORD = "test-pass";
    const { verifyPassword } = await import("@/lib/auth");
    expect(await verifyPassword("test-pass")).toBe(true);
  });

  it("returns false when password does not match", async () => {
    process.env.ADMIN_PASSWORD = "test-pass";
    const { verifyPassword } = await import("@/lib/auth");
    expect(await verifyPassword("wrong-pass")).toBe(false);
  });

  it("uses default admin123 when ADMIN_PASSWORD is not set", async () => {
    process.env.ADMIN_PASSWORD = "";
    const { verifyPassword } = await import("@/lib/auth");
    expect(await verifyPassword("admin123")).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import {
  sanitizeName,
  sanitizeCity,
  sanitizePhone,
  sanitizePincode,
  sanitizeAddress,
  sanitizeEmail,
  validateRequired,
  validatePhone,
  validatePincode,
  validateEmail,
  validateAlpha,
} from "@/lib/validation";

describe("sanitizeName", () => {
  it("strips special characters", () => {
    expect(sanitizeName("John@Doe!")).toBe("JohnDoe");
  });
  it("preserves letters, spaces, apostrophes, hyphens", () => {
    expect(sanitizeName("Mary-Jane O'Brien")).toBe("Mary-Jane O'Brien");
  });
  it("returns empty for all-special input", () => {
    expect(sanitizeName("123!@#")).toBe("");
  });
});

describe("sanitizeCity", () => {
  it("strips special characters same as sanitizeName", () => {
    expect(sanitizeCity("Chennai!")).toBe("Chennai");
  });
  it("preserves letters and spaces", () => {
    expect(sanitizeCity("San Francisco")).toBe("San Francisco");
  });
});

describe("sanitizePhone", () => {
  it("keeps only digits, max 10", () => {
    expect(sanitizePhone("98765abc3210")).toBe("987653210");
  });
  it("truncates beyond 10 digits", () => {
    expect(sanitizePhone("1234567890123")).toBe("1234567890");
  });
  it("returns empty for non-digit input", () => {
    expect(sanitizePhone("abc")).toBe("");
  });
  it("preserves exact 10-digit number", () => {
    expect(sanitizePhone("9876543210")).toBe("9876543210");
  });
});

describe("sanitizePincode", () => {
  it("keeps only digits, max 6", () => {
    expect(sanitizePincode("600abc001")).toBe("600001");
  });
  it("truncates beyond 6 digits", () => {
    expect(sanitizePincode("600001234")).toBe("600001");
  });
  it("returns empty for non-digit input", () => {
    expect(sanitizePincode("abc")).toBe("");
  });
});

describe("sanitizeAddress", () => {
  it("preserves alphanumeric, spaces, commas, dots, hashes, hyphens, slashes, parens", () => {
    expect(sanitizeAddress("12, Main Rd #3 - Block A (East)")).toBe("12, Main Rd #3 - Block A (East)");
  });
  it("strips special characters like @, $, %, ^", () => {
    expect(sanitizeAddress("No@12 $Street%")).toBe("No12 Street");
  });
});

describe("sanitizeEmail", () => {
  it("removes whitespace", () => {
    expect(sanitizeEmail(" user @test.com ")).toBe("user@test.com");
  });
  it("returns empty string for all-whitespace input", () => {
    expect(sanitizeEmail("   ")).toBe("");
  });
});

describe("validateRequired", () => {
  it("returns true for non-empty string", () => {
    expect(validateRequired("hello")).toBe(true);
  });
  it("returns false for empty string", () => {
    expect(validateRequired("")).toBe(false);
  });
  it("returns false for whitespace-only string", () => {
    expect(validateRequired("   ")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("returns true for exactly 10 digits", () => {
    expect(validatePhone("9876543210")).toBe(true);
  });
  it("returns false for fewer than 10 digits", () => {
    expect(validatePhone("987654321")).toBe(false);
  });
  it("strips non-digits before validating", () => {
    expect(validatePhone("987-654-3210")).toBe(true);
  });
  it("returns false for letters", () => {
    expect(validatePhone("abcdefghij")).toBe(false);
  });
});

describe("validatePincode", () => {
  it("accepts South Indian pincodes (starts with 5 or 6)", () => {
    expect(validatePincode("600001")).toBe(true);
    expect(validatePincode("560001")).toBe(true);
    expect(validatePincode("500001")).toBe(true);
    expect(validatePincode("695001")).toBe(true);
  });
  it("rejects non-South-Indian pincodes", () => {
    expect(validatePincode("110001")).toBe(false);
    expect(validatePincode("400001")).toBe(false);
    expect(validatePincode("700001")).toBe(false);
    expect(validatePincode("391000")).toBe(false);
  });
  it("rejects invalid lengths", () => {
    expect(validatePincode("600")).toBe(false);
    expect(validatePincode("6000010")).toBe(false);
    expect(validatePincode("")).toBe(false);
  });
  it("rejects non-digit characters", () => {
    expect(validatePincode("60001a")).toBe(false);
  });
});

describe("validateEmail", () => {
  it("returns true for empty string (optional field)", () => {
    expect(validateEmail("")).toBe(true);
  });
  it("accepts valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });
  it("rejects email without @", () => {
    expect(validateEmail("testexample.com")).toBe(false);
  });
  it("rejects email without domain", () => {
    expect(validateEmail("test@")).toBe(false);
  });
  it("rejects email with spaces", () => {
    expect(validateEmail("test @example.com")).toBe(false);
  });
});

describe("validateAlpha", () => {
  it("accepts only letters, spaces, apostrophes, hyphens", () => {
    expect(validateAlpha("John Doe")).toBe(true);
    expect(validateAlpha("Mary-Jane O'Brien")).toBe(true);
  });
  it("rejects strings with numbers", () => {
    expect(validateAlpha("John123")).toBe(false);
  });
  it("rejects strings with special characters", () => {
    expect(validateAlpha("John@Doe")).toBe(false);
  });
  it("trims before validating", () => {
    expect(validateAlpha("  John  ")).toBe(true);
  });
});

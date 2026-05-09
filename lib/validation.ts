export function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s'-]/g, "");
}

export function sanitizeCity(value: string): string {
  return value.replace(/[^a-zA-Z\s'-]/g, "");
}

export function sanitizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  if (last10.length > 0) {
    return "+91" + last10;
  }
  return last10;
}

export function sanitizePincode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function sanitizeAddress(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s,.#\-/()]/g, "");
}

export function sanitizeEmail(value: string): string {
  return value.replace(/\s/g, "");
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91");
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function validateEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAlpha(value: string): boolean {
  return /^[a-zA-Z\s'-]+$/.test(value.trim());
}

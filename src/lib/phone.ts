/**
 * Standard Phone Number Utility for Wahide WhatsApp SaaS
 * Implements ITU-T E.164 Global Standard with Indonesia-First Normalization UX.
 */

// ITU-T E.164 standard: 7 to 15 digits, no leading 0, no plus sign
export const E164_PHONE_REGEX = /^[1-9][0-9]{6,14}$/;

/**
 * Normalizes user-inputted phone numbers into clean E.164 format.
 *
 * Rules:
 * 1. Strips all non-digit characters (spaces, dashes, parens, plus).
 * 2. If starts with "0" (e.g. 08123456789) -> converts to 628123456789.
 * 3. If starts with "8" and length is between 9 and 12 -> converts to 628...
 * 4. Preserves international country codes (e.g. 60..., 65..., 1..., 44...).
 *
 * @param raw - The input phone number string.
 * @param defaultCountryCode - Country code to prepend for local formats (default: "62").
 * @returns Clean E.164 numeric string.
 */
export function normalizePhoneNumber(
  raw: string,
  defaultCountryCode = "62",
): string {
  if (!raw) return "";

  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  let clean = trimmed.replace(/[^0-9]/g, "");

  // Local Indonesia format starting with 0 (e.g., 081234567890 -> 6281234567890)
  if (clean.startsWith("0")) {
    clean = defaultCountryCode + clean.slice(1);
  }
  // Local Indonesia format omitting leading 0 (e.g., 81234567890 -> 6281234567890)
  // Only apply if user did NOT explicitly specify an international leading '+'
  else if (
    !hasPlus &&
    clean.startsWith("8") &&
    clean.length >= 9 &&
    clean.length <= 13
  ) {
    clean = defaultCountryCode + clean;
  }

  return clean;
}

/**
 * Validates whether a phone number adheres to ITU-T E.164 standards.
 *
 * @param phone - Normalized phone number string.
 * @returns true if phone is a valid E.164 format (7-15 digits, non-zero start).
 */
export function isValidE164(phone: string): boolean {
  if (!phone) return false;
  return E164_PHONE_REGEX.test(phone);
}

/**
 * Formats a phone number for elegant user interface display.
 *
 * @param phone - Raw or normalized phone number string.
 * @returns Formatted phone display string (e.g., "+62 812-3456-7890" or "+1 4155552671").
 */
export function formatDisplayPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const clean = phone.replace(/[^0-9]/g, "");
  if (!clean) return phone;

  // Format Indonesian numbers (+62 8xx-xxxx-xxxx)
  if (clean.startsWith("62") && clean.length >= 10) {
    return `+62 ${clean.slice(2, 5)}-${clean.slice(5, 9)}-${clean.slice(9)}`;
  }

  // Generic international E.164 format (+<number>)
  return `+${clean}`;
}

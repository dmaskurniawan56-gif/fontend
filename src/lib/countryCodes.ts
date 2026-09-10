/**
 * International Country Dial Codes Registry for Wahide WhatsApp Platform
 * Implements ITU-T E.164 country dial codes with smart phone detection.
 */

export interface CountryCodeItem {
  code: string; // ISO 3166-1 alpha-2 code (e.g. "ID", "MY")
  name: string; // Country name (localized or English)
  nameId: string; // Indonesian country name
  dialCode: string; // Dial code digits without '+' (e.g. "62", "1")
  flag: string; // Unicode flag emoji
  formatHint?: string; // Example number pattern
}

export const COUNTRIES: CountryCodeItem[] = [
  // ASEAN / Asia Tenggara (Prioritas Regional)
  {
    code: "ID",
    name: "Indonesia",
    nameId: "Indonesia",
    dialCode: "62",
    flag: "🇮🇩",
    formatHint: "812 3456 7890",
  },
  {
    code: "MY",
    name: "Malaysia",
    nameId: "Malaysia",
    dialCode: "60",
    flag: "🇲🇾",
    formatHint: "12 345 6789",
  },
  {
    code: "SG",
    name: "Singapore",
    nameId: "Singapura",
    dialCode: "65",
    flag: "🇸🇬",
    formatHint: "8123 4567",
  },
  {
    code: "PH",
    name: "Philippines",
    nameId: "Filipina",
    dialCode: "63",
    flag: "🇵🇭",
    formatHint: "912 345 6789",
  },
  {
    code: "TH",
    name: "Thailand",
    nameId: "Thailand",
    dialCode: "66",
    flag: "🇹🇭",
    formatHint: "81 234 5678",
  },
  {
    code: "VN",
    name: "Vietnam",
    nameId: "Vietnam",
    dialCode: "84",
    flag: "🇻🇳",
    formatHint: "91 234 5678",
  },
  {
    code: "BN",
    name: "Brunei",
    nameId: "Brunei",
    dialCode: "673",
    flag: "🇧🇳",
    formatHint: "812 3456",
  },
  {
    code: "KH",
    name: "Cambodia",
    nameId: "Kamboja",
    dialCode: "855",
    flag: "🇰🇭",
    formatHint: "12 345 678",
  },
  {
    code: "MM",
    name: "Myanmar",
    nameId: "Myanmar",
    dialCode: "95",
    flag: "🇲🇲",
    formatHint: "9 1234 5678",
  },
  {
    code: "LA",
    name: "Laos",
    nameId: "Laos",
    dialCode: "856",
    flag: "🇱🇦",
    formatHint: "20 1234 5678",
  },
  {
    code: "TL",
    name: "Timor-Leste",
    nameId: "Timor Leste",
    dialCode: "670",
    flag: "🇹🇱",
    formatHint: "7712 3456",
  },

  // Asia Timur & Selatan
  {
    code: "JP",
    name: "Japan",
    nameId: "Jepang",
    dialCode: "81",
    flag: "🇯🇵",
    formatHint: "90 1234 5678",
  },
  {
    code: "KR",
    name: "South Korea",
    nameId: "Korea Selatan",
    dialCode: "82",
    flag: "🇰🇷",
    formatHint: "10 1234 5678",
  },
  {
    code: "CN",
    name: "China",
    nameId: "Tiongkok",
    dialCode: "86",
    flag: "🇨🇳",
    formatHint: "138 0013 8000",
  },
  {
    code: "HK",
    name: "Hong Kong",
    nameId: "Hong Kong",
    dialCode: "852",
    flag: "🇭🇰",
    formatHint: "9123 4567",
  },
  {
    code: "TW",
    name: "Taiwan",
    nameId: "Taiwan",
    dialCode: "886",
    flag: "🇹🇼",
    formatHint: "912 345 678",
  },
  {
    code: "IN",
    name: "India",
    nameId: "India",
    dialCode: "91",
    flag: "🇮🇳",
    formatHint: "98123 45678",
  },
  {
    code: "PK",
    name: "Pakistan",
    nameId: "Pakistan",
    dialCode: "92",
    flag: "🇵🇰",
    formatHint: "300 1234567",
  },
  {
    code: "BD",
    name: "Bangladesh",
    nameId: "Bangladesh",
    dialCode: "880",
    flag: "🇧🇩",
    formatHint: "1712 345678",
  },

  // Timur Tengah (Umrah, Haji & Bisnis)
  {
    code: "SA",
    name: "Saudi Arabia",
    nameId: "Arab Saudi",
    dialCode: "966",
    flag: "🇸🇦",
    formatHint: "50 123 4567",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    nameId: "Uni Emirat Arab",
    dialCode: "971",
    flag: "🇦🇪",
    formatHint: "50 123 4567",
  },
  {
    code: "QA",
    name: "Qatar",
    nameId: "Qatar",
    dialCode: "974",
    flag: "🇶🇦",
    formatHint: "3312 3456",
  },
  {
    code: "KW",
    name: "Kuwait",
    nameId: "Kuwait",
    dialCode: "965",
    flag: "🇰🇼",
    formatHint: "9123 4567",
  },
  {
    code: "BH",
    name: "Bahrain",
    nameId: "Bahrain",
    dialCode: "973",
    flag: "🇧🇭",
    formatHint: "3912 3456",
  },
  {
    code: "OM",
    name: "Oman",
    nameId: "Oman",
    dialCode: "968",
    flag: "🇴🇲",
    formatHint: "9123 4567",
  },
  {
    code: "TR",
    name: "Turkey",
    nameId: "Turki",
    dialCode: "90",
    flag: "🇹🇷",
    formatHint: "501 234 5678",
  },
  {
    code: "EG",
    name: "Egypt",
    nameId: "Mesir",
    dialCode: "20",
    flag: "🇪🇬",
    formatHint: "100 123 4567",
  },
  {
    code: "JO",
    name: "Jordan",
    nameId: "Yordania",
    dialCode: "962",
    flag: "🇯🇴",
    formatHint: "7 9012 3456",
  },

  // Amerika & Oseania
  {
    code: "US",
    name: "United States",
    nameId: "Amerika Serikat",
    dialCode: "1",
    flag: "🇺🇸",
    formatHint: "202 555 0125",
  },
  {
    code: "CA",
    name: "Canada",
    nameId: "Kanada",
    dialCode: "1",
    flag: "🇨🇦",
    formatHint: "416 555 0125",
  },
  {
    code: "AU",
    name: "Australia",
    nameId: "Australia",
    dialCode: "61",
    flag: "🇦🇺",
    formatHint: "412 345 678",
  },
  {
    code: "NZ",
    name: "New Zealand",
    nameId: "Selandia Baru",
    dialCode: "64",
    flag: "🇳🇿",
    formatHint: "21 123 4567",
  },
  {
    code: "BR",
    name: "Brazil",
    nameId: "Brasil",
    dialCode: "55",
    flag: "🇧🇷",
    formatHint: "11 91234 5678",
  },
  {
    code: "MX",
    name: "Mexico",
    nameId: "Meksiko",
    dialCode: "52",
    flag: "🇲🇽",
    formatHint: "55 1234 5678",
  },

  // Eropa
  {
    code: "GB",
    name: "United Kingdom",
    nameId: "Inggris",
    dialCode: "44",
    flag: "🇬🇧",
    formatHint: "7911 123456",
  },
  {
    code: "DE",
    name: "Germany",
    nameId: "Jerman",
    dialCode: "49",
    flag: "🇩🇪",
    formatHint: "151 1234567",
  },
  {
    code: "FR",
    name: "France",
    nameId: "Prancis",
    dialCode: "33",
    flag: "🇫🇷",
    formatHint: "6 12 34 56 78",
  },
  {
    code: "NL",
    name: "Netherlands",
    nameId: "Belanda",
    dialCode: "31",
    flag: "🇳🇱",
    formatHint: "6 12345678",
  },
  {
    code: "IT",
    name: "Italy",
    nameId: "Italia",
    dialCode: "39",
    flag: "🇮🇹",
    formatHint: "312 345 6789",
  },
  {
    code: "ES",
    name: "Spain",
    nameId: "Spanyol",
    dialCode: "34",
    flag: "🇪🇸",
    formatHint: "612 34 56 78",
  },
  {
    code: "CH",
    name: "Switzerland",
    nameId: "Swiss",
    dialCode: "41",
    flag: "🇨🇭",
    formatHint: "78 123 45 67",
  },
  {
    code: "SE",
    name: "Sweden",
    nameId: "Swedia",
    dialCode: "46",
    flag: "🇸🇪",
    formatHint: "70 123 45 67",
  },
  {
    code: "NO",
    name: "Norway",
    nameId: "Norwegia",
    dialCode: "47",
    flag: "🇳🇴",
    formatHint: "412 34 567",
  },
  {
    code: "DK",
    name: "Denmark",
    nameId: "Denmark",
    dialCode: "45",
    flag: "🇩🇰",
    formatHint: "20 12 34 56",
  },
  {
    code: "BE",
    name: "Belgium",
    nameId: "Belgia",
    dialCode: "32",
    flag: "🇧🇪",
    formatHint: "470 12 34 56",
  },
  {
    code: "PL",
    name: "Poland",
    nameId: "Polandia",
    dialCode: "48",
    flag: "🇵🇱",
    formatHint: "512 345 678",
  },
  {
    code: "PT",
    name: "Portugal",
    nameId: "Portugal",
    dialCode: "351",
    flag: "🇵🇹",
    formatHint: "912 345 678",
  },
  {
    code: "RU",
    name: "Russia",
    nameId: "Rusia",
    dialCode: "7",
    flag: "🇷🇺",
    formatHint: "912 345 67 89",
  },
  {
    code: "ZA",
    name: "South Africa",
    nameId: "Afrika Selatan",
    dialCode: "27",
    flag: "🇿🇦",
    formatHint: "71 123 4567",
  },
  {
    code: "NG",
    name: "Nigeria",
    nameId: "Nigeria",
    dialCode: "234",
    flag: "🇳🇬",
    formatHint: "802 123 4567",
  },
];

export const DEFAULT_COUNTRY: CountryCodeItem = COUNTRIES[0]; // Indonesia (+62)

/**
 * Finds a country by exact dial code (e.g. "62" -> Indonesia).
 */
export function findCountryByDialCode(
  dialCode: string,
): CountryCodeItem | undefined {
  const clean = dialCode.replace(/[^0-9]/g, "");
  return COUNTRIES.find((c) => c.dialCode === clean);
}

/**
 * Finds a country by ISO-2 code (e.g. "ID", "MY").
 */
export function findCountryByCode(code: string): CountryCodeItem | undefined {
  const upper = code.toUpperCase().trim();
  return COUNTRIES.find((c) => c.code === upper);
}

/**
 * Intelligently detects the country and remaining subscriber number from an arbitrary phone string.
 * Supports:
 * - "+60123456789" -> { country: Malaysia, subscriberNumber: "123456789" }
 * - "08123456789" -> { country: Indonesia, subscriberNumber: "8123456789" }
 * - "628123456789" -> { country: Indonesia, subscriberNumber: "8123456789" }
 * - "+1 415 555 2671" -> { country: US, subscriberNumber: "4155552671" }
 */
export function detectCountryFromPhone(raw: string): {
  country?: CountryCodeItem;
  subscriberNumber: string;
} {
  const trimmed = raw.trim();
  const clean = trimmed.replace(/[^0-9]/g, "");

  if (!clean) {
    return { subscriberNumber: "" };
  }

  // Indonesian local format starting with 0 (e.g. 081234567890)
  if (clean.startsWith("0")) {
    return {
      country: DEFAULT_COUNTRY,
      subscriberNumber: clean.slice(1),
    };
  }

  // If starts with '+' or begins with known long dial codes (try longest prefix match first)
  const sortedByDialLength = [...COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );

  for (const item of sortedByDialLength) {
    if (clean.startsWith(item.dialCode)) {
      const remainder = clean.slice(item.dialCode.length);
      if (remainder.length >= 4) {
        const cleanRemainder = remainder.startsWith("0")
          ? remainder.slice(1)
          : remainder;
        return {
          country: item,
          subscriberNumber: cleanRemainder,
        };
      }
    }
  }

  return {
    subscriberNumber: clean,
  };
}

export interface PhoneWarningResult {
  hasWarning: boolean;
  type?: "leading_zero" | "duplicate_dial_code";
  message?: string;
  suggestedValue: string;
}

/**
 * Checks whether user input has unnecessary leading zero ('0...') or duplicated dial code ('62...').
 */
export function checkPhoneInputWarning(
  value: string,
  dialCode: string = "62",
): PhoneWarningResult {
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) {
    return { hasWarning: false, suggestedValue: "" };
  }

  // Combined Case: Starts with 0 followed by dialCode (e.g. "062812345678")
  if (clean.startsWith("0")) {
    const withoutZero = clean.replace(/^0+/, "");
    if (
      withoutZero.startsWith(dialCode) &&
      withoutZero.length >= dialCode.length
    ) {
      const finalDigits = withoutZero.slice(dialCode.length).replace(/^0+/, "");
      return {
        hasWarning: true,
        type: "duplicate_dial_code",
        message: `Nomor tidak perlu diawali '0' atau kode negara (+${dialCode}). Cukup ketik langsung nomor setelahnya.`,
        suggestedValue: finalDigits,
      };
    }
  }

  // Case 1: Check duplicate dial code (e.g. "62..." when dialCode is "62")
  if (clean.startsWith(dialCode) && clean.length >= dialCode.length) {
    const remainder = clean.slice(dialCode.length).replace(/^0+/, "");
    return {
      hasWarning: true,
      type: "duplicate_dial_code",
      message: `Kode negara (+${dialCode}) sudah ada di sebelah kiri. Tidak perlu mengetik '${dialCode}' lagi.`,
      suggestedValue: remainder,
    };
  }

  // Case 2: Check leading zero (e.g. "0..." or "08...")
  if (clean.startsWith("0")) {
    const remainder = clean.replace(/^0+/, "");
    return {
      hasWarning: true,
      type: "leading_zero",
      message:
        "Nomor tidak perlu diawali angka '0'. Cukup ketik langsung nomor setelahnya.",
      suggestedValue: remainder,
    };
  }

  return {
    hasWarning: false,
    suggestedValue: clean,
  };
}

/**
 * Fully cleans subscriber input digits, ensuring no duplicate dial code and no leading zeros.
 */
export function sanitizeSubscriberInput(
  raw: string,
  dialCode: string = "62",
): string {
  let clean = raw.replace(/[^0-9]/g, "");
  if (clean.startsWith(dialCode) && clean.length > dialCode.length) {
    clean = clean.slice(dialCode.length);
  }
  clean = clean.replace(/^0+/, "");
  if (clean.startsWith(dialCode) && clean.length > dialCode.length) {
    clean = clean.slice(dialCode.length).replace(/^0+/, "");
  }
  return clean;
}

/**
 * Ukrainian national number after the locked `+380` prefix:
 * 9 digits, a real mobile/geographic NDC, not a trivial fake.
 */
const UA_NDC = new Set([
  "39",
  "50",
  "63",
  "66",
  "67",
  "68",
  "73",
  "75",
  "77",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "41",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "61",
  "62",
  "64",
  "65",
  "69",
]);

/** 9 subscriber digits as typed in `PhoneField` (without `+380`). */
export function isUaSubscriberDigits(digits: string): boolean {
  if (!/^\d{9}$/.test(digits)) return false;
  if (/^(\d)\1{8}$/.test(digits)) return false;
  if (!UA_NDC.has(digits.slice(0, 2))) return false;
  if (/^0{7}$/.test(digits.slice(2))) return false;
  return true;
}

/** Full E.164 value sent to the API, e.g. `+380633000000`. */
export function isUaPhoneE164(phone: string): boolean {
  const match = phone.match(/^\+380(\d{9})$/);
  return match != null && isUaSubscriberDigits(match[1]);
}

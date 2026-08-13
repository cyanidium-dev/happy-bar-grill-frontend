export const MAX_DELIVERY_ADDRESS = 200;

const ALLOWED = /^[\p{L}\d\s.,/'’ʼ№#«»()\-–]+$/u;

/**
 * Delivery street address: 4–200 characters, a street name (letters) and a
 * building number. `"1234"` / `"...."` are rejected.
 */
export function isDeliveryAddress(value: string): boolean {
  const address = value.trim();
  if (address.length < 4 || address.length > MAX_DELIVERY_ADDRESS) return false;
  if (!ALLOWED.test(address)) return false;

  const letters = address.match(/\p{L}/gu);
  if (letters == null || letters.length < 3) return false;
  return /\d/.test(address);
}

/** Per-line cap, shared by the cart store and the dish-page stepper. */
export const MAX_CART_QUANTITY = 99;

/**
 * Accepts only a finite integer in `1…MAX_CART_QUANTITY`.
 * Returns `null` for 0, negatives, NaN, fractions, and other non-quantities.
 */
export function normalizeCartQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const quantity = Math.trunc(value);
  if (quantity < 1) return null;
  return Math.min(MAX_CART_QUANTITY, quantity);
}

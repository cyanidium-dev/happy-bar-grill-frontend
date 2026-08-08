/** Digits-only order number, e.g. "48213307". Not cryptographically unique. */
export function generateOrderNumber(): string {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(10 + Math.random() * 90); // two digits
  return `${stamp}${rand}`;
}

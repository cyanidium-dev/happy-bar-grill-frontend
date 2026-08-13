/** Digits-only order number, e.g. "4821337402". Not guaranteed unique. */
export function generateOrderNumber(): string {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(1000 + Math.random() * 9000); // four digits
  return `${stamp}${rand}`;
}

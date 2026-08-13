import type { CartItem, OrderCustomer, OrderLineRequest } from "@/types/cart";

export class OrderRequestError extends Error {
  constructor(public readonly code: "unavailable" | "minOrder" | "submit") {
    super(code);
    this.name = "OrderRequestError";
  }
}

export async function sendContactMessage(
  name: string,
  phone: string,
  message: string,
  formToken: string,
): Promise<void> {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message, token: formToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to send telegram message");
  }
}

export async function submitOrder(
  formToken: string,
  locale: string,
  customer: OrderCustomer,
  items: OrderLineRequest[],
): Promise<{ orderNumber: string; items: CartItem[]; total: number }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: formToken, locale, customer, items }),
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new OrderRequestError(
      payload?.error === "unavailable" || payload?.error === "minOrder"
        ? payload.error
        : "submit",
    );
  }

  return res.json() as Promise<{
    orderNumber: string;
    items: CartItem[];
    total: number;
  }>;
}

import "server-only";
import { createHash } from "node:crypto";
import type { CartItem } from "@/types/cart";

const TTL_MS = 30 * 60 * 1000;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isIdempotencyKey(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("conflict");
    this.name = "IdempotencyConflictError";
  }
}

export type OrderSuccessBody = {
  orderNumber: string;
  items: CartItem[];
  total: number;
};

type Slot =
  | {
      status: "pending";
      fingerprint: string;
      promise: Promise<OrderSuccessBody>;
    }
  | {
      status: "done";
      fingerprint: string;
      body: OrderSuccessBody;
      expiresAt: number;
    };

const slots = new Map<string, Slot>();

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) return null;
  return value as Record<string, unknown>;
}

/** Stable hash of the client intent (locale + customer + lines). */
export function orderFingerprint(body: unknown): string {
  const data = asRecord(body) ?? {};
  const customer = asRecord(data.customer) ?? {};
  const items = Array.isArray(data.items) ? data.items : [];

  const canonical = {
    locale: typeof data.locale === "string" ? data.locale : "",
    customer: {
      name: customer.name ?? "",
      phone: customer.phone ?? "",
      deliveryType: customer.deliveryType ?? "",
      address: customer.address ?? "",
      timeMode: customer.timeMode ?? "",
      scheduledAt: customer.scheduledAt ?? "",
      payment: customer.payment ?? "",
      comment: customer.comment ?? "",
    },
    items: items
      .flatMap((item) => {
        const row = asRecord(item);
        if (!row || typeof row.id !== "string") return [];
        return [{ id: row.id, quantity: Number(row.quantity) }];
      })
      .sort((a, b) => a.id.localeCompare(b.id)),
  };

  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

function prune(now: number) {
  for (const [key, slot] of slots) {
    if (slot.status === "done" && slot.expiresAt <= now) slots.delete(key);
  }
}

/**
 * Runs `execute` once per key. A retry with the same key and fingerprint
 * returns the cached success body (no second Telegram send). Failures are
 * not cached, so a genuine retry after Telegram/Sanity errors still runs.
 */
export function runIdempotentOrder(
  key: string,
  fingerprint: string,
  execute: () => Promise<OrderSuccessBody>,
): Promise<OrderSuccessBody> {
  prune(Date.now());

  const existing = slots.get(key);
  if (existing) {
    if (existing.fingerprint !== fingerprint) {
      return Promise.reject(new IdempotencyConflictError());
    }
    if (existing.status === "done") return Promise.resolve(existing.body);
    return existing.promise;
  }

  const promise = execute()
    .then((body) => {
      slots.set(key, {
        status: "done",
        fingerprint,
        body,
        expiresAt: Date.now() + TTL_MS,
      });
      return body;
    })
    .catch((error: unknown) => {
      slots.delete(key);
      throw error;
    });

  slots.set(key, { status: "pending", fingerprint, promise });
  return promise;
}

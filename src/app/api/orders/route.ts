import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
import {
  IdempotencyConflictError,
  isIdempotencyKey,
  orderFingerprint,
  runIdempotentOrder,
} from "@/lib/orders/idempotency";
import { OrderError, resolveOrder } from "@/lib/orders/resolveOrder";
import { formatOrderTelegramMessage } from "@/lib/telegram/formatOrder";
import { verifyFormToken } from "@/lib/telegram/formToken";
import {
  sendTelegramHtml,
  TelegramConfigError,
} from "@/lib/telegram/sendMessage";
import { generateOrderNumber } from "@/utils/orderNumber";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const token =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).token
        : undefined;
    const idempotencyKey =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).idempotencyKey
        : undefined;

    if (!verifyFormToken(token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!isIdempotencyKey(idempotencyKey)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const result = await runIdempotentOrder(
      idempotencyKey,
      orderFingerprint(body),
      async () => {
        const order = await resolveOrder(body);
        const orderNumber = generateOrderNumber();

        await sendTelegramHtml(
          formatOrderTelegramMessage({
            orderNumber,
            customer: order.customer,
            items: order.telegramItems,
            total: order.total,
          }),
        );

        return {
          orderNumber,
          items: order.items,
          total: order.total,
        };
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof IdempotencyConflictError) {
      return NextResponse.json({ error: "conflict" }, { status: 409 });
    }
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.code }, { status: 400 });
    }
    if (error instanceof TelegramConfigError) {
      return NextResponse.json(
        { error: "Telegram not configured" },
        { status: 500 },
      );
    }
    console.error("[orders] unexpected error:", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

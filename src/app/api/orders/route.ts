import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
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

    if (!verifyFormToken(token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    return NextResponse.json({
      orderNumber,
      items: order.items,
      total: order.total,
    });
  } catch (error) {
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

import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/http/clientIp";
import { rateLimit } from "@/lib/http/rateLimit";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
import { formatContactTelegramMessage } from "@/lib/telegram/formatContact";
import { verifyFormToken } from "@/lib/telegram/formToken";
import {
  sendTelegramHtml,
  TelegramConfigError,
} from "@/lib/telegram/sendMessage";
import { isPersonName } from "@/utils/personName";
import { isUaPhoneE164 } from "@/utils/phone";

const MAX_MESSAGE = 1000;
/** Soft brake: contact form is rarely submitted more than a few times a minute. */
const RATE = { limit: 5, windowMs: 60_000 };

function parseContact(body: unknown): {
  name: string;
  phone: string;
  message: string;
} | null {
  if (typeof body !== "object" || body === null) return null;
  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!isPersonName(name)) return null;
  if (!isUaPhoneE164(phone)) return null;
  if (message.length < 5 || message.length > MAX_MESSAGE) return null;

  return { name, phone, message };
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = rateLimit(`telegram:${getClientIp(request)}`, RATE);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = await request.json();
    const token =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).token
        : undefined;

    if (!verifyFormToken(token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contact = parseContact(body);
    if (!contact) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    await sendTelegramHtml(formatContactTelegramMessage(contact));

    return NextResponse.json({ message: "Data sent successfully" });
  } catch (error) {
    if (error instanceof TelegramConfigError) {
      return NextResponse.json(
        { error: "Telegram not configured" },
        { status: 500 },
      );
    }
    console.error("[telegram] unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

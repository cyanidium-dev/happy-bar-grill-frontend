import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
import { formatContactTelegramMessage } from "@/lib/telegram/formatContact";
import { verifyFormToken } from "@/lib/telegram/formToken";
import {
  sendTelegramHtml,
  TelegramConfigError,
} from "@/lib/telegram/sendMessage";

const PHONE_RE = /^\+380\d{9}$/;
const MAX_NAME = 80;
const MAX_MESSAGE = 1000;

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

  if (name.length < 2 || name.length > MAX_NAME) return null;
  if (!PHONE_RE.test(phone)) return null;
  if (message.length < 5 || message.length > MAX_MESSAGE) return null;

  return { name, phone, message };
}

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

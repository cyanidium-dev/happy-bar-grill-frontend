import { NextRequest, NextResponse } from "next/server";
import { sanitizeTelegramHtml } from "@/lib/telegram/escapeHtml";
import { verifyFormToken } from "@/lib/telegram/formToken";

const BOT_ID = process.env.TELEGRAM_BOT_ID ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Mirrors the same-origin check Next.js applies to Server Actions: the
 * `Origin` header (sent by browsers on every same-origin POST, not just
 * cross-origin ones) must match the host the request was made to. This
 * rejects requests fired directly at the endpoint from another site or a
 * bare script that doesn't set an `Origin` header at all.
 */
function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!requestHost) return false;

  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const text =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).text
        : undefined;
    const token =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).token
        : undefined;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    if (!verifyFormToken(token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!BOT_ID || !CHAT_ID) {
      return NextResponse.json(
        { error: "Telegram not configured" },
        { status: 500 },
      );
    }

    const safeText = sanitizeTelegramHtml(text);

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_ID}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          parse_mode: "HTML",
          text: safeText,
        }),
      },
    );

    if (!res.ok) {
      const firstError = await res.text();
      console.error("[telegram] sendMessage failed:", firstError);

      const fallback = await fetch(
        `https://api.telegram.org/bot${BOT_ID}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: stripHtml(safeText),
          }),
        },
      );

      if (!fallback.ok) {
        const fallbackError = await fallback.text();
        console.error("[telegram] fallback failed:", fallbackError);
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ message: "Data sent successfully" });
  } catch (error) {
    console.error("[telegram] unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

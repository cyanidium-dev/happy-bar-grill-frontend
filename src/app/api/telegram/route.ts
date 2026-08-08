import { NextRequest, NextResponse } from "next/server";

const BOT_ID = process.env.TELEGRAM_BOT_ID ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (typeof data !== "string" || !data.trim()) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    if (!BOT_ID || !CHAT_ID) {
      return NextResponse.json(
        { error: "Telegram not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_ID}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          parse_mode: "HTML",
          text: data,
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
            text: stripHtml(data),
          }),
        },
      );

      if (!fallback.ok) {
        const fallbackError = await fallback.text();
        console.error("[telegram] fallback failed:", fallbackError);
        return NextResponse.json(
          { error: "Failed to send message", details: fallbackError },
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

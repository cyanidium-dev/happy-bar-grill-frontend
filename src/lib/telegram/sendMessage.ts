import "server-only";
import { TELEGRAM_TIMEOUT_MS } from "@/lib/http/timeout";
import { sanitizeTelegramHtml } from "./escapeHtml";

const BOT_ID = process.env.TELEGRAM_BOT_ID ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

export class TelegramConfigError extends Error {
  constructor() {
    super("Telegram not configured");
    this.name = "TelegramConfigError";
  }
}

export class TelegramSendError extends Error {
  constructor() {
    super("Failed to send telegram message");
    this.name = "TelegramSendError";
  }
}

async function postSendMessage(
  payload: Record<string, string>,
  signal: AbortSignal,
): Promise<Response> {
  return fetch(`https://api.telegram.org/bot${BOT_ID}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

/** Sends an HTML Telegram message, falling back to plain text if parse_mode fails. */
export async function sendTelegramHtml(html: string): Promise<void> {
  if (!BOT_ID || !CHAT_ID) {
    throw new TelegramConfigError();
  }

  const safeText = sanitizeTelegramHtml(html);
  const signal = AbortSignal.timeout(TELEGRAM_TIMEOUT_MS);

  try {
    const res = await postSendMessage(
      { chat_id: CHAT_ID, parse_mode: "HTML", text: safeText },
      signal,
    );

    if (res.ok) return;

    const firstError = await res.text();
    console.error("[telegram] sendMessage failed:", firstError);

    const fallback = await postSendMessage(
      { chat_id: CHAT_ID, text: stripHtml(safeText) },
      signal,
    );

    if (!fallback.ok) {
      const fallbackError = await fallback.text();
      console.error("[telegram] fallback failed:", fallbackError);
      throw new TelegramSendError();
    }
  } catch (error) {
    if (error instanceof TelegramSendError) throw error;
    console.error("[telegram] sendMessage error:", error);
    throw new TelegramSendError();
  }
}

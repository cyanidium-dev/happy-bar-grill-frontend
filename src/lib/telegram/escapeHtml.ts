/**
 * Telegram HTML requires `&`, `<` and `>` to be escaped when they are not
 * part of a tag. Applied to every user-controlled value before it is
 * interpolated into a `parse_mode: "HTML"` message.
 */
export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Defense in depth for `/api/telegram`: keep the `<b>` markup our formatters
 * emit, and neutralize any other tags (`<a>`, `<i>`, spoofed `</b>`, …).
 * Does not re-escape `&`, so values already passed through `escapeHtml` stay
 * intact.
 */
export function sanitizeTelegramHtml(input: string): string {
  return input.replace(/<(?!\/?b>)([^>]*)>/g, (_, inner: string) => {
    return `&lt;${inner}&gt;`;
  });
}

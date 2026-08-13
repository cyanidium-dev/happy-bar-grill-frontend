export async function sendTelegramMessage(
  text: string,
  formToken: string,
): Promise<void> {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, token: formToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to send telegram message");
  }
}

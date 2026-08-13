import { escapeHtml } from "./escapeHtml";
import { TG } from "./icons";

/** HTML-текст повідомлення про звернення з форми контактів для Telegram. */
export function formatContactTelegramMessage({
  name,
  phone,
  message,
}: {
  name: string;
  phone: string;
  message: string;
}): string {
  return (
    `${TG.message} <b>Нове звернення з сайту</b>\n\n` +
    `${TG.name} <b>Ім'я:</b> ${escapeHtml(name)}\n` +
    `${TG.phone} <b>Телефон:</b> ${escapeHtml(phone)}\n\n` +
    `${TG.form} <b>Повідомлення:</b>\n${escapeHtml(message)}`
  );
}

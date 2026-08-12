import { ADDRESS } from "@/constants/contacts";
import type { CartItem, OrderCustomer } from "@/types/cart";
import { TG } from "./icons";

function formatDeliveryLine(customer: OrderCustomer): string {
  if (customer.deliveryType === "pickup") {
    return `${TG.location} <b>Отримання:</b> Самовивіз (${ADDRESS})\n`;
  }
  return `${TG.location} <b>Адреса:</b> ${customer.address}\n`;
}

function formatTimeLine(customer: OrderCustomer): string {
  if (customer.timeMode === "asap") {
    return `${TG.time} <b>Час:</b> Якнайшвидше\n`;
  }
  return `${TG.time} <b>Час:</b> ${customer.scheduledAt ?? ""}\n`;
}

function formatCartItems(items: CartItem[]): string {
  return items
    .map((item, index) => {
      const lineTotal = item.price * item.quantity;
      const lines = [
        `${index + 1}. <b>${item.name}</b> × ${item.quantity} — ${lineTotal} грн`,
      ];
      if (item.weight) {
        lines.push(`   ${item.weight} г`);
      }
      return lines.join("\n");
    })
    .join("\n");
}

/** HTML-текст повідомлення про нове замовлення для Telegram. */
export function formatOrderTelegramMessage({
  orderNumber,
  customer,
  items,
  total,
}: {
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  total: number;
}): string {
  return (
    `${TG.form} <b>Нове замовлення</b>\n` +
    `${TG.number} <b>Номер:</b> ${orderNumber}\n\n` +
    `${TG.name} <b>Ім'я:</b> ${customer.name}\n` +
    `${TG.phone} <b>Телефон:</b> ${customer.phone}\n` +
    formatDeliveryLine(customer) +
    formatTimeLine(customer) +
    `${TG.payment} <b>Оплата:</b> ${customer.payment}\n` +
    (customer.comment
      ? `${TG.message} <b>Коментар:</b> ${customer.comment}\n`
      : "") +
    `\n${TG.cart} <b>Страви:</b>\n` +
    formatCartItems(items) +
    `\n\n${TG.total} <b>Сума:</b> ${total} грн`
  );
}

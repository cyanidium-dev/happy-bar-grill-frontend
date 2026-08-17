import { ADDRESS } from "@/constants/contacts";
import type { CartItem, OrderCustomer, PaymentMethod } from "@/types/cart";
import { escapeHtml } from "./escapeHtml";
import { TG } from "./icons";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Готівкою при отриманні",
  card: "Карткою при отриманні",
};

function formatFulfillmentTypeLine(customer: OrderCustomer): string {
  if (customer.deliveryType === "pickup") {
    return `${TG.fulfillment} <b>Спосіб отримання:</b> Самовивіз\n`;
  }
  return `${TG.fulfillment} <b>Спосіб отримання:</b> Доставка\n`;
}

function formatAddressLine(customer: OrderCustomer): string {
  if (customer.deliveryType === "pickup") {
    return `${TG.location} <b>Адреса самовивозу:</b> ${escapeHtml(ADDRESS)}\n`;
  }
  return `${TG.location} <b>Адреса доставки:</b> ${escapeHtml(customer.address ?? "")}\n`;
}

function formatTimeLine(customer: OrderCustomer): string {
  if (customer.timeMode === "asap") {
    return `${TG.time} <b>Час:</b> Якнайшвидше\n`;
  }
  return `${TG.time} <b>Час:</b> ${escapeHtml(customer.scheduledAt ?? "")}\n`;
}

function formatCartItems(items: CartItem[]): string {
  return items
    .map((item, index) => {
      const lineTotal = item.price * item.quantity;
      const lines = [
        `${index + 1}. <b>${escapeHtml(item.name)}</b> × ${item.quantity} — ${lineTotal} грн`,
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
    `${TG.number} <b>Номер:</b> ${escapeHtml(orderNumber)}\n\n` +
    `${TG.name} <b>Ім'я:</b> ${escapeHtml(customer.name)}\n` +
    `${TG.phone} <b>Телефон:</b> ${escapeHtml(customer.phone)}\n` +
    formatFulfillmentTypeLine(customer) +
    formatAddressLine(customer) +
    formatTimeLine(customer) +
    `${TG.payment} <b>Оплата:</b> ${PAYMENT_LABELS[customer.payment]}\n` +
    (customer.comment
      ? `${TG.message} <b>Коментар:</b> ${escapeHtml(customer.comment)}\n`
      : "") +
    `\n${TG.cart} <b>Страви:</b>\n` +
    formatCartItems(items) +
    `\n\n${TG.total} <b>Сума:</b> ${total} грн`
  );
}

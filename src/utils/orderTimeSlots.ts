import {
  CLOSING_HOUR,
  CLOSING_MINUTE,
  OPENING_HOUR,
  OPENING_MINUTE,
  ORDER_PREP_MINUTES,
  ORDER_SLOT_INTERVAL_MINUTES,
} from "@/constants/contacts";
import type { DeliveryType } from "@/types/cart";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

function formatSlot(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${pad2(hours)}:${pad2(minutes)}`;
}

/**
 * Half-hour slots within opening hours for today.
 * First slot is at least `ORDER_PREP_MINUTES` after opening and after now
 * (kitchen needs ~1 hour). Last slot is strictly before closing.
 */
export function getAvailableTimeSlots(
  _deliveryType: DeliveryType,
  now: Date = new Date(),
): string[] {
  const open = toMinutes(OPENING_HOUR, OPENING_MINUTE);
  const close = toMinutes(CLOSING_HOUR, CLOSING_MINUTE);
  if (close <= open) return [];

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const earliest = Math.max(open + ORDER_PREP_MINUTES, nowMinutes + ORDER_PREP_MINUTES);

  const slots: string[] = [];
  for (
    let minutes = open + ORDER_PREP_MINUTES;
    minutes < close;
    minutes += ORDER_SLOT_INTERVAL_MINUTES
  ) {
    if (minutes >= earliest) {
      slots.push(formatSlot(minutes));
    }
  }

  return slots;
}

/** Whether `HH:mm` is currently offered for the given fulfillment type. */
export function isAvailableTimeSlot(
  deliveryType: DeliveryType,
  time: string,
  now: Date = new Date(),
): boolean {
  return getAvailableTimeSlots(deliveryType, now).includes(time);
}

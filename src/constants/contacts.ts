/**
 * Contact / delivery constants. Placeholder values (matches the [брекети] in
 * the copy doc) — replace with real data, or move to the CMS, before launch.
 */

import type { Locale } from "@/i18n/routing";

export const PHONE = "+380 63 300 00 00";
/** `tel:` target — digits only. */
export const PHONE_HREF = "+380633000000";

export const ADDRESS_BY_LOCALE: Record<Locale, string> = {
  uk: "м. Миколаїв",
  ru: "г. Николаев",
};

/** Ukrainian default — Telegram and locale-agnostic uses. */
export const ADDRESS = ADDRESS_BY_LOCALE.uk;

export function venueAddress(locale: Locale): string {
  return ADDRESS_BY_LOCALE[locale];
}

export const EMAIL = "info@vtiha.ua";

/* Social profiles — replace with the real accounts before launch. */
export const INSTAGRAM_URL = "https://instagram.com";
export const TELEGRAM_URL = "https://t.me";
export const TIKTOK_URL = "https://tiktok.com";

/* Studio credit (footer). */
export const DEVELOPER_URL = "https://www.code-site.art/";
export const DEVELOPER_NAME = "code-site.art";

/** Opening hours used for schedule copy and checkout time slots. */
export const OPENING_HOUR = 10;
export const OPENING_MINUTE = 0;
export const CLOSING_HOUR = 22;
export const CLOSING_MINUTE = 0;
/** Checkout “scheduled” order slots. */
export const ORDER_SLOT_INTERVAL_MINUTES = 30;
/**
 * Min minutes from “now” (and from opening) before a slot is offered.
 * Kitchen needs ~1 hour to prepare an order.
 */
export const ORDER_PREP_MINUTES = 60;

export const SCHEDULE = `Щодня ${String(OPENING_HOUR).padStart(2, "0")}:${String(OPENING_MINUTE).padStart(2, "0")}–${String(CLOSING_HOUR).padStart(2, "0")}:${String(CLOSING_MINUTE).padStart(2, "0")}`;

/** [орієнтовний час] placeholder from the copy doc. */
export const DELIVERY_TIME = "40–60 хв";

/** Used on the /delivery page (not shown in the home block). */
export const MIN_ORDER_AMOUNT = 300;
export const MIN_ORDER = `${MIN_ORDER_AMOUNT} грн`;
export const DELIVERY_COST = "від 0 грн у межах міста";

/** Used to build the Google Maps embed query. */
export const MAP_QUERY = "Миколаїв";

/** Public reviews page (Google Maps profile). */
export const REVIEWS_URL = "https://maps.google.com";

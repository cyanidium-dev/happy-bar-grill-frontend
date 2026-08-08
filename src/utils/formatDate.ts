import type { Locale } from "@/i18n/routing";

const localeTag: Record<Locale, string> = {
  uk: "uk-UA",
  ru: "ru-RU",
};

/** Localized long date (e.g. "8 серпня 2026") from a Sanity ISO timestamp. */
export function formatBlogDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag[locale] ?? "uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

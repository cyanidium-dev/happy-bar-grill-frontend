import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/**
 * Route segment keys inside the `Metadata` namespace in `messages/*.json`.
 * Add a key here + a matching entry in every locale file when you add a page.
 */
export type MetadataKey =
  | "home"
  | "menu"
  | "about"
  | "delivery"
  | "contacts"
  | "blog"
  | "checkout"
  | "confirmation"
  | "privacy"
  | "offer"
  | "notFound";

/**
 * Builds localized, SEO-ready `<title>`/`<description>` for a static page from
 * the shared `Metadata` namespace. Keeps `generateMetadata` in every page a
 * one-liner instead of repeating the translation plumbing.
 *
 * Dynamic pages (menu category, blog article) build metadata from CMS data
 * instead and should not use this helper.
 */
export async function buildPageMetadata(
  locale: Locale,
  key: MetadataKey,
  options: { absoluteTitle?: boolean } = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t(`${key}.title`);

  return {
    // `absolute` opts out of the layout's "%s | Brand" template — used for the
    // home page whose SEO title already contains the full brand.
    title: options.absoluteTitle ? { absolute: title } : title,
    description: t(`${key}.description`),
  };
}

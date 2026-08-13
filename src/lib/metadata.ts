import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { fetchSiteSeoByPageId } from "@/data/siteSeo";
import { buildMetadataFromSeo } from "@/lib/seo/pageSeo";
import {
  METADATA_KEY_TO_SEO_PAGE,
  SITE_SEO_CONFIG,
  type MetadataKey,
} from "@/lib/seo/siteSeoConfig";

export type { MetadataKey };

/** Checkout, confirmation and legal pages stay out of the search index. */
const NOINDEX_METADATA_KEYS = new Set<MetadataKey>([
  "checkout",
  "confirmation",
  "privacy",
  "offer",
]);

/**
 * Builds localized SEO metadata for a static page.
 *
 * When the key maps to a Sanity SEO singleton (seoHomePage, …), data is
 * fetched from the admin panel. Empty CMS fields fall back to
 * messages/{locale}.json Metadata. Pages without a singleton (checkout,
 * privacy, …) use messages only, still with canonical / hreflang / OG / Twitter.
 */
export async function buildPageMetadata(
  locale: Locale,
  key: MetadataKey,
  options: { absoluteTitle?: boolean } = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const defaultTitle = t(`${key}.title`);
  const defaultDescription = t(`${key}.description`);

  const pageId = METADATA_KEY_TO_SEO_PAGE[key];
  const path = pageId ? SITE_SEO_CONFIG[pageId].path : pathForMetadataKey(key);
  const seo = pageId
    ? await fetchSiteSeoByPageId(pageId, locale).catch(() => null)
    : null;

  const robots = NOINDEX_METADATA_KEYS.has(key)
    ? { index: false, follow: false }
    : undefined;

  const hasCmsTitle = Boolean(seo?.metaTitle?.trim());

  return buildMetadataFromSeo({
    seo,
    locale,
    path,
    defaultTitle,
    defaultDescription,
    // CMS titles are authored complete (often include the brand). Message
    // fallbacks stay relative so the layout `%s | Brand` template applies —
    // except home, which opts into an absolute title.
    absoluteTitle: options.absoluteTitle ?? hasCmsTitle,
    robots,
  });
}

/** Locale-agnostic path for keys that have no Sanity singleton. */
function pathForMetadataKey(key: MetadataKey): string {
  switch (key) {
    case "checkout":
      return "/checkout";
    case "confirmation":
      return "/confirmation";
    case "privacy":
      return "/privacy";
    case "offer":
      return "/offer";
    case "notFound":
      return "/";
    default:
      return "/";
  }
}

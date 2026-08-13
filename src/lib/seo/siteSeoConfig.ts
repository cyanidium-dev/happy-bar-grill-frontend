/**
 * Sanity SEO singletons from happy-bar-grill-admin (`siteSeoPages.ts` + `blogPage`).
 * Each entry maps a fixed document `_id` → route path used for canonical/hreflang.
 */
export const SITE_SEO_PAGE_IDS = [
  "seoHomePage",
  "seoMenuPage",
  "seoDeliveryPage",
  "seoAboutPage",
  "seoContactsPage",
  "blogPage",
] as const;

export type SiteSeoPageId = (typeof SITE_SEO_PAGE_IDS)[number];

/** Route segment keys inside the Metadata namespace in messages/*.json. */
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

export type SiteSeoPageConfig = {
  /** Locale-agnostic pathname (without /ru prefix), e.g. /menu. */
  path: string;
  /** Key inside messages Metadata namespace used as title/description fallback. */
  metadataKey: MetadataKey;
};

export const SITE_SEO_CONFIG: Record<SiteSeoPageId, SiteSeoPageConfig> = {
  seoHomePage: { path: "/", metadataKey: "home" },
  seoMenuPage: { path: "/menu", metadataKey: "menu" },
  seoDeliveryPage: { path: "/delivery", metadataKey: "delivery" },
  seoAboutPage: { path: "/about", metadataKey: "about" },
  seoContactsPage: { path: "/contacts", metadataKey: "contacts" },
  blogPage: { path: "/blog", metadataKey: "blog" },
};

/** `Metadata` message key → Sanity singleton (pages without admin SEO omit). */
export const METADATA_KEY_TO_SEO_PAGE: Partial<
  Record<MetadataKey, SiteSeoPageId>
> = {
  home: "seoHomePage",
  menu: "seoMenuPage",
  delivery: "seoDeliveryPage",
  about: "seoAboutPage",
  contacts: "seoContactsPage",
  blog: "blogPage",
};

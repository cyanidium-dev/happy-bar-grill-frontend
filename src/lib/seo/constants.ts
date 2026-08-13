/** Canonical site origin. Override in production via `NEXT_PUBLIC_SITE_URL`. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://happy-bar-grill.vercel.app";

/**
 * Flip to `true` after the permanent domain is live. While `false`, the whole
 * site is `noindex` / `nofollow` and `robots.txt` disallows everything.
 */
export const SITE_ALLOW_INDEXING = false;

/** Default share image — `src/app/opengraph-image.jpg` served by Next.js. */
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL.replace(/\/$/, "")}/opengraph-image.jpg`;

export const SITE_NAME = "Vtiha";

export const OG_LOCALE: Record<"uk" | "ru", string> = {
  uk: "uk_UA",
  ru: "ru_UA",
};

export const HREFLANG: Record<"uk" | "ru", string> = {
  uk: "uk-UA",
  ru: "ru-UA",
};

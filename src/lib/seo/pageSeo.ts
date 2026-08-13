import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { PageSeo } from "@/types/seo";
import {
  HREFLANG,
  OG_LOCALE,
  SITE_ALLOW_INDEXING,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/constants";
import { resolveSocialImageUrl } from "@/lib/seo/seoImage";

type OpenGraphTypeOption = "website" | "article";

export type BuildMetadataParams = {
  seo?: PageSeo | null;
  locale: Locale;
  /**
   * Locale-agnostic pathname starting with `/`
   * (e.g. `/`, `/menu`, `/menu/burgers/classic`).
   */
  path: string;
  defaultTitle: string;
  defaultDescription: string;
  /** Absolute title — skips the layout `%s | Brand` template. */
  absoluteTitle?: boolean;
  openGraphType?: OpenGraphTypeOption;
  publishedTime?: string;
  modifiedTime?: string;
  /** When set, skips indexing (checkout, confirmation, etc.). */
  robots?: Metadata["robots"];
  /** Used when CMS has no `opengraphImage` (e.g. article hero, dish photo). */
  fallbackImageUrl?: string | null;
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Localized pathname for a given locale (respects `localePrefix: "as-needed"`). */
export function localizedPathname(locale: Locale, path: string): string {
  const normalized = normalizePath(path);
  if (locale === routing.defaultLocale) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

function absoluteUrl(pathname: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  if (!pathname || pathname === "/") return `${base}/`;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/** Canonical + hreflang alternates for uk/ru. */
export function buildLanguageAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};

  for (const loc of routing.locales) {
    languages[HREFLANG[loc]] = absoluteUrl(localizedPathname(loc, path));
  }
  languages["x-default"] = absoluteUrl(
    localizedPathname(routing.defaultLocale, path),
  );

  return {
    canonical: absoluteUrl(localizedPathname(locale, path)),
    languages,
  };
}

function normalizeKeywords(
  keywords: PageSeo["keywords"],
): string[] | undefined {
  if (!keywords) return undefined;
  if (Array.isArray(keywords)) {
    return keywords.length > 0 ? keywords : undefined;
  }
  if (typeof keywords === "string") {
    const parsed = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    return parsed.length > 0 ? parsed : undefined;
  }
  return undefined;
}

/**
 * Converts a Sanity `seoSettings` payload (already localized) into Next.js
 * Metadata. Falls back to `defaultTitle` / `defaultDescription` when CMS
 * fields are empty. Always emits canonical, hreflang, Open Graph and Twitter.
 */
export function buildMetadataFromSeo({
  seo,
  locale,
  path,
  defaultTitle,
  defaultDescription,
  absoluteTitle = false,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
  robots,
  fallbackImageUrl,
}: BuildMetadataParams): Metadata {
  const metaTitle = seo?.metaTitle?.trim() || defaultTitle;
  const metaDescription =
    seo?.metaDescription?.trim() || defaultDescription;
  const ogTitle = seo?.opengraphTitle?.trim() || metaTitle;
  const ogDescription =
    seo?.opengraphDescription?.trim() || metaDescription;
  const ogImageUrl = resolveSocialImageUrl(seo, fallbackImageUrl);
  const keywords = normalizeKeywords(seo?.keywords);
  const alternates = buildLanguageAlternates(path, locale);
  const canonicalUrl = alternates.canonical as string;

  const ogImages = [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: seo?.opengraphImage?.alt?.trim() || metaTitle,
    },
  ];

  const resolvedRobots = !SITE_ALLOW_INDEXING
    ? { index: false, follow: false }
    : robots;

  // Layout uses `%s | Vtiha`. Skip the template when the title already ends
  // with the brand (CMS fields are often authored complete).
  const useAbsoluteTitle =
    absoluteTitle ||
    metaTitle === SITE_NAME ||
    metaTitle.endsWith(` | ${SITE_NAME}`) ||
    metaTitle.endsWith(` — ${SITE_NAME}`) ||
    metaTitle.endsWith(` - ${SITE_NAME}`);

  return {
    title: useAbsoluteTitle ? { absolute: metaTitle } : metaTitle,
    description: metaDescription,
    keywords,
    alternates,
    robots: resolvedRobots,
    openGraph: {
      type: openGraphType,
      title: ogTitle,
      description: ogDescription,
      locale: OG_LOCALE[locale],
      siteName: SITE_NAME,
      url: canonicalUrl,
      images: ogImages,
      ...(openGraphType === "article" && publishedTime
        ? { publishedTime }
        : {}),
      ...(openGraphType === "article" && modifiedTime
        ? { modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}

export function pageCanonicalUrl(locale: Locale, path: string): string {
  return absoluteUrl(localizedPathname(locale, path));
}

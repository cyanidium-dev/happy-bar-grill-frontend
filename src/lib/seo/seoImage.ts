import type { PageSeo } from "@/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { DEFAULT_SOCIAL_IMAGE_URL } from "@/lib/seo/constants";

/** Resolve OG image URL from Sanity `seoSettings.opengraphImage` (1200×630). */
export function resolveOpengraphImageUrl(
  seo?: PageSeo | null,
): string | undefined {
  if (!seo?.opengraphImage?.asset?._ref) return undefined;
  return urlForImage(seo.opengraphImage)
    .width(1200)
    .height(630)
    .fit("fill")
    .url();
}

/**
 * CMS OG image → optional page-specific fallback (hero/product) → site default.
 */
export function resolveSocialImageUrl(
  seo?: PageSeo | null,
  fallbackImageUrl?: string | null,
): string {
  const fallback = fallbackImageUrl?.trim() || undefined;
  return (
    resolveOpengraphImageUrl(seo) ?? fallback ?? DEFAULT_SOCIAL_IMAGE_URL
  );
}

import type { PageSeo } from "@/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { defaultSocialImageUrl } from "@/lib/seo/constants";

/** Resolve OG image URL from Sanity `seoSettings.opengraphImage` (1200×630). */
export function resolveOpengraphImageUrl(
  seo?: PageSeo | null,
): string | undefined {
  if (!seo?.opengraphImage?.asset?._ref) return undefined;
  try {
    const url = urlForImage(seo.opengraphImage)
      .width(1200)
      .height(630)
      .fit("fill")
      .url();
    return url?.trim() || undefined;
  } catch {
    return undefined;
  }
}

/**
 * CMS OG image → dish/article photo (if provided) → site default
 * (`public/opengraph-image.jpg`).
 */
export function resolveSocialImageUrl(
  seo?: PageSeo | null,
  fallbackImageUrl?: string | null,
): string {
  return (
    resolveOpengraphImageUrl(seo) ??
    fallbackImageUrl?.trim() ??
    defaultSocialImageUrl()
  );
}

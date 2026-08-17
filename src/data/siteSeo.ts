import { cache } from "react";
import type { PageSeo } from "@/types/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SEO_BY_DOCUMENT_ID } from "@/sanity/lib/queries";
import type { Locale } from "@/i18n/routing";
import type { SiteSeoPageId } from "@/lib/seo/siteSeoConfig";

export const fetchSiteSeoByPageId = cache(
  async (pageId: SiteSeoPageId, locale: Locale): Promise<PageSeo | null> => {
    const row = await sanityFetch<{ seo?: PageSeo | null } | null>({
      query: SITE_SEO_BY_DOCUMENT_ID,
      params: { documentId: pageId, locale },
      tags: ["site-seo", `site-seo:${pageId}`],
    });
    return row?.seo ?? null;
  },
);

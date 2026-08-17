import { getLocale } from "next-intl/server";
import { fetchSiteSeoByPageId } from "@/data/siteSeo";
import { SchemaJsonFromSeo } from "@/components/seo/SchemaJsonFromSeo";
import type { SiteSeoPageId } from "@/lib/seo/siteSeoConfig";
import type { Locale } from "@/i18n/routing";

/** Uploaded schema.org JSON for a site SEO singleton. */
export async function SitePageSeo({ pageId }: { pageId: SiteSeoPageId }) {
  const locale = (await getLocale()) as Locale;
  const seo = await fetchSiteSeoByPageId(pageId, locale).catch(() => null);
  return <SchemaJsonFromSeo seo={seo} />;
}

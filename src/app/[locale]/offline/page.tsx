import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import OfflineView from "@/components/pwa/OfflineView";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "offline");
}

/**
 * Served by the service worker when a navigation fails with no cached copy of
 * the requested page.
 *
 * It must be fully static: it is precached at install time, so anything
 * request-scoped or fetched would either fail to cache or render stale. The
 * links it offers all point at screens that work from localStorage alone.
 */
export default async function OfflinePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1">
      <section className="bg-white">
        <OfflineView />
        <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
      </section>
    </div>
  );
}

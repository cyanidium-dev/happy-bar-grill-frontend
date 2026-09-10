import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import FavoritesView from "@/components/favorites/FavoritesView";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "favorites");
}

export default async function FavoritesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <div className="flex-1">
      <BreadCrumbs items={[{ label: t("favorites.title") }]} />
      <section className="bg-white">
        <FavoritesView />
        <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
      </section>
    </div>
  );
}

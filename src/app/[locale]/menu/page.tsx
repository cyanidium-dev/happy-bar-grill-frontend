import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SeoText from "@/components/home/seoText/SeoText";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import MenuBanner from "@/components/menu/MenuBanner";
import MenuView from "@/components/menu/MenuView";
import { SitePageSeo } from "@/components/seo/SitePageSeo";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "menu");
}

export default async function MenuPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <main className="flex-1">
      <MenuBanner />
      <BreadCrumbs items={[{ label: t("menu.title") }]} />
      <MenuView activeSlug="all" />
      <SeoText
        namespace="Menu.seo"
        className="rounded-t-[24px] lg:rounded-t-[36px] overflow-hidden relative top-0 lg:-top-6"
        titleClassName="max-w-[200px] xs:max-w-none md:max-w-[220px]"
      />
      <SitePageSeo pageId="seoMenuPage" />
    </main>
  );
}

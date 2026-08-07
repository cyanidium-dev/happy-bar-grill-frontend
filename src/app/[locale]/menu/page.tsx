import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import MenuBanner from "@/components/menu/MenuBanner";
import MenuView from "@/components/menu/MenuView";
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
    <>
      <MenuBanner />
      <BreadCrumbs items={[{ label: t("menu.title") }]} />
      <MenuView activeSlug="all" />
    </>
  );
}

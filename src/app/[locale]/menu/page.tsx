import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
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

  // Full catalog / default category view (dishes open in a modal) later.
  return (
    <>
      <BreadCrumbs items={[{ label: t("menu.title") }]} />
      <PagePlaceholder title={t("menu.title")} />
    </>
  );
}

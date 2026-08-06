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
  return buildPageMetadata(locale, "confirmation");
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  // Post-order "thank you" / order-number screen later.
  return (
    <>
      <BreadCrumbs items={[{ label: t("confirmation.title") }]} />
      <PagePlaceholder title={t("confirmation.title")} />
    </>
  );
}

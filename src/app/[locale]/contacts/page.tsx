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
  return buildPageMetadata(locale, "contacts");
}

export default async function ContactsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <>
      <BreadCrumbs items={[{ label: t("contacts.title") }]} />
      <PagePlaceholder title={t("contacts.title")} />
    </>
  );
}

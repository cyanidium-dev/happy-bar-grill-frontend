import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "home");
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  // Sections (hero, categories, offers, bestsellers, reviews, contacts) later.
  return <PagePlaceholder title={t("home.title")} />;
}

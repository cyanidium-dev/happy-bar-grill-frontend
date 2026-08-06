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
  return buildPageMetadata(locale, "blog");
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  // Sections (articles list + pagination) later; data comes from the CMS.
  return (
    <>
      <BreadCrumbs items={[{ label: t("blog.title") }]} />
      <PagePlaceholder title={t("blog.title")} />
    </>
  );
}

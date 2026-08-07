import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
import { getCategoryBySlug, getDishBySlug } from "@/data/menu";
import type { PageProps } from "@/types/page";

type DishProps = PageProps<{ category: string; dish: string }>;

export async function generateMetadata({
  params,
}: DishProps): Promise<Metadata> {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const found = await getDishBySlug(category, dish, locale);
  if (!found) return {};

  return { title: found.name };
}

export default async function DishPage({ params }: DishProps) {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const [t, categoryDoc, dishDoc] = await Promise.all([
    getTranslations("Metadata"),
    getCategoryBySlug(category, locale),
    getDishBySlug(category, dish, locale),
  ]);

  if (!categoryDoc || !dishDoc) notFound();

  return (
    <>
      <BreadCrumbs
        items={[
          { label: t("menu.title"), href: "/menu" },
          { label: categoryDoc.name, href: `/menu/${category}` },
          { label: dishDoc.name },
        ]}
      />
      <PagePlaceholder title={dishDoc.name} />
    </>
  );
}

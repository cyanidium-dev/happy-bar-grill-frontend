import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import MenuBanner from "@/components/menu/MenuBanner";
import MenuView from "@/components/menu/MenuView";
import { SPECIAL_OFFERS_SLUG } from "@/constants/menu";
import { getCategories, getCategoryBySlug } from "@/data/menu";
import type { PageProps } from "@/types/page";

type MenuCategoryProps = PageProps<{ category: string }>;

// Pre-render every known category (dynamic slugs still 404 via notFound below).
// Slugs are language-agnostic — pass a fixed locale for generateStaticParams.
export async function generateStaticParams() {
  const categories = await getCategories("uk");
  return [
    { category: SPECIAL_OFFERS_SLUG },
    ...categories.map((category) => ({ category: category.slug })),
  ];
}

export async function generateMetadata({
  params,
}: MenuCategoryProps): Promise<Metadata> {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const found = await getCategoryBySlug(category, locale);
  if (!found) return {};

  return { title: found.name };
}

export default async function MenuCategoryPage({ params }: MenuCategoryProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const found = await getCategoryBySlug(category, locale);
  if (!found) notFound();

  const tMenu = await getTranslations("Metadata");

  return (
    <>
      <MenuBanner />
      <BreadCrumbs
        items={[
          { label: tMenu("menu.title"), href: "/menu" },
          { label: found.name },
        ]}
      />
      <MenuView activeSlug={category} />
    </>
  );
}

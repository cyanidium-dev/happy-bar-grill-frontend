import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
import { formatSlug } from "@/utils/formatSlug";
import type { PageProps } from "@/types/page";

type DishProps = PageProps<{ category: string; dish: string }>;

// Metadata will come from the CMS dish document later (name, description,
// price, image → OpenGraph); the slug is a temporary, SEO-safe stand-in.
export async function generateMetadata({
  params,
}: DishProps): Promise<Metadata> {
  const { dish } = await params;
  return { title: formatSlug(dish) };
}

export default async function DishPage({ params }: DishProps) {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");
  const categoryTitle = formatSlug(category);
  const dishTitle = formatSlug(dish);

  // Single dish page (gallery, description, weight, price, add-to-cart) later;
  // data comes from the CMS, resolved by the `[category]`/`[dish]` slugs.
  return (
    <>
      <BreadCrumbs
        items={[
          { label: t("menu.title"), href: "/menu" },
          { label: categoryTitle, href: `/menu/${category}` },
          { label: dishTitle },
        ]}
      />
      <PagePlaceholder title={dishTitle} />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link, redirect } from "@/i18n/navigation";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import Button from "@/components/shared/buttons/Button";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DishGallery from "@/components/menu/dish/DishGallery";
import DishDetails from "@/components/menu/dish/DishDetails";
import DishTabs, { type DishTab } from "@/components/menu/dish/DishTabs";
import SimilarDishes from "@/components/menu/dish/SimilarDishes";
import UpsellDishes from "@/components/menu/dish/UpsellDishes";
import Image from "next/image";
import {
  getAllDishes,
  getCategoryBySlug,
  getDishBySlug,
  getDishPathBySlug,
  getSimilarDishes,
  getUpsellDishes,
} from "@/data/menu";
import { buildMetadataFromSeo } from "@/lib/seo/pageSeo";
import { SchemaJsonFromSeo } from "@/components/seo/SchemaJsonFromSeo";
import { ALLERGENS, type GalleryImage, type Dish } from "@/types/content";
import type { Locale } from "@/i18n/routing";
import type { PageProps } from "@/types/page";

type DishProps = PageProps<{ category: string; dish: string }>;

/** Main image first, then the CMS gallery (de-duplicated against it). */
function galleryImages(dish: Dish): GalleryImage[] {
  const extra = (dish.gallery ?? []).filter((img) => img.url !== dish.image);
  return [{ url: dish.image, alt: dish.name }, ...extra];
}

/** Load the dish, or send wrong-category URLs to the canonical permalink. */
async function requireDish(category: string, dish: string, locale: Locale) {
  const [categoryDoc, dishDoc] = await Promise.all([
    getCategoryBySlug(category, locale),
    getDishBySlug(category, dish, locale),
  ]);
  if (categoryDoc && dishDoc) return { categoryDoc, dishDoc };

  const canonical = await getDishPathBySlug(dish, locale);
  if (
    canonical?.categorySlug &&
    canonical.slug &&
    canonical.categorySlug !== category
  ) {
    redirect({
      href: `/menu/${canonical.categorySlug}/${canonical.slug}`,
      locale,
    });
  }

  notFound();
}

// Pre-render every dish (unknown slugs still 404 via notFound below).
export async function generateStaticParams() {
  const dishes = await getAllDishes("uk");
  return dishes.map((dish) => ({
    category: dish.categorySlug,
    dish: dish.slug,
  }));
}

export async function generateMetadata({
  params,
}: DishProps): Promise<Metadata> {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const found = await requireDish(category, dish, locale);

  return buildMetadataFromSeo({
    seo: found.dishDoc.seo,
    locale,
    path: `/menu/${category}/${dish}`,
    defaultTitle: found.dishDoc.name,
    defaultDescription: found.dishDoc.description || "",
    fallbackImageUrl: found.dishDoc.image,
  });
}

export default async function DishPage({ params }: DishProps) {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const [t, tMeta, { categoryDoc, dishDoc }] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Metadata"),
    requireDish(category, dish, locale),
  ]);

  const [similar, upsell] = await Promise.all([
    getSimilarDishes(category, dish, locale),
    getUpsellDishes(locale),
  ]);

  const similarKeys = new Set(
    similar.map((item) => `${item.categorySlug}/${item.slug}`),
  );
  const upsellDishes = upsell.filter((item) => {
    const key = `${item.categorySlug}/${item.slug}`;
    return key !== `${category}/${dish}` && !similarKeys.has(key);
  });

  const images = galleryImages(dishDoc);

  const deliveryLink = (
    <Link
      href="/delivery"
      className="w-fit text-16semi text-navy underline-offset-4 transition-colors duration-300 hover:text-red hover:underline"
    >
      {t("deliveryLink")}
    </Link>
  );

  const knownAllergens = (dishDoc.allergens ?? []).filter((code) =>
    ALLERGENS.includes(code),
  );

  const tabs: DishTab[] = [
    ...(dishDoc.ingredients
      ? [
          {
            id: "ingredients",
            label: t("tabIngredients"),
            content: <p>{dishDoc.ingredients}</p>,
          },
        ]
      : []),
    ...(knownAllergens.length
      ? [
          {
            id: "allergens",
            label: t("tabAllergens"),
            content: (
              <ul className="flex list-disc flex-col gap-1 pl-5">
                {knownAllergens.map((code) => (
                  <li key={code}>{t(`allergens.${code}`)}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    {
      id: "delivery",
      label: t("tabDelivery"),
      content: (
        <div className="flex flex-col gap-3">
          <p>{t("deliveryText")}</p>
          {deliveryLink}
        </div>
      ),
    },
    {
      id: "payment",
      label: t("tabPayment"),
      content: (
        <div className="flex flex-col gap-3">
          <p>{t("paymentText")}</p>
          {deliveryLink}
        </div>
      ),
    },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dishDoc.name,
    image: images.map((img) => img.url),
    ...(dishDoc.description ? { description: dishDoc.description } : {}),
    offers: {
      "@type": "Offer",
      price: dishDoc.price,
      priceCurrency: "UAH",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <BreadCrumbs
        items={[
          { label: tMeta("menu.title"), href: "/menu" },
          { label: categoryDoc.name, href: `/menu/${category}` },
          { label: dishDoc.name },
        ]}
      />

      <section className="bg-white pt-14">
        <Container className="pb-12 pt-6 md:pb-16 xl:pb-20">
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-14 ">
            <AnimatedWrapper
              animation={{ y: 20 }}
              className="w-full sm:w-1/2 shrink-0"
            >
              <DishGallery
                images={images}
                priority
                labels={{
                  prev: t("galleryPrev"),
                  next: t("galleryNext"),
                  open: t("galleryOpen"),
                  counter: t("galleryCounter", {
                    index: "{index}",
                    total: "{total}",
                  }),
                }}
              />
            </AnimatedWrapper>

            <AnimatedWrapper animation={{ y: 20, delay: 0.08 }}>
              <DishDetails dish={dishDoc} />
            </AnimatedWrapper>
          </div>

          <AnimatedWrapper animation={{ y: 20 }} className="mt-14 md:mt-18">
            <DishTabs tabs={tabs} />
          </AnimatedWrapper>
        </Container>
      </section>

      <UpsellDishes dishes={upsellDishes} />
      <SimilarDishes dishes={similar} />
      <SchemaJsonFromSeo seo={dishDoc.seo} />

      <Section
        background="white"
        className="relative -top-18 pt-10 pb-[120px] md:pb-[140px] xl:pb-[160px]"
        sectionAside={
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/home/seo-text/bg-image.webp"
              alt={t("alts.bgImage")}
              fill
              sizes="100vw"
              className="object-cover -scale-x-100"
            />
          </div>
        }
      >
        <div
          aria-hidden
          className="hidden md:block pointer-events-none absolute md:top-48 md:left-10 lg:left-220 lg:top-60 xl:top-70  xl:left-300 z-1 h-[85px] w-[110px]"
        >
          <Image
            src="/images/home/seo-text/onion-small.webp"
            alt={t("alts.onionSmall")}
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        <div
          aria-hidden
          className="hidden md:block pointer-events-none absolute z-1 md:top-18 md:left-140 lg:left-180 lg:top-24 xl:top-30 xl:left-260 z-10 h-[229px] w-[213px]"
        >
          <Image
            src="/images/home/seo-text/onion-large.webp"
            alt={t("alts.onionLarge")}
            fill
            sizes="213px"
            className="object-cover"
          />
        </div>
        <AnimatedWrapper
          animation={{ y: 20 }}
          className="flex w-full flex-col gap-16"
        >
          <SectionTitle variant="white" className="text-center">
            {t("ctaTitle")}
          </SectionTitle>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between xl:gap-48 mx-auto">
            <p className="max-w-[307px] text-16reg text-white text-center xl:text-left">
              {t("ctaDescription")}
            </p>
            <Button href="/menu" size="lg" className="shrink-0">
              {t("ctaButton")}
            </Button>
          </div>
        </AnimatedWrapper>
      </Section>
    </>
  );
}

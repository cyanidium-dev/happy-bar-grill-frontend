import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
import Image from "next/image";
import {
  getAllDishes,
  getCategoryBySlug,
  getDishBySlug,
  getSimilarDishes,
} from "@/data/menu";
import type { GalleryImage, Dish } from "@/types/content";
import type { PageProps } from "@/types/page";

type DishProps = PageProps<{ category: string; dish: string }>;

/** Main image first, then the CMS gallery (de-duplicated against it). */
function galleryImages(dish: Dish): GalleryImage[] {
  const extra = (dish.gallery ?? []).filter((img) => img.url !== dish.image);
  return [{ url: dish.image, alt: dish.name }, ...extra];
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

  const found = await getDishBySlug(category, dish, locale);
  if (!found) return {};

  const images = galleryImages(found).map((img) => img.url);
  return {
    title: found.name,
    description: found.description || undefined,
    openGraph: { title: found.name, images },
  };
}

export default async function DishPage({ params }: DishProps) {
  const { locale, category, dish } = await params;
  setRequestLocale(locale);

  const [t, tMeta, categoryDoc, dishDoc] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Metadata"),
    getCategoryBySlug(category, locale),
    getDishBySlug(category, dish, locale),
  ]);

  if (!categoryDoc || !dishDoc) notFound();

  const similar = await getSimilarDishes(category, dish, locale);
  const images = galleryImages(dishDoc);

  const deliveryLink = (
    <Link
      href="/delivery"
      className="w-fit text-16semi text-navy underline-offset-4 transition-colors duration-300 hover:text-red hover:underline"
    >
      {t("deliveryLink")}
    </Link>
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

      <SimilarDishes dishes={similar} />

      <Section
        background="white"
        className="relative -top-18 -z-10 text-center pt-10 pb-[120px] md:pb-[140px] xl:pb-[160px]"
        sectionAside={
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/home/seo-text/bg-image.webp"
              alt={t("alts.bgImage")}
              fill
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
            className="object-cover"
          />
        </div>
        <AnimatedWrapper
          animation={{ y: 20 }}
          className="flex flex-col items-center gap-6"
        >
          <SectionTitle
            variant="white"
            className="mb-10 max-w-[309px] lg:max-w-[440px] xl:max-w-[540px]"
          >
            {t("ctaTitle")}
          </SectionTitle>
          <Button href="/menu" size="lg">
            {t("ctaButton")}
          </Button>
        </AnimatedWrapper>
      </Section>
    </>
  );
}

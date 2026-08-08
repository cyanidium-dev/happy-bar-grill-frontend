import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import CheckoutView, {
  type UpsellCard,
} from "@/components/checkout/CheckoutView";
import DishCard from "@/components/shared/cards/DishCard";
import { getUpsellDishes } from "@/data/menu";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "checkout");
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, upsell] = await Promise.all([
    getTranslations("Metadata"),
    getUpsellDishes(locale),
  ]);

  // DishCard is a server component, so render the recommended cards here and
  // hand them to the client checkout view (which filters/orders them).
  const upsellCards: UpsellCard[] = upsell.map((dish) => ({
    slug: dish.slug,
    node: <DishCard dish={dish} variant="beige" />,
  }));

  return (
    <>
      <BreadCrumbs items={[{ label: t("checkout.title") }]} />
      <section className="bg-white">
        <CheckoutView upsellCards={upsellCards} />
      </section>
    </>
  );
}

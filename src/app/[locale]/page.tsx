import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/hero/Hero";
import Categories from "@/components/home/categories/Categories";
import Promotions from "@/components/home/promotions/Promotions";
import PopularDishes from "@/components/home/popularDishes/PopularDishes";
import Reviews from "@/components/home/reviews/Reviews";
import DeliveryInfo from "@/components/home/deliveryInfo/DeliveryInfo";
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

  return (
    <main className="flex-1">
      <Hero />
      <Categories />
      <Promotions />
      <PopularDishes />
      <Reviews />
      <DeliveryInfo />
    </main>
  );
}

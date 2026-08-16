import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/hero/Hero";
import Categories from "@/components/home/categories/Categories";
import Promotions from "@/components/home/promotions/Promotions";
import PopularDishes from "@/components/home/popularDishes/PopularDishes";
import BurgerAnatomySection from "@/components/home/anatomy/BurgerAnatomySection";
import MarqueeStrip from "@/components/home/marquee/MarqueeStrip";
import Process from "@/components/home/process/Process";
import Reviews from "@/components/home/reviews/Reviews";
import DeliveryInfo from "@/components/home/deliveryInfo/DeliveryInfo";
import SeoText from "@/components/home/seoText/SeoText";
import { SitePageSeo } from "@/components/seo/SitePageSeo";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "home", { absoluteTitle: true });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1">
      <Hero />
      <Categories />
      <Promotions />
      <PopularDishes />
      <MarqueeStrip />
      <Process />
      <BurgerAnatomySection />
      <Reviews />
      <DeliveryInfo />
      <SeoText />
      <SitePageSeo pageId="seoHomePage" />
    </div>
  );
}

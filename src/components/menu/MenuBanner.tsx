import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import { getMenuBanner } from "@/data/menu";

/**
 * Promo banner shown on the menu catalog views (`/menu` and every
 * `/menu/[category]`) but NOT on a dish detail page — so it's rendered by those
 * pages directly rather than a parent layout (which would also wrap the dish
 * route). Content is a static placeholder for now and will come from the admin
 * panel later — see `getMenuBanner()` in `data/menu.ts`.
 */
export default async function MenuBanner() {
  const banner = getMenuBanner();
  const t = await getTranslations("Menu");

  const media = (
    <Image
      src={banner.imageDesktop}
      alt={t("bannerAlt")}
      fill
      priority
      sizes="(max-width: 1280px) 100vw, 1140px"
      className="object-cover"
    />
  );

  return (
    <Container className="w-full pt-14">
      <div className="relative aspect-[3/2] overflow-hidden rounded-tl-2xl rounded-br-2xl shadow-card xs:aspect-[2/1] lg:aspect-[1140/360]">
        {banner.href ? (
          <Link href={banner.href} className="block h-full w-full">
            {media}
          </Link>
        ) : (
          media
        )}
      </div>
    </Container>
  );
}

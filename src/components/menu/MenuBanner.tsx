import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import { getMenuBanner } from "@/data/menu";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

/**
 * Promo banner shown on the menu catalog views (`/menu` and every
 * `/menu/[category]`) but NOT on a dish detail page — so it's rendered by those
 * pages directly rather than a parent layout (which would also wrap the dish
 * route). Content comes from the Sanity `menuPageBanner` singleton.
 */
export default async function MenuBanner() {
  const banner = await getMenuBanner();
  if (!banner) return null;

  const t = await getTranslations("Menu");
  const alt = banner.alt || t("bannerAlt");

  const media = (
    <>
      <Image
        src={banner.imageMobile}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      <Image
        src={banner.imageDesktop}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1140px"
        className="hidden object-cover sm:block"
      />
    </>
  );

  const content =
    banner.href && isExternalHref(banner.href) ? (
      <a
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
      >
        {media}
      </a>
    ) : banner.href ? (
      <Link href={banner.href} className="block h-full w-full">
        {media}
      </Link>
    ) : (
      media
    );

  return (
    <Container className="w-full pt-14">
      <div className="relative aspect-[1120/708] overflow-hidden rounded-[24px] shadow-card sm:aspect-[2240/708] lg:rounded-[36px]">
        {content}
      </div>
    </Container>
  );
}

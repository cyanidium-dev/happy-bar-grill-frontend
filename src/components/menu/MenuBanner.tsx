import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import { getMenuBanner } from "@/data/menu";

/** Matches `Container` content width (padding + max-width at each breakpoint). */
const BANNER_SIZES =
  "(max-width: 639px) calc(100vw - 48px), (max-width: 767px) 592px, (max-width: 1023px) 720px, (max-width: 1279px) 864px, 1120px";

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

  const common = {
    alt,
    fill: true as const,
    sizes: BANNER_SIZES,
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: banner.imageDesktop });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({
    ...common,
    src: banner.imageMobile,
    loading: "eager",
    fetchPriority: "high",
  });

  const media = (
    <picture className="absolute inset-0">
      <source media="(min-width: 640px)" srcSet={desktop} />
      <img {...img} alt={alt} srcSet={mobile} className="object-cover" />
    </picture>
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

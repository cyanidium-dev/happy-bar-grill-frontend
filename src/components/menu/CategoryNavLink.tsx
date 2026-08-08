"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { MENU_CATALOG_ID, MENU_SCROLL_FLAG } from "@/constants/menu";

type CategoryNavLinkProps = Omit<ComponentProps<typeof Link>, "scroll" | "href"> & {
  href: string;
};

/**
 * Category chip / sidebar link. Disables Next's default scroll-to-top so
 * switching categories lands on the catalog (`#menu-catalog`), not the banner.
 */
export default function CategoryNavLink({
  href,
  onClick,
  ...props
}: CategoryNavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      scroll={false}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        // Same route — no pathname change, so scroll immediately.
        if (pathname === href) {
          document
            .getElementById(MENU_CATALOG_ID)
            ?.scrollIntoView({ block: "start" });
          return;
        }

        // Soft nav — `MenuCatalogScroll` scrolls after the new page paints.
        sessionStorage.setItem(MENU_SCROLL_FLAG, "1");
      }}
      {...props}
    />
  );
}

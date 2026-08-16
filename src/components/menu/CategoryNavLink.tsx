"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useMenuScrollSpy } from "@/components/menu/menuScrollSpy";
import { MENU_CATALOG_ID, MENU_SCROLL_FLAG } from "@/constants/menu";
import { cn } from "@/utils/cn";

type CategoryNavLinkProps = Omit<
  ComponentProps<typeof Link>,
  "scroll" | "href" | "className"
> & {
  href: string;
  /** Category slug this chip points at; `"all"` for the whole catalog. */
  slug: string;
  /** Active state worked out on the server, from the route. */
  routeActive: boolean;
  className?: string;
  activeClassName: string;
  inactiveClassName: string;
};

/**
 * Category chip / sidebar link.
 *
 * On the full catalog the categories are all on one page, so this scrolls to
 * the matching section and takes its active state from whatever the reader is
 * currently scrolled into. Everywhere else it stays a route link, and only
 * disables Next's scroll-to-top so switching categories lands on the catalog
 * rather than back up at the banner.
 */
export default function CategoryNavLink({
  href,
  slug,
  routeActive,
  className,
  activeClassName,
  inactiveClassName,
  onClick,
  ...props
}: CategoryNavLinkProps) {
  const pathname = usePathname();
  const spy = useMenuScrollSpy();

  // While scroll-spying, "all" is the state before the first section is
  // reached; otherwise the route decides.
  const active = spy.enabled
    ? slug === "all"
      ? spy.activeSlug === null
      : spy.activeSlug === slug
    : routeActive;

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        if (spy.enabled) {
          if (slug === "all") {
            event.preventDefault();
            document
              .getElementById(MENU_CATALOG_ID)
              ?.scrollIntoView({ block: "start", behavior: "smooth" });
            return;
          }
          // Falls through to normal navigation for categories that have no
          // section here — Special offers, which is a tag rather than a
          // category and so never appears in the grouped list.
          if (spy.scrollTo(slug)) {
            event.preventDefault();
            return;
          }
        }

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

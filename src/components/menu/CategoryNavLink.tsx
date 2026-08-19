"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { useMenuScrollSpy } from "@/components/menu/menuScrollSpy";
import { CATEGORY_PROGRESS_VAR } from "@/constants/menu";
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
  children,
  ...props
}: CategoryNavLinkProps) {
  const spy = useMenuScrollSpy();

  // The catalog is one page now, so the current category comes from the scroll
  // position. `routeActive` only seeds it for the first paint, before the spy
  // has reported anything.
  const active = spy.activeSlug ? spy.activeSlug === slug : routeActive;

  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        // Every chip has a section on the page, so nothing here navigates —
        // the URL is rewritten by the scroll instead. The href stays real so
        // the link is still shareable, openable in a new tab and crawlable.
        if (spy.scrollTo(slug)) event.preventDefault();
      }}
      {...props}
    >
      {/*
        Fills left to right as the reader moves through this category, so the
        highlight hands over to the next chip instead of snapping. Driven by a
        CSS variable the scroll-spy writes on every tick — React never sees it.
        Red over navy keeps the white label readable across both halves.
      */}
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-left rounded-full bg-red"
          style={{
            transform: `scaleX(var(${CATEGORY_PROGRESS_VAR}, 0))`,
          }}
        />
      ) : null}
      <span className="relative">{children}</span>
    </Link>
  );
}

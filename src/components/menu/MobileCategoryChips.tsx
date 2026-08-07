"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

export type CategoryChip = { label: string; href: string; active: boolean };

const itemBase = "transition-colors duration-300 focus-visible:outline-none";
const activeCls = "bg-navy text-white";
const inactiveCls =
  "bg-white text-navy ring-1 ring-navy hover:text-red hover:ring-red transition duration-300 ease-in-out";

/**
 * Horizontal sticky category chips (< xl). Each chip is a route link, so after
 * navigation the component re-renders with a new active chip — this centers the
 * active chip within the visible scroller (horizontal scroll only, no page jump).
 */
export default function MobileCategoryChips({
  items,
  ariaLabel,
}: {
  items: CategoryChip[];
  ariaLabel: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const activeHref = items.find((item) => item.active)?.href;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const active = scroller.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const left =
      scroller.scrollLeft +
      activeRect.left -
      scrollerRect.left -
      (scroller.clientWidth - activeRect.width) / 2;

    // `scrollTo` with `behavior: "smooth"` is unreliable on this container, and
    // instant centering is the right feel on navigation anyway (the active chip
    // simply appears centered). `scrollLeft` is clamped by the browser.
    scroller.scrollLeft = left;
  }, [activeHref]);

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky z-30 -mx-6 bg-white px-6 py-3 xl:hidden"
      style={{ top: "var(--header-height)" }}
    >
      <ul
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li
            key={item.href}
            data-active={item.active || undefined}
            className="shrink-0 py-0.5 px-0.5"
          >
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                itemBase,
                "inline-flex whitespace-nowrap rounded-full px-4 py-3 text-14med",
                item.active ? activeCls : inactiveCls,
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

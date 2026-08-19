"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import CategoryNavLink from "@/components/menu/CategoryNavLink";
import { useMenuScrollSpy } from "@/components/menu/menuScrollSpy";
import { cn } from "@/utils/cn";

export type CategoryChip = {
  label: string;
  href: string;
  slug: string;
  active: boolean;
};

const itemBase =
  "relative overflow-hidden transition-colors duration-500 ease-out focus-visible:outline-none";
const activeCls = "bg-navy text-white";
const inactiveCls =
  "bg-white text-navy ring-1 ring-navy hover:text-red hover:ring-red transition duration-300 ease-in-out";

/** Keep a little air so the active chip isn’t flush against the scroller edge. */
const EDGE_PAD = 8;

/**
 * Survives remounts when navigating between `/menu` and `/menu/[category]`.
 * Without this, `scrollLeft` resets to 0 on every route change and the strip
 * re-animates from the start — worse the farther the active chip is.
 */
let persistedScrollLeft = 0;

function clampScroll(scroller: HTMLElement, value: number) {
  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  return Math.max(0, Math.min(max, value));
}

/**
 * Bring `active` to the left edge. While scrolling the catalog the current
 * category should sit where the eye starts, with the ones still to come
 * visible after it — parking it at the right edge hides everything ahead.
 */
function leftAlignDelta(scroller: HTMLElement, active: HTMLElement) {
  return (
    active.getBoundingClientRect().left -
    scroller.getBoundingClientRect().left -
    EDGE_PAD
  );
}

/** Minimal delta so `active` sits fully inside the scroller (nearest, not center). */
function nearestDelta(scroller: HTMLElement, active: HTMLElement) {
  const scrollerRect = scroller.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const leftOverflow = scrollerRect.left + EDGE_PAD - activeRect.left;
  const rightOverflow = activeRect.right - (scrollerRect.right - EDGE_PAD);
  if (leftOverflow > 0) return -leftOverflow;
  if (rightOverflow > 0) return rightOverflow;
  return 0;
}

/**
 * Horizontal sticky category chips (< xl). Each chip is a route link, so after
 * navigation the list remounts — we restore the last scroll position, then ease
 * only the minimal distance needed to reveal the new active chip.
 */
export default function MobileCategoryChips({
  items,
  ariaLabel,
}: {
  items: CategoryChip[];
  ariaLabel: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const spy = useMenuScrollSpy();

  /**
   * On the full catalog the current category comes from how far the reader has
   * scrolled, not from the route — otherwise the strip sits still while the
   * highlight walks off past the right-hand edge. `null` there means "above
   * the first category", which is the All dishes chip.
   */
  const activeSlug = spy.enabled
    ? (spy.activeSlug ?? "all")
    : items.find((item) => item.active)?.slug;

  // Restore before paint so the strip never flashes at scrollLeft = 0.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = clampScroll(scroller, persistedScrollLeft);
  }, [activeSlug, spy.enabled]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const persist = () => {
      persistedScrollLeft = scroller.scrollLeft;
    };
    scroller.addEventListener("scroll", persist, { passive: true });

    const active = scroller.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) {
      return () => scroller.removeEventListener("scroll", persist);
    }

    // Ensure measurements use the restored position (layout effect ran first).
    const restoredFrom = persistedScrollLeft;
    scroller.scrollLeft = clampScroll(scroller, restoredFrom);

    const target = clampScroll(
      scroller,
      scroller.scrollLeft +
        (spy.enabled
          ? leftAlignDelta(scroller, active)
          : nearestDelta(scroller, active)),
    );
    const start = scroller.scrollLeft;
    const distance = target - start;

    // Native `scrollTo({ behavior: "smooth" })` is a no-op on this container, so
    // we tween `scrollLeft` ourselves. Honour reduced-motion (and skip a no-op).
    // Cold entry (no prior strip position) snaps — animating from 0 to a far
    // chip is the excess scroll users noticed.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Only a genuine remount starts cold. While scroll-spying the strip is the
    // same element throughout, so every move should be eased.
    const coldEntry = !spy.enabled && restoredFrom < 1;
    if (prefersReducedMotion || coldEntry || Math.abs(distance) < 1) {
      scroller.scrollLeft = target;
      persistedScrollLeft = target;
      return () => scroller.removeEventListener("scroll", persist);
    }

    // Longer and gentler than the route-change nudge: this one plays while the
    // reader is scrolling, so it should glide rather than snap.
    const duration = Math.min(620, Math.max(260, Math.abs(distance) * 0.9));
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 4;
    let startTime: number | null = null;
    let frame = 0;

    const step = (now: number) => {
      startTime ??= now;
      const progress = Math.min(1, (now - startTime) / duration);
      scroller.scrollLeft = start + distance * easeOutCubic(progress);
      persistedScrollLeft = scroller.scrollLeft;
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      persistedScrollLeft = scroller.scrollLeft;
      scroller.removeEventListener("scroll", persist);
    };
  }, [activeSlug, spy.enabled]);

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky z-30 bg-white pt-1 pb-3 xl:hidden"
      style={{ top: "var(--header-height)", transform: "translateZ(0)" }}
    >
      {/* Same left-edge alignment as Hero’s horizontal dish strip — outside
          `.container` so chips can scroll to the viewport edge on mobile. */}
      <div className="mx-auto min-w-0 xs:max-w-full sm:ml-[calc(50%-320px)] md:ml-[calc(50%-384px)] lg:ml-[calc(50%-512px)] xl:ml-[calc(50%-640px)] xl:max-w-[1280px]">
        <ul
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto pl-6 lg:pl-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li
              key={item.href}
              data-active={item.slug === activeSlug || undefined}
              className="shrink-0 px-0.5 py-0.5"
            >
              <CategoryNavLink
                href={item.href}
                slug={item.slug}
                routeActive={item.active}
                className={cn(
                  itemBase,
                  "inline-flex whitespace-nowrap rounded-full px-4 py-3 text-14med",
                )}
                activeClassName={activeCls}
                inactiveClassName={inactiveCls}
              >
                {item.label}
              </CategoryNavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

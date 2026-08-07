"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

export type CategoryChip = { label: string; href: string; active: boolean };

const itemBase = "transition-colors duration-300 focus-visible:outline-none";
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
  const activeHref = items.find((item) => item.active)?.href;

  // Restore before paint so the strip never flashes at scrollLeft = 0.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = clampScroll(scroller, persistedScrollLeft);
  }, [activeHref]);

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
      scroller.scrollLeft + nearestDelta(scroller, active),
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
    const coldEntry = restoredFrom < 1;
    if (prefersReducedMotion || coldEntry || Math.abs(distance) < 1) {
      scroller.scrollLeft = target;
      persistedScrollLeft = target;
      return () => scroller.removeEventListener("scroll", persist);
    }

    const duration = Math.min(320, Math.max(140, Math.abs(distance) * 0.55));
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
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

"use client";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/** Treat the reader as still scrolling for this long after the last event. */
const SCROLL_QUIET_MS = 400;

/**
 * Re-measures ScrollTrigger whenever the page's height actually changes.
 *
 * Triggers work out their start and end positions once, at creation — before
 * FindSans swaps in and before the photos land. On a catalog of lazy images
 * that leaves every position bunched near the top of a page that has since
 * grown thousands of pixels, and the category spy stops reporting anything
 * once you scroll past the pile.
 *
 * Watching the height rather than individual image `load` events matters: an
 * earlier version listened for every load in the capture phase, so photos
 * arriving below the fold fired refreshes under a moving finger, and a refresh
 * re-seats sticky and pinned elements — which is what made the category strip
 * judder. Refreshing mid-scroll is deferred until the reader pauses.
 */
export default function ScrollRefresh() {
  useGSAP(() => {
    let lastScroll = 0;
    let lastHeight = 0;

    const noteScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener("scroll", noteScroll, { passive: true });

    const refresh = gsap
      .delayedCall(0.25, () => {
        // Still moving — come back once things have settled.
        if (performance.now() - lastScroll < SCROLL_QUIET_MS) {
          refresh.restart(true);
          return;
        }
        ScrollTrigger.refresh();
      })
      .pause();

    const onResize = () => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      refresh.restart(true);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);

    document.fonts?.ready.then(() => refresh.restart(true));

    return () => {
      window.removeEventListener("scroll", noteScroll);
      observer.disconnect();
      refresh.kill();
    };
  });

  return null;
}

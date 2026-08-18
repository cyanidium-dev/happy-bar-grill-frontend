"use client";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/** Treat the reader as still scrolling for this long after the last event. */
const SCROLL_QUIET_MS = 400;

/**
 * Height changes smaller than this are ignored.
 *
 * Mobile Safari grows and shrinks the viewport by the height of its own
 * toolbar as you scroll — around 60–100px — and every one of those counts as a
 * document resize. Refreshing on them re-seats every sticky and pinned element
 * mid-gesture, which is what made the category strip shiver on slow iPhone
 * scrolls, and briefly disturbs scroll position, which the header's own
 * listener then read as "scrolled" and painted itself solid at the top of the
 * page. Real layout shifts — a font swap, photos landing — move far more.
 */
const IGNORE_BELOW_PX = 150;

/** Once the page has been still this long, stop watching altogether. */
const SETTLE_AFTER_MS = 8000;

/**
 * Re-measures ScrollTrigger when the page's height genuinely changes.
 *
 * Triggers work out their start and end positions once, at creation — before
 * FindSans swaps in and before the photos land. On a catalog of lazy images
 * that leaves every position bunched near the top of a page that has since
 * grown thousands of pixels, and the category spy stops reporting anything
 * once you scroll past the pile.
 */
export default function ScrollRefresh() {
  useGSAP(() => {
    let lastScroll = 0;
    let lastHeight = document.documentElement.scrollHeight;
    let live = true;

    const noteScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener("scroll", noteScroll, { passive: true });

    const refresh = gsap
      .delayedCall(0.25, () => {
        // Still moving — come back once the reader has paused.
        if (performance.now() - lastScroll < SCROLL_QUIET_MS) {
          refresh.restart(true);
          return;
        }
        ScrollTrigger.refresh();
      })
      .pause();

    const onResize = () => {
      if (!live) return;
      const height = document.documentElement.scrollHeight;
      if (Math.abs(height - lastHeight) < IGNORE_BELOW_PX) return;
      lastHeight = height;
      refresh.restart(true);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);

    document.fonts?.ready.then(() => refresh.restart(true));

    // Everything that legitimately moves the page has happened by now, and
    // staying subscribed only invites toolbar-sized noise.
    const stop = gsap.delayedCall(SETTLE_AFTER_MS / 1000, () => {
      live = false;
      observer.disconnect();
    });

    return () => {
      window.removeEventListener("scroll", noteScroll);
      observer.disconnect();
      refresh.kill();
      stop.kill();
    };
  });

  return null;
}

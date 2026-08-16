"use client";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger's measurements honest on an image-heavy page.
 *
 * Every trigger works out its start and end positions once, at creation. This
 * site then loads dozens of lazy `next/image` photos and swaps in FindSans,
 * each of which changes the page height — so by the time a section is actually
 * reached, its trigger is aiming at a scroll position that no longer means
 * anything. The burger anatomy section was the visible symptom: it refused to
 * come apart until the page was almost past it.
 *
 * The `load` event does not bubble, but it does capture, so a single listener
 * on the document catches every image as it arrives.
 */
export default function ScrollRefresh() {
  useGSAP(() => {
    // Debounced: a grid of cards can land a dozen images in the same frame,
    // and a refresh re-measures every trigger on the page.
    const refresh = gsap
      .delayedCall(0.2, () => ScrollTrigger.refresh())
      .pause();
    const schedule = () => refresh.restart(true);

    document.addEventListener("load", schedule, true);
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);

    return () => {
      document.removeEventListener("load", schedule, true);
      window.removeEventListener("load", schedule);
      refresh.kill();
    };
  });

  return null;
}

"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  SplitText,
  gsap,
  useGSAP,
} from "@/lib/gsap";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * The hero's `<section>`, with its opening choreography.
 *
 * Children arrive already rendered on the server — same trick as
 * `SwiperWrapper` — so nothing here costs the hero its server rendering.
 *
 * Everything animates *from* a displaced state rather than being hidden in the
 * markup, so a visitor whose JS never arrives still sees a finished hero.
 */
export default function HeroMotion({ className, style, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: the markup is already the finished state, so there is
      // simply nothing to do.
      mm.add(REDUCED_MOTION, () => {});

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        /**
         * Split once, after the font has settled.
         *
         * `autoSplit` re-splits when FindSans swaps in and runs `onSplit`
         * again — which replayed the whole entrance a second time, a beat
         * after the first. Waiting for `fonts.ready` gets the same correct
         * line boxes from a single split, and the markup is put back once the
         * words have landed so a later resize has nothing stale to reflow.
         */
        let split: SplitText | null = null;

        document.fonts.ready.then(() => {
          const heading = root.current?.querySelector("[data-hero-title] h1");
          if (!heading) return;

          split = SplitText.create(heading, {
            type: "lines,words",
            mask: "lines",
          });

          gsap.from(split.words, {
            yPercent: 115,
            duration: 0.85,
            stagger: 0.04,
            ease: "power3.out",
            onComplete: () => split?.revert(),
          });
        });

        /**
         * `fromTo` with `clearProps`, not `from`.
         *
         * A `from` tween parks the element at the invisible end and only
         * removes it by finishing. Anything that interrupts — a media query
         * flipping, a hot reload, a context revert mid-stagger — leaves it
         * stranded at `opacity: 0`, and the thing most likely to be stranded
         * is whatever is last in the stagger. That was the hero's call to
         * action. Clearing the props on completion means the resting state is
         * always the markup's own.
         */
        tl.fromTo(
          "[data-hero-copy] > *",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            clearProps: "opacity,transform",
          },
          0.4,
        )
          .fromTo(
            "[data-hero-burger]",
            { y: 70, scale: 0.94, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              clearProps: "opacity",
            },
            0.05,
          )
          /**
           * Opacity only. These cards are frosted glass, and a transform on an
           * ancestor turns it into a backdrop root, which switches the blur
           * off — the same reason `fadeIn()` exists in `animation.ts`.
           */
          .fromTo(
            "[data-hero-rail] > li",
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              stagger: 0.09,
              clearProps: "opacity",
            },
            0.55,
          );

        const parallax = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        };

        // Background only below `lg`. The burger is nearly as wide as a phone
        // and already sits behind the copy — drifting it downwards pushes it
        // further over the call to action, on the one screen with no room to
        // spare.
        if (window.matchMedia("(min-width: 1024px)").matches) {
          gsap.to("[data-hero-burger]", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: parallax,
          });
        }

        gsap.to("[data-hero-bg]", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: parallax,
        });

        return () => split?.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={className} style={style}>
      {children}
    </section>
  );
}

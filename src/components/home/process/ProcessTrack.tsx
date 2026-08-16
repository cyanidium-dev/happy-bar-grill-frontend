"use client";

import { useRef, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Pins the section and drags the steps sideways as you scroll down.
 *
 * Only from `lg` up. Pinning a section hijacks the scroll for its whole
 * length, which on a phone means a long stretch where the page appears frozen;
 * narrow viewports get an ordinary swipeable row instead, which is the same
 * content with none of the hostage-taking.
 *
 * The travel distance is measured rather than assumed, and recalculated on
 * refresh, because the cards are sized by their copy and that changes with
 * locale and font loading.
 */
export default function ProcessTrack({
  children,
  progressLabel,
}: {
  children: ReactNode;
  progressLabel: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const track = section?.querySelector<HTMLElement>("[data-process-track]");
      const bar = section?.querySelector<HTMLElement>("[data-process-bar]");
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      // Reduced motion keeps the row scrollable by hand; nothing moves on its
      // own and nothing gets pinned.
      mm.add(REDUCED_MOTION, () => {});

      mm.add(`${FULL_MOTION} and (min-width: 1024px)`, () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - section.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            // Cards are sized by their copy, so the distance is only known
            // after layout — and changes again when the font swaps in.
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
            },
          },
        });

        /**
         * Cards move sideways, not down, so an ordinary ScrollTrigger would
         * never fire for them. `containerAnimation` is the hook for exactly
         * this: it measures each card against the horizontal tween instead of
         * against the page scroll.
         */
        const reveals = [...track.children].map((card) =>
          gsap.from(card, {
            y: 48,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 88%",
              toggleActions: "play none none reverse",
            },
          }),
        );

        return () => {
          reveals.forEach((reveal) => {
            reveal.scrollTrigger?.kill();
            reveal.kill();
          });
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      // Below the pin, the row is swiped by hand — reveal the cards on the
      // ordinary vertical scroll instead.
      mm.add(`${FULL_MOTION} and (max-width: 1023px)`, () => {
        gsap.from([...track.children], {
          y: 32,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: track, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div
        data-process-track
        className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div
        aria-label={progressLabel}
        className="mt-8 hidden h-0.5 w-full max-w-[420px] overflow-hidden rounded-full bg-white/15 lg:block"
      >
        <div
          data-process-bar
          className="h-full w-full origin-left scale-x-0 rounded-full bg-red"
        />
      </div>
    </div>
  );
}

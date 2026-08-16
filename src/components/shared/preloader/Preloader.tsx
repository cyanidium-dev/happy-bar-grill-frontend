"use client";

import { useRef, useState } from "react";
import BurgerSvg, { BURGER_LAYERS } from "@/components/shared/burger/BurgerSvg";
import { REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

const SESSION_KEY = "vtiha:preloaded";

/**
 * First-visit intro: the burger builds itself bottom-up, then the curtain
 * lifts. Once per session only — a preloader that greets you on every
 * navigation stops being charming by the third page.
 *
 * The markup ships server-rendered so there is no flash of unstyled page,
 * which means it also has to be able to get out of the way without JS; the
 * `preloader-failsafe` animation in globals.css is that escape hatch.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const overlay = root.current;
      if (!overlay) return;

      const finish = () => {
        document.body.style.removeProperty("overflow");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // Private mode / storage disabled — the intro simply replays.
        }
        setDone(true);
      };

      let alreadySeen = false;
      try {
        alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        alreadySeen = false;
      }

      // Queried directly rather than through `gsap.matchMedia()`, the way
      // cartFly.ts does: this decision has to be made synchronously, before
      // the overlay locks the page, and matchMedia contexts do not promise
      // that their callback has already run by the time `add()` returns.
      const reducedMotion = window.matchMedia(REDUCED_MOTION).matches;

      if (alreadySeen || reducedMotion) {
        finish();
        return;
      }

      document.body.style.overflow = "hidden";

      const layers = BURGER_LAYERS.map((layer) =>
        overlay.querySelector(`[data-burger-layer="${layer.id}"]`),
      )
        .filter(Boolean)
        .reverse(); // bottom bun lands first, sesame lid last

      /**
       * GSAP's ticker rides `requestAnimationFrame`, which a background tab
       * freezes. Without this the intro could still be sitting there — with
       * scroll locked — whenever the visitor comes back to a tab they opened
       * and left. Whichever gets there first wins.
       */
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(bail);
          finish();
        },
      });

      const bail = window.setTimeout(() => {
        tl.kill();
        finish();
      }, 4000);

      tl.set(layers, { y: -190, opacity: 0 })
        .to(layers, {
          y: 0,
          opacity: 1,
          duration: 0.42,
          ease: "back.out(1.5)",
          stagger: 0.06,
        })
        .to(
          "[data-preloader-bar]",
          { scaleX: 1, duration: 0.78, ease: "none" },
          0,
        )
        .to("[data-burger-stack]", {
          scaleY: 0.94,
          transformOrigin: "center bottom",
          duration: 0.11,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to("[data-preloader-content]", {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        })
        .to(overlay, { yPercent: -100, duration: 0.6, ease: "power3.inOut" });

      return () => {
        window.clearTimeout(bail);
        document.body.style.removeProperty("overflow");
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader-failsafe fixed inset-0 z-[999] flex items-center justify-center bg-navy-dark"
    >
      <div
        data-preloader-content
        className="flex w-[220px] flex-col items-center gap-6 sm:w-[260px]"
      >
        <BurgerSvg className="w-full" />
        <span className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <span
            data-preloader-bar
            className="block h-full w-full origin-left scale-x-0 rounded-full bg-red"
          />
        </span>
      </div>
    </div>
  );
}

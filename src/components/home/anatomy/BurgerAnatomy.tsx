"use client";

import { useRef, useState } from "react";
import BurgerSvg, {
  BURGER_LAYERS,
  COLLAPSED_SHIFT_X,
  type BurgerLayerId,
} from "@/components/shared/burger/BurgerSvg";
import {
  DESKTOP_HOVER,
  FULL_MOTION,
  REDUCED_MOTION,
  ScrollTrigger,
  gsap,
  useGSAP,
} from "@/lib/gsap";

type Props = {
  labels: Record<BurgerLayerId, string>;
  hint: string;
};

/**
 * Pulls the burger apart into its ingredients.
 *
 * Desktop pointers drive it by hover; touch and narrow viewports get it on
 * scroll, since there is no hover to give. Both paths play the same timeline,
 * so the choreography only exists once.
 */
export default function BurgerAnatomy({ labels, hint }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);

  useGSAP(
    (_context, contextSafe) => {
      const stack = root.current?.querySelector("[data-burger-stack]");
      if (!stack || !contextSafe) return;

      const layers = BURGER_LAYERS.map((layer) => ({
        ...layer,
        node: stack.querySelector(`[data-burger-layer="${layer.id}"]`),
      })).filter((layer) => layer.node);

      const labelNodes = stack.querySelectorAll("[data-burger-label]");
      const lineNodes = stack.querySelectorAll("[data-burger-line]");

      const build = () => {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.inOut" },
        });

        tl.to(stack, { x: -COLLAPSED_SHIFT_X, duration: 0.7 }, 0);

        // Top layers lift first, bottom layers settle last — the burger reads
        // as opening upward rather than every slice sliding at once.
        layers.forEach((layer, index) => {
          tl.to(
            layer.node,
            {
              y: layer.dy,
              rotate: index % 2 === 0 ? -1.5 : 1.5,
              duration: 0.7,
              ease: "back.out(1.4)",
            },
            index * 0.045,
          );
        });

        tl.to(
          "[data-burger-shadow]",
          {
            scaleX: 0.82,
            opacity: 0.1,
            transformOrigin: "center",
            duration: 0.7,
          },
          0,
        );

        tl.to(lineNodes, { opacity: 0.45, duration: 0.3, stagger: 0.04 }, 0.35);
        tl.fromTo(
          labelNodes,
          { opacity: 0, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.045,
            ease: "power2.out",
          },
          0.4,
        );

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION, () => {
        // No travel — the ingredient labels still need to be reachable, so the
        // exploded state is simply the resting state here.
        const tl = build();
        tl.progress(1).pause();
        setExploded(true);
      });

      mm.add(
        { desktop: `${FULL_MOTION} and ${DESKTOP_HOVER}`, rest: FULL_MOTION },
        (context) => {
          const tl = build();
          const { desktop } = context.conditions as { desktop: boolean };

          if (desktop) {
            const open = contextSafe(() => {
              setExploded(true);
              tl.play();
            });
            const close = contextSafe(() => {
              setExploded(false);
              tl.reverse();
            });

            const node = root.current;
            node?.addEventListener("pointerenter", open);
            node?.addEventListener("pointerleave", close);
            node?.addEventListener("focusin", open);
            node?.addEventListener("focusout", close);

            return () => {
              node?.removeEventListener("pointerenter", open);
              node?.removeEventListener("pointerleave", close);
              node?.removeEventListener("focusin", open);
              node?.removeEventListener("focusout", close);
            };
          }

          const node = root.current;
          if (!node) return;

          const trigger = ScrollTrigger.create({
            trigger: node,
            start: "top 72%",
            end: "bottom 28%",
            onEnter: () => {
              setExploded(true);
              tl.play();
            },
            onLeaveBack: () => {
              setExploded(false);
              tl.reverse();
            },
          });

          return () => trigger.kill();
        },
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      tabIndex={0}
      className="relative w-full max-w-[640px] rounded-lg outline-none focus-visible:shadow-focus"
    >
      {/* The drawing is decorative; the ingredient names are the real content,
          so they are exposed as a plain list instead of SVG text nobody can
          reach when the burger is stacked. */}
      <BurgerSvg labels={labels} className="w-full text-navy" />
      <ul className="sr-only">
        {BURGER_LAYERS.map((layer) => (
          <li key={layer.id}>{labels[layer.id]}</li>
        ))}
      </ul>
      <p
        aria-hidden
        className={`text-12med text-grey-dark transition-opacity duration-500 xl:text-center ${
          exploded ? "opacity-0" : "opacity-100"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import BurgerSvg, {
  BURGER_LAYERS,
  EXPLODE_SHIFT_X,
  type BurgerLabel,
  type BurgerLayerId,
} from "@/components/shared/burger/BurgerSvg";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  ScrollTrigger,
  gsap,
  useGSAP,
} from "@/lib/gsap";

type Props = {
  labels: Record<BurgerLayerId, BurgerLabel>;
  hint: string;
};

/**
 * Takes the burger apart into its ingredients as the section scrolls past.
 *
 * Arriving in view drives it on every device, pointer or not. Hover was the
 * obvious choice on desktop but it hid the whole thing from anyone who never
 * happened to move the mouse over it, and it gave touch and desktop two
 * separate behaviours to keep in step.
 */
export default function BurgerAnatomy({ labels, hint }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);

  useGSAP(
    () => {
      const node = root.current;
      const stack = node?.querySelector("[data-burger-stack]");
      if (!node || !stack) return;

      const layers = BURGER_LAYERS.map((layer) => ({
        dy: layer.dy,
        node: stack.querySelector(`[data-burger-layer="${layer.id}"]`),
      })).filter((layer) => layer.node);

      const labelNodes = stack.querySelectorAll("[data-burger-label]");
      const lineNodes = stack.querySelectorAll("[data-burger-line]");

      const build = () => {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.inOut" },
        });

        tl.to(stack, { x: -EXPLODE_SHIFT_X, duration: 0.7 }, 0);

        // Top layers lift first, bottom layers settle last — the burger reads
        // as opening upward rather than every slice sliding at once.
        layers.forEach((layer, index) => {
          tl.to(
            layer.node,
            { y: layer.dy, duration: 0.7, ease: "power2.out" },
            index * 0.045,
          );
        });

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
        // No travel — the ingredient names still have to be readable, so the
        // exploded state is simply the resting state here.
        build().progress(1).pause();
        setExploded(true);
      });

      mm.add(FULL_MOTION, () => {
        const tl = build();

        /**
         * Play it, don't scrub it. Tying progress to scroll position made the
         * burger's state a function of how fast you happened to be flicking,
         * and it could sit half-open indefinitely. Here it simply runs once,
         * at its own pace, when it comes into view — and runs back if you
         * scroll above it again.
         */
        const trigger = ScrollTrigger.create({
          trigger: node,
          start: "top 75%",
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
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full max-w-[720px]">
      {/* The photo is decorative; the ingredient names are the real content,
          so they are exposed as a plain list rather than as SVG text nobody
          can reach while the burger is stacked. */}
      <BurgerSvg labels={labels} className="w-full text-navy" />
      <ul className="sr-only">
        {BURGER_LAYERS.map((layer) => (
          <li key={layer.id}>
            {labels[layer.id].name}. {labels[layer.id].text}
          </li>
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

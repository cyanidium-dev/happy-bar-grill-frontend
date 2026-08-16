"use client";

import { useState } from "react";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  ScrollTrigger,
  gsap,
  useGSAP,
} from "@/lib/gsap";

/**
 * Appears once the first screen is behind you and rides back up on click.
 * Uses native smooth scrolling, which `prefers-reduced-motion` in globals.css
 * already downgrades to an instant jump for us.
 */
export default function BackToTop({ label }: { label: string }) {
  const [node, setNode] = useState<HTMLButtonElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const show = (visible: boolean) =>
        gsap.to(node, {
          autoAlpha: visible ? 1 : 0,
          y: visible ? 0 : 16,
          scale: visible ? 1 : 0.9,
          duration: 0.35,
          ease: "power2.out",
        });

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION, () => {
        const trigger = ScrollTrigger.create({
          start: "top -60%",
          end: "max",
          onToggle: (self) =>
            gsap.set(node, { autoAlpha: self.isActive ? 1 : 0 }),
        });
        return () => trigger.kill();
      });

      mm.add(FULL_MOTION, () => {
        const trigger = ScrollTrigger.create({
          start: "top -60%",
          end: "max",
          onToggle: (self) => show(self.isActive),
        });
        return () => trigger.kill();
      });
    },
    { dependencies: [node] },
  );

  return (
    <button
      ref={setNode}
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="invisible fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full bg-navy-dark text-white shadow-card-hover opacity-0 transition-colors duration-300 xl:hover:bg-red xl:bottom-8 xl:right-8"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

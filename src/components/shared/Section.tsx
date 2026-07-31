import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import SectionWave from "@/components/shared/SectionWave";

type Background = "white" | "gradient" | "beige" | "navy";
type Accent = "none" | "warm" | "cool";

const backgrounds: Record<Background, string> = {
  white: "bg-white",
  gradient: "bg-gradient-to-br from-navy/15 via-beige to-sand/40",
  beige: "bg-beige",
  navy: "bg-navy text-white",
};

// Soft decorative glows for depth on otherwise flat sections. Purely visual —
// clipped by the section and ignored by pointer/AT.
const accents: Record<Exclude<Accent, "none">, string> = {
  warm: "right-[-8rem] -top-24 bg-sand/25",
  cool: "left-[-8rem] top-1/3 bg-sky/20",
};

type SectionProps = {
  id?: string;
  as?: ElementType;
  background?: Background;
  /** Optional decorative glow for depth; no effect on layout or content. */
  accent?: Accent;
  /** Draw a wavy transition at the top, filled with the previous section's colour. */
  waveTop?: Background;
  className?: string;
  /** Override inner container spacing/width when a section needs it. */
  containerClassName?: string;
  children: ReactNode;
};

/**
 * Shared section shell: full-bleed background + centered `.container` with the
 * standard vertical rhythm. Keeps all home sections consistent (bravo repeats
 * this structure inline; we factor it out to avoid duplication).
 */
export default function Section({
  id,
  as: Tag = "section",
  background = "white",
  accent = "none",
  waveTop,
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative",
        accent === "none" ? "overflow-x-clip" : "overflow-hidden",
        backgrounds[background],
        className,
      )}
    >
      {waveTop && <SectionWave from={waveTop} />}
      {accent !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-[32rem] rounded-full blur-3xl",
            accents[accent],
          )}
        />
      )}
      <div
        className={cn(
          "container relative py-16 md:py-20 xl:py-28",
          containerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

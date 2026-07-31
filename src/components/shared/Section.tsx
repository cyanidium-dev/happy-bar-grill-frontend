import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import SectionWave from "@/components/shared/SectionWave";

type Background = "white" | "beige" | "navy";
type AccentKey = "warm" | "cool" | "coolRight" | "coolTopCenter" | "navy";
/** A single accent, several combined, or `"none"` to skip the glow(s) entirely. */
type Accent = "none" | AccentKey | AccentKey[];

const backgrounds: Record<Background, string> = {
  white: "bg-white",
  beige: "bg-beige",
  navy: "bg-navy text-white",
};

// Soft decorative glows for depth on otherwise flat sections. Purely visual —
// clipped by the section and ignored by pointer/AT. `navy` stands in for the
// blue corner of the old diagonal gradient (see Hero/DeliveryInfo), layered
// over a flat `beige` background instead of baked into the fill itself.
const accents: Record<AccentKey, string> = {
  warm: "right-[-8rem] -top-24 bg-sand/25",
  cool: "left-[-8rem] top-1/3 bg-sky/20",
  coolRight: "right-[-8rem] top-1/3 bg-sky/20",
  coolTopCenter: "right-[18rem] -top-8 bg-sky/20",
  navy: "left-[-8rem] -top-24 bg-navy/15",
};

type SectionProps = {
  id?: string;
  as?: ElementType;
  background?: Background;
  /** Optional decorative glow for depth; no effect on layout or content. */
  accent?: Accent;
  /** Draw a wavy transition at the top, filled with the previous section's colour. */
  waveTop?: Background;
  /** Mirror the top wave horizontally, so it doesn't repeat the previous one. */
  waveFlip?: boolean;
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
  waveFlip,
  className,
  containerClassName,
  children,
}: SectionProps) {
  const accentKeys = accent === "none" ? [] : Array.isArray(accent) ? accent : [accent];

  return (
    <Tag
      id={id}
      className={cn(
        "relative",
        accentKeys.length === 0 ? "overflow-x-clip" : "overflow-hidden",
        backgrounds[background],
        className,
      )}
    >
      {/* Accent glow(s) painted *before* the wave (DOM order = paint order for
          same-stacking siblings) so they never bleed onto the wave and skew
          its colour away from the previous section's actual background. */}
      {accentKeys.map((key) => (
        <div
          key={key}
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-[32rem] rounded-full blur-3xl",
            accents[key],
          )}
        />
      ))}
      {waveTop && <SectionWave from={waveTop} flip={waveFlip} />}
      <div
        className={cn(
          "container relative pb-12 pt-28 md:pb-16 md:pt-32 xl:pb-24 xl:pt-40",
          containerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

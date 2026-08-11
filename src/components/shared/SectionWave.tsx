import { cn } from "@/utils/cn";

type WaveColor = "white" | "beige" | "navy";

// Fill = the *previous* section's colour, so the wave reads as that section
// flowing down into this one. Only for flat colours — gradient sections
// render their own `GradientWaveTail` instead, so the wave is a literal
// continuation of their background rather than a flat approximation of it.
const fills: Record<WaveColor, string> = {
  white: "text-white",
  beige: "text-beige",
  navy: "text-navy",
};

/**
 * Decorative wavy transition sitting at the top of a section, replacing the
 * hard horizontal seam between two differently-coloured sections. Full-bleed
 * and responsive via `preserveAspectRatio="none"`. Purely visual.
 *
 * Mobile gets its own, gentler single-curve path: at the shallow 44px band the
 * two-hump desktop curve gets squeezed into a narrow viewport and reads as a
 * jagged zigzag rather than a wave, so mobile uses one smooth, off-centre
 * curve instead. `flip` mirrors the whole graphic horizontally so consecutive
 * waves down the page don't all repeat the exact same silhouette.
 */
export default function SectionWave({
  from,
  flip = false,
  above = false,
  className,
}: {
  from: WaveColor;
  /** Mirror horizontally so this wave doesn't look identical to the last one. */
  flip?: boolean;
  /** Sit above the parent (e.g. footer) and overlap the previous section. */
  above?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-[44px] md:h-[72px] xl:h-[96px]",
        above ? "bottom-full -scale-y-100" : "top-0",
        fills[from],
        flip && "-scale-x-100",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        fill="currentColor"
        className="block h-full w-full md:hidden"
      >
        <path d="M0 0 H1440 V24 C1180 48 940 6 640 26 C400 42 180 8 0 30 Z" />
      </svg>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        fill="currentColor"
        className="hidden h-full w-full md:block"
      >
        <path d="M0 0 H1440 V34 C1150 78 970 2 720 34 C470 66 290 4 0 40 Z" />
      </svg>
    </div>
  );
}

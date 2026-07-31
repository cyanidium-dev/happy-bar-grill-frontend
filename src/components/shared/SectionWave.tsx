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
 */
export default function SectionWave({
  from,
  className,
}: {
  from: WaveColor;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[44px] md:h-[72px] xl:h-[96px]",
        fills[from],
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        fill="currentColor"
        className="block h-full w-full"
      >
        <path d="M0 0 H1440 V34 C1150 78 970 2 720 34 C470 66 290 4 0 40 Z" />
      </svg>
    </div>
  );
}

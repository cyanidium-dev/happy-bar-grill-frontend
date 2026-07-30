import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Background = "white" | "beige" | "navy";

const backgrounds: Record<Background, string> = {
  white: "bg-white",
  beige: "bg-gradient-to-br from-navy/15 via-beige to-sand/40",
  navy: "bg-navy text-white",
};

type SectionProps = {
  id?: string;
  as?: ElementType;
  background?: Background;
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
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("overflow-x-clip", backgrounds[background], className)}>
      <div className={cn("container py-16 md:py-20 xl:py-28", containerClassName)}>
        {children}
      </div>
    </Tag>
  );
}

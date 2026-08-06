import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionTitleProps = {
  children: ReactNode;
  /** `navy` (default, on light) vs `white` (on dark sections). */
  variant?: "navy" | "white";
  as?: "h2" | "h3";
  className?: string;
};

/** Section heading (<h2> by default). Display font, uppercase. */
export default function SectionTitle({
  children,
  variant = "navy",
  as: Tag = "h2",
  className,
}: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        "font-findsans text-28semi uppercase xl:text-40bold",
        variant === "white" ? "text-white" : "text-navy",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

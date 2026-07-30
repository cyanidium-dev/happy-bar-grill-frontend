import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type CardProps = {
  /** Rendered element — use `article`/`li` for semantics where it fits. */
  as?: ElementType;
  /**
   * Adds the desktop hover treatment (lift + deeper shadow) and turns the card
   * into a `group`, so child media/titles can react via `xl:group-hover:*`.
   */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Neutral surface primitive shared by dish / blog / offer / category cards.
 * Feature cards compose this + `CardMedia` and add their own content.
 */
export default function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "overflow-hidden rounded-lg bg-white shadow-card transition duration-300 ease-out",
        interactive &&
          "group xl:hover:-translate-y-1 xl:hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

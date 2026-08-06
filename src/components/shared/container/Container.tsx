import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type ContainerOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

type ContainerProps<T extends ElementType> = ContainerOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

/**
 * Centered content wrapper — thin, polymorphic wrapper around the `.container`
 * utility (defined in `globals.css`: 1440px max-width + responsive side
 * padding), so every section composes the exact same width/gutters instead of
 * re-typing the class name. `className` is merged via `cn`/twMerge, so layout
 * utilities (padding, flex, grid, etc.) added on top always win over
 * conflicting ones from a preset.
 */
export default function Container<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = as || "div";

  return (
    <Tag
      className={cn(
        "xs:max-w-full sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl px-6 lg:px-20 mx-auto",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type ButtonShape = "pill" | "leaf";

const base =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden text-center transition duration-300 ease-out focus-visible:outline-none enabled:active:scale-95 disabled:cursor-not-allowed";

const shapes: Record<ButtonShape, string> = {
  pill: "rounded-full",
  // "Leaf": top-left & bottom-right rounded, the opposite two sharp — matches
  // the card corner motif.
  leaf: "rounded-tl-[14px] rounded-br-[14px]",
};

const variantStyles: Record<ButtonVariant, string> = {
  // Red is the attention/CTA colour. White label stays AA only at this bold
  // 16px+ size (see design concept — verify contrast if you shrink it).
  primary:
    "bg-red text-16semi text-white xl:enabled:hover:bg-red-dark disabled:bg-grey disabled:text-white/60",
  secondary:
    "border border-navy bg-navy text-14semi text-white xl:enabled:hover:bg-navy-dark xl:enabled:hover:border-navy-dark",
  ghost: "text-16med text-navy xl:enabled:hover:text-red",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5",
  md: "px-6 py-3.5",
  lg: "px-8 py-4",
  icon: "size-9 shrink-0 p-0 sm:size-11",
};

type StyleArgs = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  className?: string;
};

/** Exported so links styled as buttons can reuse the exact same look. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  shape = "pill",
  fullWidth = false,
  className,
}: StyleArgs = {}): string {
  return cn(
    base,
    variantStyles[variant],
    sizeStyles[size],
    shapes[shape],
    fullWidth && "w-full",
    className,
  );
}

type BaseProps = StyleArgs & {
  children: ReactNode;
  /** Shows a spinner and blocks interaction (button mode only). */
  isLoading?: boolean;
};

/** `href` renders a localized next-intl <Link>; otherwise a <button>. */
type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: string;
  };

/**
 * Diagonal light sweep on desktop hover (bravo signature interaction).
 * Exported so raw `<a>`/`<button>` elements styled via `buttonStyles()`
 * (e.g. `tel:` links, which can't use the localized `<Link>` in `Button`)
 * can reuse the exact same hover effect.
 */
export function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-[-150%] w-full skew-x-[-40deg] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-70 transition-all duration-[800ms] ease-in-out xl:group-enabled:group-hover:left-[120%]"
    />
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-5 animate-rotation rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  fullWidth = false,
  isLoading = false,
  href,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = buttonStyles({ variant, size, shape, fullWidth, className });

  const content = (
    <>
      {variant !== "ghost" && <Sheen />}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
      <span
        className={cn(
          "relative z-[1] inline-flex items-center gap-2",
          isLoading && "invisible",
        )}
      >
        {children}
      </span>
    </>
  );

  // Navigational button → localized Link (no button-only props apply).
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}

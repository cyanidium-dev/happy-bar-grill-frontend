"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-center transition duration-300 ease-out focus-visible:outline-none enabled:active:scale-95 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  // Red is the attention/CTA colour. White label stays AA only at this bold
  // 16px+ size (see design concept — verify contrast if you shrink it).
  primary:
    "bg-red text-16semi text-white enabled:xl:hover:bg-red-dark disabled:bg-grey disabled:text-white/60",
  secondary:
    "border border-navy bg-transparent text-14semi text-navy xl:hover:bg-navy xl:hover:text-white",
  ghost: "text-16med text-navy xl:hover:text-red",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5",
  md: "px-6 py-3.5",
  lg: "px-8 py-4",
  icon: "size-11 p-0",
};

type StyleArgs = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/** Exported so links styled as buttons can reuse the exact same look. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: StyleArgs = {}): string {
  return cn(
    base,
    variantStyles[variant],
    sizeStyles[size],
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

function Sheen() {
  // Diagonal light sweep on desktop hover (bravo signature interaction).
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-[-150%] w-full skew-x-[-40deg] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-70 transition-all duration-[800ms] ease-in-out xl:group-hover:left-[120%]"
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
  fullWidth = false,
  isLoading = false,
  href,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = buttonStyles({ variant, size, fullWidth, className });

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

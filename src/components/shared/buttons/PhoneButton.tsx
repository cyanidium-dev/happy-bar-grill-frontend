"use client";

import { buttonStyles, Sheen } from "@/components/shared/buttons/Button";
import PhoneIcon from "@/components/shared/icons/PhoneIcon";
import { PHONE, PHONE_HREF } from "@/constants/contacts";

type PhoneButtonProps = {
  /** Optional lead text shown before the number (e.g. "Телефонуйте"). */
  label?: string;
  /** Accessible name; defaults to the phone number. */
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "leaf";
  /** Extra classes for colour/shape overrides. */
  className?: string;
};

/**
 * `tel:` call-to-action styled as a button. A client component because it
 * calls `buttonStyles()` (which lives in the client `Button` module) and can't
 * use the localized `<Link>` for a `tel:` href — so server pages render it as a
 * component instead of building the styles themselves.
 */
export default function PhoneButton({
  label,
  ariaLabel,
  size = "md",
  shape = "leaf",
  className,
}: PhoneButtonProps) {
  return (
    <a
      href={`tel:${PHONE_HREF}`}
      aria-label={ariaLabel ?? (label ? `${label}: ${PHONE}` : PHONE)}
      className={buttonStyles({
        variant: "secondary",
        size,
        shape,
        className,
      })}
    >
      <Sheen />
      <span className="relative z-[1] inline-flex items-center gap-2">
        <PhoneIcon className="size-4" />
        {label ? `${label} — ${PHONE}` : PHONE}
      </span>
    </a>
  );
}

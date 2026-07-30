"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/shared/logo/Logo";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { buttonStyles } from "@/components/shared/buttons/Button";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import PhoneIcon from "@/components/shared/icons/PhoneIcon";
import { navLinks } from "@/config/navigation";
import { PHONE, PHONE_HREF } from "@/constants/contacts";
import { cn } from "@/utils/cn";

/** Slide-in mobile navigation (below `lg`). */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Nav");
  const th = useTranslations("Header");

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className="lg:hidden" aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={th("menu")}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-4">
          <Logo className="text-20semi" onClick={onClose} />
          <button
            type="button"
            aria-label={th("closeMenu")}
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-navy transition-colors hover:text-red"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="flex flex-col">
            {navLinks.map(({ href, key }) => (
              <li key={key} className="border-b border-navy/10">
                <Link
                  href={href}
                  onClick={onClose}
                  className="block py-4 text-20semi text-navy transition-colors hover:text-red"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 border-t border-navy/10 px-6 py-6">
          <a
            href={`tel:${PHONE_HREF}`}
            onClick={onClose}
            className={buttonStyles({ variant: "primary", fullWidth: true })}
          >
            <PhoneIcon className="size-5" />
            {PHONE}
          </a>
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}

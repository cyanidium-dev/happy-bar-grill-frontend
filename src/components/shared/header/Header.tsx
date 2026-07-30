"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/shared/logo/Logo";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { buttonStyles } from "@/components/shared/buttons/Button";
import PhoneIcon from "@/components/shared/icons/PhoneIcon";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";
import { navLinks } from "@/config/navigation";
import { PHONE, PHONE_HREF } from "@/constants/contacts";
import { cn } from "@/utils/cn";

/**
 * Sticky header: logo, desktop nav, language switcher, cart and phone, plus the
 * mobile burger + slide-in menu. Gains a solid blurred background and shadow
 * once the page is scrolled (bravo's scroll behaviour, adapted to a light UI).
 */
export default function Header() {
  const t = useTranslations("Nav");
  const th = useTranslations("Header");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300",
        scrolled
          ? "border-navy/10 bg-white/85 shadow-nav"
          : "border-transparent bg-white/70",
      )}
    >
      <div className="container flex items-center gap-4 py-3 md:py-4">
        <Logo className="text-20semi md:text-24semi" />

        <nav className="ml-8 hidden lg:block xl:ml-12">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navLinks.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-16med text-navy transition-colors duration-300 hover:text-red focus-visible:text-red"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <CartButton label={th("cart")} />

          <div className="hidden xl:block">
            <a
              href={`tel:${PHONE_HREF}`}
              aria-label={PHONE}
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              <PhoneIcon className="size-4" />
              {PHONE}
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? th("closeMenu") : th("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-navy transition-transform duration-300",
                open && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-navy transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 rounded-full bg-navy transition-transform duration-300",
                open && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

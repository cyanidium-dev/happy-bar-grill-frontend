"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/shared/logo/Logo";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { buttonStyles, Sheen } from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";
import PhoneIcon from "@/components/shared/icons/PhoneIcon";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";
import { navLinks } from "@/config/navigation";
import { PHONE, PHONE_HREF } from "@/constants/contacts";
import { cn } from "@/utils/cn";

/**
 * Floating header: logo, desktop nav, language switcher, cart and phone, plus
 * the mobile burger + slide-in menu. It's `fixed` (not `sticky`) so it floats
 * *over* the page — the Hero section renders behind it with its own
 * background, visible through the header while it's transparent. The header
 * gains a solid blurred white background and shadow once the page is
 * scrolled past 60px (bravo's scroll behaviour, adapted to a light UI).
 *
 * Its rendered height is published as the `--header-height` CSS variable so
 * every page can reserve the right amount of space below it (see the locale
 * layout and `Hero`, which cancels that space out to sit behind the header).
 */
export default function Header({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const th = useTranslations("Header");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeight = () =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.offsetHeight}px`,
      );

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
    >
      {/* `backdrop-blur` lives on this inner div, not on the `<header>` itself:
          WebKit has a compositor bug where `backdrop-filter` on a
          `position: sticky` element breaks/glitches the sticky behaviour on
          iOS Safari (works fine on Chrome, which is why it's easy to miss) —
          keeping the blur on a plain child avoids relying on that behaviour.
          The header starts fully transparent and fades in a white,
          blurred background once the page is scrolled past 60px. */}
      <div
        className={cn(
          "border-b transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-out",
          scrolled
            ? "border-navy/10 bg-navy/65 shadow-nav backdrop-blur"
            : "border-transparent bg-transparent backdrop-blur-0",
        )}
      >
        <Container className="relative flex items-center gap-4">
          <Logo className="" />
          <nav className="ml-8 hidden lg:block xl:ml-12">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="group relative inline-block text-14med text-white"
                  >
                    {t(key)}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-red transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
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
                <Sheen />
                <span className="relative z-[1] inline-flex items-center gap-2">
                  <PhoneIcon className="size-4" />
                  {PHONE}
                </span>
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
                  "block h-0.5 w-6 rounded-full bg-white transition-transform duration-300",
                  open && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 rounded-full bg-white transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 rounded-full bg-white transition-transform duration-300",
                  open && "-translate-y-2 -rotate-45",
                )}
              />
            </button>
          </div>
        </Container>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

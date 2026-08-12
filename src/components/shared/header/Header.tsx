"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/shared/logo/Logo";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { buttonStyles, Sheen } from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";
import PhoneIcon from "@/components/shared/icons/PhoneIcon";
import HeaderCartActions from "./HeaderCartActions";
import MobileMenu from "./MobileMenu";
import CartModal from "@/components/cart/CartModal";
import LastOrderModal from "@/components/cart/LastOrderModal";
import { navLinks } from "@/config/navigation";
import { PHONE, PHONE_HREF } from "@/constants/contacts";
import { cn } from "@/utils/cn";

/**
 * Floating header: logo, desktop nav, language switcher, cart and phone, plus
 * the mobile burger + slide-in menu. It's `fixed` (not `sticky`) so it floats
 * *over* the page — on hero pages (home, blog, article, delivery, about) the section renders behind it
 * with its own background, visible through the header while it's transparent
 * (white chrome). On every other page the header is solid `navy-dark` with
 * white chrome from the start. Once scrolled past 60px on a hero page, it
 * joins that same solid bar.
 *
 * Its rendered height is published as the `--header-height` CSS variable so
 * every page can reserve the right amount of space below it (see the locale
 * layout and `Hero`, which cancels that space out to sit behind the header).
 */
export default function Header({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const th = useTranslations("Header");
  const pathname = usePathname();
  const isHeroPage =
    pathname === "/" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/delivery" ||
    pathname === "/about";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastOrderOpen, setLastOrderOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // Solid navy-dark on non-hero pages always; on hero pages only after scroll.
  const solid = !isHeroPage || scrolled;
  // White chrome over the hero, and on the solid bar everywhere else.
  const onDark = isHeroPage || solid;

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
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full pr-[var(--scroll-lock-offset,0px)]",
        className,
      )}
    >
      <div
        className={cn(
          "py-3 border-b border-transparent transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-out",
          solid ? "bg-navy-dark" : "bg-transparent backdrop-blur-0",
        )}
      >
        <Container className="relative flex items-center gap-3">
          <Logo className="h-9 md:h-12 xl:h-16" />
          <nav className="ml-8 hidden lg:block xl:ml-12">
            <ul className="flex items-center gap-4 xl:gap-8">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={cn(
                      "group relative inline-block text-14med",
                      onDark ? "text-white" : "text-navy-dark",
                    )}
                  >
                    {t(key)}
                    <span
                      aria-hidden
                      className="absolute left-0 -bottom-1 h-0.5 w-8 origin-left scale-x-0 rounded-full bg-red transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
            <LocaleSwitcher className="hidden lg:block" />

            <div>
              <a
                href={`tel:${PHONE_HREF}`}
                aria-label={PHONE}
                className={buttonStyles({
                  variant: "secondary",
                  size: "sm",
                  className: cn(
                    "px-2 xl:px-4 py-1.75 xl:py-3",
                    onDark
                      ? "border-white bg-white text-navy xl:hover:border-white xl:hover:bg-navy/30 xl:hover:text-white transition-colors duration-300 ease-in-out"
                      : "border-navy-dark bg-navy-dark text-white xl:hover:border-navy xl:hover:bg-navy xl:hover:text-white transition-colors duration-300 ease-in-out",
                  ),
                })}
              >
                <Sheen />
                <span className="relative z-[1] inline-flex items-center gap-1 text-10bold xs:text-10semi xl:text-12semi">
                  <PhoneIcon className="size-4" />
                  {PHONE}
                </span>
              </a>
            </div>

            <HeaderCartActions
              cartLabel={th("cart")}
              lastOrderLabel={th("lastOrder")}
              onOpenCart={() => {
                setLastOrderOpen(false);
                setCartOpen(true);
              }}
              onOpenLastOrder={() => {
                setCartOpen(false);
                setLastOrderOpen(true);
              }}
            />

            <button
              type="button"
              aria-label={open ? th("closeMenu") : th("openMenu")}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-5 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={cn(
                  "block h-0.5 w-6 rounded-full transition-transform duration-300",
                  onDark ? "bg-white" : "bg-navy-dark",
                  open && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 rounded-full transition-opacity duration-300",
                  onDark ? "bg-white" : "bg-navy-dark",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 rounded-full transition-transform duration-300",
                  onDark ? "bg-white" : "bg-navy-dark",
                  open && "-translate-y-2 -rotate-45",
                )}
              />
            </button>
          </div>
        </Container>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <LastOrderModal
        open={lastOrderOpen}
        onClose={() => setLastOrderOpen(false)}
        onOpenCart={() => setCartOpen(true)}
      />
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import CartIcon from "@/components/shared/icons/CartIcon";
import HeartIcon from "@/components/shared/icons/HeartIcon";
import MenuGridIcon from "@/components/shared/icons/MenuGridIcon";
import ReceiptIcon from "@/components/shared/icons/ReceiptIcon";
import SettingsIcon from "@/components/shared/icons/SettingsIcon";
import {
  selectCartCount,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import {
  selectFavoriteCount,
  useFavoritesHydrated,
  useFavoritesStore,
} from "@/store/favoritesStore";
import { useUiStore } from "@/store/uiStore";
import {
  cartBumpProps,
  cartBumpRootProps,
  cartFlyTargetProps,
} from "@/lib/cartFly";
import { cn } from "@/utils/cn";

type TabKey = "menu" | "favorites" | "orders" | "settings";

type Tab = {
  key: TabKey;
  href: string;
  icon: ReactNode;
  /** Extra paths that keep this tab lit (dish pages under /menu, …). */
  match?: (pathname: string) => boolean;
};

/**
 * Rendered left-to-right with the cart button inserted in the middle.
 *
 * There is deliberately no "home" tab. A marketing home page is a website
 * idea; an installed app opens onto the thing it is for, and the five slots
 * are worth more as the five places a returning customer actually goes. The
 * header logo still leads home for anyone who wants the story pages.
 */
const LEFT_TABS: Tab[] = [
  {
    key: "menu",
    href: "/menu",
    icon: <MenuGridIcon className="size-5" />,
    match: (path) =>
      path === "/" || path.startsWith("/menu") || path.startsWith("/dish/"),
  },
  {
    key: "favorites",
    href: "/favorites",
    icon: <HeartIcon className="size-5" />,
  },
];

const RIGHT_TABS: Tab[] = [
  { key: "orders", href: "/orders", icon: <ReceiptIcon className="size-5" /> },
  {
    key: "settings",
    href: "/settings",
    icon: <SettingsIcon className="size-5" />,
  },
];

/** Count bubble shared by the cart and favourites tabs. */
function Badge({
  count,
  tone,
}: {
  count: number;
  tone: "onRed" | "onNavy";
}) {
  return (
    <span
      className={cn(
        "absolute -right-2.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full px-1 text-10med tabular-nums",
        tone === "onRed"
          ? "bg-white text-navy ring-1 ring-navy/10"
          : "bg-red text-white",
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function NavTab({
  tab,
  label,
  badge,
  pathname,
}: {
  tab: Tab;
  label: string;
  badge?: ReactNode;
  pathname: string;
}) {
  const active = tab.match ? tab.match(pathname) : pathname === tab.href;

  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-full flex-col items-center justify-center gap-1 rounded-lg text-10med transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60",
        active ? "text-white" : "text-white/60",
      )}
    >
      <span className="relative">
        <span
          className={cn(
            "block transition-transform duration-300 ease-out group-active:scale-90",
            active && "text-red",
          )}
        >
          {tab.icon}
        </span>
        {badge}
      </span>
      <span className="max-w-full truncate px-0.5">{label}</span>
    </Link>
  );
}

/**
 * Phone-only tab bar: the app's primary navigation once the site is installed
 * to a home screen, where there is no browser chrome to fall back on.
 *
 * The cart sits in the middle as a raised button rather than a fifth flat tab —
 * it is the only entry here that is an action as well as a destination, and
 * the one people reach for most. It also doubles as the fly-to-cart landing
 * site while it is the visible cart button.
 *
 * Above `lg` the bar is hidden and the header takes over; the page padding
 * that reserves space for it collapses with it (see `--bottom-nav-height`).
 */
export default function BottomNav() {
  const t = useTranslations("BottomNav");
  const pathname = usePathname();
  const cartHydrated = useCartHydrated();
  const cartCount = useCartStore(selectCartCount);
  const favoritesHydrated = useFavoritesHydrated();
  const favoriteCount = useFavoritesStore(selectFavoriteCount);
  const cartOpen = useUiStore((s) => s.overlay === "cart");
  const toggle = useUiStore((s) => s.toggle);

  const showCartCount = cartHydrated && cartCount > 0;
  const showFavoriteCount = favoritesHydrated && favoriteCount > 0;

  return (
    <nav
      aria-label={t("label")}
      /* Below every overlay backdrop (z-40 and up), so an open sheet or the
         mobile menu dims this along with the rest of the page. */
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy-dark pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-1">
        {LEFT_TABS.map((tab) => (
          <NavTab
            key={tab.key}
            tab={tab}
            label={t(tab.key)}
            pathname={pathname}
          />
        ))}

        <div className="flex items-start justify-center">
          <button
            type="button"
            {...cartFlyTargetProps}
            {...cartBumpRootProps}
            onClick={() => toggle("cart")}
            aria-label={t("cart")}
            aria-expanded={cartOpen}
            className={cn(
              // Lifted clear of the bar so it reads as the primary action; the
              // border punches it out of the bar rather than sitting on top.
              "-mt-6 flex size-14 cursor-pointer items-center justify-center rounded-full border-4 border-navy-dark shadow-lg transition duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
              cartOpen ? "bg-red-dark" : "bg-red",
            )}
          >
            <span
              {...cartBumpProps}
              className="relative inline-flex origin-center"
            >
              <CartIcon className="size-6 text-white" />
              {showCartCount && <Badge count={cartCount} tone="onRed" />}
            </span>
          </button>
        </div>

        {RIGHT_TABS.map((tab) => (
          <NavTab
            key={tab.key}
            tab={tab}
            label={t(tab.key)}
            pathname={pathname}
            badge={
              tab.key === "favorites" && showFavoriteCount ? (
                <Badge count={favoriteCount} tone="onNavy" />
              ) : undefined
            }
          />
        ))}
      </div>
    </nav>
  );
}

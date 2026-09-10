"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/shared/container/Container";
import Button from "@/components/shared/buttons/Button";
import WifiOffIcon from "@/components/shared/icons/WifiOffIcon";
import { selectCartCount, useCartHydrated, useCartStore } from "@/store/cartStore";
import {
  selectFavoriteCount,
  useFavoritesHydrated,
  useFavoritesStore,
} from "@/store/favoritesStore";
import { cn } from "@/utils/cn";

/**
 * Live connectivity, as an external store rather than effect-driven state.
 *
 * `navigator.onLine` is a browser value that changes on its own, which is
 * exactly what `useSyncExternalStore` is for — and the server snapshot is
 * `true`, so anyone opening this URL while connected never sees a flash of
 * the offline copy.
 */
function useOnlineStatus(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("online", onChange);
    window.addEventListener("offline", onChange);
    return () => {
      window.removeEventListener("online", onChange);
      window.removeEventListener("offline", onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

/**
 * `true` once the browser has gone from offline to online while this page is
 * open — the only moment at which "you're back" is actually news.
 *
 * Being online on arrival means something else failed (the server is down, a
 * captive portal is in the way, the request timed out), so the page must keep
 * showing the failure copy rather than cheerfully announcing a connection the
 * visitor never lost.
 */
function useReconnected(): boolean {
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    const onOnline = () => setReconnected(true);
    const onOffline = () => setReconnected(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return reconnected;
}

/**
 * The dead-end screen, made as useful as a dead end can be.
 *
 * Rather than only apologising, it points at the parts of the app that do
 * still work without a connection — the saved dishes, the order history and
 * whatever is already in the cart — and it watches for the network coming
 * back so the visitor doesn't have to keep tapping "retry".
 */
export default function OfflineView() {
  const t = useTranslations("Offline");
  const online = useOnlineStatus();
  const recovered = useReconnected() && online;
  const cartHydrated = useCartHydrated();
  const cartCount = useCartStore(selectCartCount);
  const favoritesHydrated = useFavoritesHydrated();
  const favoriteCount = useFavoritesStore(selectFavoriteCount);

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white px-6 py-14 text-center">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-full transition-colors duration-500",
            recovered ? "bg-olive/12 text-olive" : "bg-red/10 text-red",
          )}
        >
          <WifiOffIcon className="size-8" />
        </span>

        <h1 className="font-findsans text-24bold uppercase text-navy">
          {recovered ? t("backTitle") : online ? t("failedTitle") : t("title")}
        </h1>
        <p className="text-16reg text-grey-dark">
          {recovered ? t("backText") : online ? t("failedText") : t("text")}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-tl-[14px] rounded-br-[14px] bg-red px-8 py-4 text-16semi text-white transition-colors duration-300 hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          {t("retry")}
        </button>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 border-t border-navy/10 pt-5">
          <p className="w-full text-14med text-graphite">{t("availableTitle")}</p>
          <Button href="/favorites" variant="secondary" shape="leaf" size="sm">
            {t("favorites")}
            {favoritesHydrated && favoriteCount > 0 ? ` (${favoriteCount})` : ""}
          </Button>
          <Button href="/orders" variant="secondary" shape="leaf" size="sm">
            {t("orders")}
          </Button>
          {cartHydrated && cartCount > 0 && (
            <Button href="/checkout" variant="secondary" shape="leaf" size="sm">
              {t("cart", { count: cartCount })}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}

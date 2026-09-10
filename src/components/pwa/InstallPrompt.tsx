"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import ShareIosIcon from "@/components/shared/icons/ShareIosIcon";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import {
  isIos,
  isStandalone,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa/standalone";
import { cn } from "@/utils/cn";

/** Snooze length after a dismissal. Asking again the next day reads as spam. */
const SNOOZE_DAYS = 30;
const SNOOZE_KEY = "vtiha-install-dismissed";

/** Don't interrupt the first seconds of a first visit. */
const IDLE_DELAY_MS = 25_000;

function snoozedUntil(): number {
  try {
    const raw = window.localStorage.getItem(SNOOZE_KEY);
    const until = raw ? Number(raw) : 0;
    return Number.isFinite(until) ? until : 0;
  } catch {
    // Private mode / blocked storage — treat as "never dismissed".
    return 0;
  }
}

function snooze() {
  try {
    window.localStorage.setItem(
      SNOOZE_KEY,
      String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000),
    );
  } catch {
    // Nothing to do — the banner simply reappears next session.
  }
}

/**
 * Which banner to show; `null` hides it.
 *
 * The platform is folded into this one value rather than tracked separately so
 * revealing the banner is a single state write, made from a timer callback
 * instead of synchronously inside an effect (which would cascade an extra
 * render on every mount).
 */
type PromptMode = "ios" | "install";

/**
 * "Add to home screen" invitation.
 *
 * Shown on engagement rather than on arrival: either the visitor has put
 * something in the cart (they intend to order, so an installed icon is worth
 * something to them) or they have been reading for a while. A banner thrown at
 * a cold first paint is the single most-hated PWA pattern, and Chrome will
 * happily hold the install event until we are ready to use it.
 *
 * Chromium gets a real install button via `beforeinstallprompt`. iOS Safari has
 * no such API, so it gets the manual Share → Add to Home Screen instructions —
 * which is also why this component cannot be replaced by the browser's own mini
 * infobar.
 */
export default function InstallPrompt() {
  const t = useTranslations("Pwa");
  const [mode, setMode] = useState<PromptMode | null>(null);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const cartCount = useCartStore(selectCartCount);
  // Narrowed to a boolean so the effect re-runs once when the cart stops being
  // empty, rather than on every quantity change.
  const engaged = cartCount > 0;

  const dismiss = useCallback(() => {
    setMode(null);
    snooze();
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    if (Date.now() < snoozedUntil()) return;

    const onBeforeInstall = (event: Event) => {
      // Suppress Chrome's own mini-infobar so only our banner is on screen.
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
    };

    const onInstalled = () => {
      setMode(null);
      snooze();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const iosDevice = isIos();

    const reveal = () => {
      // On Chromium there is nothing to offer until the event has fired; on
      // iOS the instructions stand on their own.
      if (iosDevice) return setMode("ios");
      if (deferred.current) return setMode("install");
    };

    const timer = window.setTimeout(reveal, engaged ? 1200 : IDLE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [engaged]);

  const install = async () => {
    const event = deferred.current;
    if (!event) return;
    deferred.current = null;
    setMode(null);
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      // A declined native prompt is a clear "no" — don't re-ask next session.
      if (outcome === "dismissed") snooze();
    } catch {
      // The event can only be used once; nothing to recover.
    }
  };

  if (!mode) return null;

  return (
    <div
      role="dialog"
      aria-label={t("installTitle")}
      className={cn(
        "fixed inset-x-4 z-[80] mx-auto max-w-md",
        "bottom-[calc(var(--bottom-nav-height,0px)+1rem+env(safe-area-inset-bottom))]",
        "animate-install-in rounded-tl-2xl rounded-br-2xl border border-navy/10 bg-white p-4 shadow-2xl",
      )}
    >
      <div className="flex items-start gap-3">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-findsans text-16bold uppercase text-navy">
            {t("installTitle")}
          </h2>
          <p className="mt-1 text-12reg text-grey-dark">{t("installText")}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("installDismiss")}
          className="-mr-1 -mt-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-grey-dark transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>

      {mode === "ios" ? (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg bg-beige/70 px-3 py-2.5 text-12reg text-graphite">
          {t.rich("installIos", {
            share: () => (
              <ShareIosIcon
                aria-label={t("installIosShare")}
                className="inline-block size-4 shrink-0 align-text-bottom text-navy"
              />
            ),
          })}
        </p>
      ) : (
        <button
          type="button"
          onClick={install}
          className="mt-3 w-full cursor-pointer rounded-tl-[14px] rounded-br-[14px] bg-red px-6 py-3 text-14semi text-white transition-colors duration-300 hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          {t("installAction")}
        </button>
      )}
    </div>
  );
}

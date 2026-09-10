"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

/**
 * Registers `/sw.js` and surfaces waiting updates as an opt-in toast.
 *
 * The update is never applied automatically. A service worker takeover forces
 * a reload, and doing that unannounced mid-checkout would throw away a form
 * the user is halfway through filling in — so the swap only happens when they
 * tap "Update".
 *
 * Registration is production-only: in `next dev` the worker would cache
 * Turbopack's output and fight HMR. To exercise it locally, run a production
 * build (`npm run build && npm start`).
 */
export default function ServiceWorkerRegistrar() {
  const t = useTranslations("Pwa");
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    let registration: ServiceWorkerRegistration | undefined;

    const track = (worker: ServiceWorker | null) => {
      if (!worker || cancelled) return;
      // `installed` with an existing controller means a *replacement* is ready.
      // Without a controller it is the very first install, which needs no prompt.
      const check = () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          setWaiting(worker);
        }
      };
      check();
      worker.addEventListener("statechange", check);
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          // Always revalidate the worker script itself, so a deploy is picked
          // up even if a CDN would happily serve the old one.
          updateViaCache: "none",
        });
        if (cancelled) return;

        track(registration.waiting);
        registration.addEventListener("updatefound", () =>
          track(registration?.installing ?? null),
        );
      } catch {
        // An unavailable worker only costs offline support.
      }
    };

    void register();

    /**
     * The new worker takes control here, not when the user taps the button —
     * `controllerchange` is the moment the swap is actually complete, so
     * reloading now guarantees the fresh build renders.
     */
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    // Catch deploys that land while a long-lived tab sits open.
    const onFocus = () => void registration?.update();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed inset-x-4 z-[85] mx-auto max-w-sm transition-[opacity,transform] duration-300 ease-out",
        // Clears the bottom nav and the home indicator.
        "bottom-[calc(var(--bottom-nav-height,0px)+1rem+env(safe-area-inset-bottom))]",
        waiting
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {waiting && (
        <div className="flex items-center gap-3 rounded-tl-2xl rounded-br-2xl border border-white/10 bg-navy-dark p-4 shadow-2xl">
          <p className="min-w-0 flex-1 text-14reg text-white">
            {t("updateReady")}
          </p>
          <button
            type="button"
            onClick={() => waiting.postMessage("SKIP_WAITING")}
            className="shrink-0 cursor-pointer rounded-full bg-red px-4 py-2 text-12semi text-white transition-colors duration-300 hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("update")}
          </button>
        </div>
      )}
    </div>
  );
}

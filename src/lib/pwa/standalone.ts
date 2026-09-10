/**
 * Small environment probes shared by the install prompt and the app chrome.
 * All of them read `window`, so callers must only run them in an effect.
 */

/** `true` when the page is running as an installed app, not a browser tab. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    // iOS Safari predates `display-mode` and exposes its own flag instead.
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/**
 * iOS (and iPadOS, which reports itself as a Mac with a touch screen).
 * Safari has no `beforeinstallprompt`, so these users need the manual
 * "Share → Add to Home Screen" instructions instead of a button.
 */
export function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return (
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1
  );
}

/** The Chromium install event, which is not in the DOM lib's type definitions. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Locks document scroll and compensates for the disappearing scrollbar so the
 * page (and fixed header) don't jump sideways when a modal opens.
 * Sets `--scroll-lock-offset` for fixed chrome; returns an unlock cleanup.
 *
 * Reference-counted: overlapping overlays (menu + cart) share one lock and
 * only restore scroll when the last one closes.
 */

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function applyLock() {
  const { body } = document;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const current = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
    document.documentElement.style.setProperty(
      "--scroll-lock-offset",
      `${scrollbarWidth}px`,
    );
  }
}

function releaseLock() {
  const { body } = document;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
  document.documentElement.style.removeProperty("--scroll-lock-offset");
}

export function lockBodyScroll(): () => void {
  if (lockCount === 0) applyLock();
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) releaseLock();
  };
}

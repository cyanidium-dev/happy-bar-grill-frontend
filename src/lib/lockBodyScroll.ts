/**
 * Locks document scroll and compensates for the disappearing scrollbar so the
 * page (and fixed header) don't jump sideways when a modal opens.
 * Sets `--scroll-lock-offset` for fixed chrome; returns an unlock cleanup.
 */
export function lockBodyScroll(): () => void {
  const { body } = document;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const current = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
    document.documentElement.style.setProperty(
      "--scroll-lock-offset",
      `${scrollbarWidth}px`,
    );
  }

  return () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
    document.documentElement.style.removeProperty("--scroll-lock-offset");
  };
}

/**
 * Fly-to-cart animation (dependency-free, Web Animations API). Ported from the
 * bravo project's `AddToCartAnimation`, but without framer-motion/zustand: a
 * small clone of the dish image flies from the origin element to the header
 * cart icon, scaling down and fading out, then `onArrive` runs (typically
 * `addItem`) and the cart icon bumps — so the count digit updates in sync
 * with the pulse while the badge itself stays still. Any client component can
 * call `flyToCart` from an add-to-cart handler.
 */

/** `id` on the header cart button — the animation's destination. */
export const CART_FLY_TARGET_ID = "cart-fly-target";

/**
 * Spread onto the header cart root so the post-flight bump can find the
 * marked icon (the count badge is intentionally not bumped).
 */
export const cartBumpRootProps = { "data-cart-bump-root": "" } as const;

/** Spread onto the cart icon node that should pulse after a successful add. */
export const cartBumpProps = { "data-cart-bump": "" } as const;

const FLY_SIZE = 56;

const BUMP_KEYFRAMES: Keyframe[] = [
  { transform: "scale(1)" },
  { transform: "scale(1.35)" },
  { transform: "scale(1)" },
];

const BUMP_OPTIONS: KeyframeAnimationOptions = {
  duration: 320,
  easing: "ease-out",
};

function bump(target: HTMLElement) {
  const root =
    target.closest<HTMLElement>("[data-cart-bump-root]") ?? target;
  const parts = root.querySelectorAll<HTMLElement>("[data-cart-bump]");

  if (parts.length > 0) {
    parts.forEach((el) => el.animate(BUMP_KEYFRAMES, BUMP_OPTIONS));
    return;
  }

  target.animate(BUMP_KEYFRAMES, BUMP_OPTIONS);
}

/**
 * @param onArrive — called when the flight lands (or immediately if flight is
 * skipped). Commit the cart mutation here so the header count changes with
 * the bump; prefer `flushSync(() => addItem(...))` so the digit paints before
 * the scale animation starts.
 */
export function flyToCart(
  origin: HTMLElement | null | undefined,
  imageUrl: string | null | undefined,
  onArrive?: () => void,
): void {
  if (typeof window === "undefined" || !origin || !imageUrl) {
    onArrive?.();
    return;
  }

  const target = document.getElementById(CART_FLY_TARGET_ID);
  if (!target) {
    onArrive?.();
    return;
  }

  const land = () => {
    onArrive?.();
    bump(target);
  };

  // Respect reduced-motion: skip the flight, keep only the subtle cart bump.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    land();
    return;
  }

  const originRect = origin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const originCX = originRect.left + originRect.width / 2;
  const originCY = originRect.top + originRect.height / 2;
  const dx = targetRect.left + targetRect.width / 2 - originCX;
  const dy = targetRect.top + targetRect.height / 2 - originCY;

  // Sanity CDN supports transform params — request a small square thumbnail.
  const thumb = imageUrl.includes("cdn.sanity.io")
    ? `${imageUrl}?w=120&h=120&fit=crop&auto=format`
    : imageUrl;

  const fly = document.createElement("div");
  fly.setAttribute("aria-hidden", "true");
  Object.assign(fly.style, {
    position: "fixed",
    top: `${originCY - FLY_SIZE / 2}px`,
    left: `${originCX - FLY_SIZE / 2}px`,
    width: `${FLY_SIZE}px`,
    height: `${FLY_SIZE}px`,
    borderRadius: "12px",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "100",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);

  const img = document.createElement("img");
  img.src = thumb;
  img.alt = "";
  Object.assign(img.style, {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } satisfies Partial<CSSStyleDeclaration>);
  fly.appendChild(img);
  document.body.appendChild(fly);

  const duration = 900;
  const animation = fly.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 0 },
      {
        transform: `translate(-54px, ${dy * 0.35}px) scale(0.7)`,
        opacity: 0.95,
        offset: 0.4,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.25)`,
        opacity: 0,
        offset: 1,
      },
    ],
    { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
  );

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    fly.remove();
    land();
  };

  animation.onfinish = settle;
  animation.oncancel = settle;
  // Safety net: WAAPI finish/cancel events don't fire while the tab is hidden,
  // so guarantee the clone is removed and the cart still updates.
  window.setTimeout(settle, duration + 400);
}

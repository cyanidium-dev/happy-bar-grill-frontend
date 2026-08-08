/**
 * Fly-to-cart animation (dependency-free, Web Animations API). Ported from the
 * bravo project's `AddToCartAnimation`, but without framer-motion/zustand: a
 * small clone of the dish image flies from the origin element to the header
 * cart icon, scaling down and fading out, then the cart icon gives a little
 * bump. Any client component can call `flyToCart` from an add-to-cart handler.
 */

/** `id` on the header cart button — the animation's destination. */
export const CART_FLY_TARGET_ID = "cart-fly-target";

const FLY_SIZE = 56;

function bump(target: HTMLElement) {
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.25)" },
      { transform: "scale(1)" },
    ],
    { duration: 320, easing: "ease-out" },
  );
}

export function flyToCart(
  origin: HTMLElement | null | undefined,
  imageUrl: string | null | undefined,
): void {
  if (typeof window === "undefined" || !origin || !imageUrl) return;

  const target = document.getElementById(CART_FLY_TARGET_ID);
  if (!target) return;

  // Respect reduced-motion: skip the flight, keep only the subtle cart bump.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bump(target);
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

  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    fly.remove();
  };

  animation.onfinish = () => {
    cleanup();
    bump(target);
  };
  animation.oncancel = cleanup;
  // Safety net: WAAPI finish/cancel events don't fire while the tab is hidden,
  // so guarantee the clone is removed even if the flight never "completes".
  window.setTimeout(cleanup, duration + 400);
}

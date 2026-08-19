"use client";

import { useMemo, useState, type ReactNode } from "react";
import Container from "@/components/shared/container/Container";
import type { PriceBounds } from "@/components/menu/PriceFilter";
import PriceFilterControl from "@/components/menu/PriceFilterControl";
import { PriceFilterProvider } from "@/components/menu/priceFilterContext";
import { PRICE_FILTER_MIN, PRICE_FILTER_STEP } from "@/constants/menu";
import type { Dish } from "@/types/content";

type MenuCatalogProps = {
  dishes: Dish[];
  mobileNav: ReactNode;
  desktopNav: ReactNode;
  decorations: ReactNode;
  children: ReactNode;
};

/** Survives remounts when switching `/menu` ↔ `/menu/[category]`. */
let persistedRange: PriceBounds | null = null;

function getBounds(dishes: Dish[]): PriceBounds | null {
  let maxPrice = 0;
  let hasPrice = false;
  for (const dish of dishes) {
    if (
      typeof dish.price !== "number" ||
      !Number.isFinite(dish.price) ||
      dish.price < 0
    ) {
      continue;
    }
    hasPrice = true;
    if (dish.price > maxPrice) maxPrice = dish.price;
  }
  if (!hasPrice) return null;
  const max = Math.max(
    PRICE_FILTER_STEP,
    Math.ceil(maxPrice / PRICE_FILTER_STEP) * PRICE_FILTER_STEP,
  );
  return { min: PRICE_FILTER_MIN, max };
}

function isFullRange(range: PriceBounds, bounds: PriceBounds) {
  return range.min === bounds.min && range.max === bounds.max;
}

function clampRange(range: PriceBounds, bounds: PriceBounds): PriceBounds {
  const min = Math.min(Math.max(range.min, bounds.min), bounds.max);
  const max = Math.min(Math.max(range.max, bounds.min), bounds.max);
  if (min > max) return bounds;
  return { min, max };
}

function persistRange(range: PriceBounds, bounds: PriceBounds) {
  persistedRange = isFullRange(range, bounds) ? null : range;
}

/**
 * Client catalog shell: category nav slots + price filter. The dishes grid
 * is passed as `children` from the server so `DishCard` stays a Server
 * Component (it cannot be imported into this client module).
 */
export default function MenuCatalog({
  dishes,
  mobileNav,
  desktopNav,
  decorations,
  children,
}: MenuCatalogProps) {
  const bounds = useMemo(() => getBounds(dishes), [dishes]);
  // User selection only; null = full range. Displayed range is derived/clamped.
  const [selection, setSelection] = useState<PriceBounds | null>(
    () => persistedRange,
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const range = useMemo(() => {
    if (!bounds) return null;
    if (!selection) return bounds;
    return clampRange(selection, bounds);
  }, [bounds, selection]);

  const commit = (next: PriceBounds) => {
    if (!bounds) return;
    const clamped = clampRange(next, bounds);
    persistRange(clamped, bounds);
    setSelection(isFullRange(clamped, bounds) ? null : clamped);
  };

  const reset = () => {
    persistedRange = null;
    setSelection(null);
  };

  const isFiltered = Boolean(bounds && range && !isFullRange(range, bounds));

  const matchCount = useMemo(() => {
    if (!range || !isFiltered) return dishes.length;
    return dishes.filter(
      (dish) => dish.price >= range.min && dish.price <= range.max,
    ).length;
  }, [dishes, range, isFiltered]);

  const filterProps =
    bounds && range
      ? {
          bounds,
          value: range,
          onMinChange: (min: number) => commit({ ...range, min }),
          onMaxChange: (max: number) => commit({ ...range, max }),
          onReset: reset,
          open: filterOpen,
          onOpenChange: setFilterOpen,
        }
      : null;

  return (
    <PriceFilterProvider
      range={isFiltered ? range : null}
      matchCount={matchCount}
      total={dishes.length}
    >
      {/*
        One wrapper around the chip strip *and* the dishes. `position: sticky`
        is bounded by its parent's box, so while the strip lived in a short div
        of its own alongside the filter it unstuck the moment that div scrolled
        by — a few pixels in. It needs the height of the whole catalog to
        travel through.
      */}
      <div>
        {/* Sets the gap under the breadcrumbs on its own — the padding used to
            cover the chip strip too, and once that moved out it read as an
            empty band. Top padding stays on the wrapper so the spacing holds
            with or without a filter; the bottom one rides the inner container
            so it only appears when there is a filter to separate, and never
            adds height to the sticky strip below. */}
        <div className="pt-6 xl:hidden">
          {filterProps ? (
            <Container className="pt-0 pb-3">
              <PriceFilterControl {...filterProps} />
            </Container>
          ) : null}
        </div>

        {mobileNav}

        <Container className="relative flex flex-col gap-8 pb-12 pt-6 md:pb-16 xl:flex-row xl:items-start xl:gap-10 xl:pb-24 xl:pt-14">
          {/* Isolated overflow clip so decorations don't escape the container
              without making this node a scroll-containing block that would
              break `position: sticky` children (the chip strip and sidebar). */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {decorations}
          </div>

          <aside
            className="relative z-10 hidden w-72 shrink-0 self-start xl:sticky xl:block"
            style={{ top: "calc(var(--header-height) + 1.5rem)" }}
          >
            {filterProps ? (
              <PriceFilterControl {...filterProps} className="mb-2" />
            ) : null}
            {desktopNav}
          </aside>

          <div className="relative z-10 min-w-0 flex-1">{children}</div>
        </Container>
      </div>
    </PriceFilterProvider>
  );
}

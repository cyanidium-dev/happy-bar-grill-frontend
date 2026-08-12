"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Container from "@/components/shared/container/Container";
import type { PriceBounds } from "@/components/menu/PriceFilter";
import PriceFilterControl from "@/components/menu/PriceFilterControl";
import { PriceFilterProvider } from "@/components/menu/priceFilterContext";
import { PRICE_FILTER_MAX, PRICE_FILTER_MIN } from "@/constants/menu";
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

const PRICE_FILTER_BOUNDS: PriceBounds = {
  min: PRICE_FILTER_MIN,
  max: PRICE_FILTER_MAX,
};

function getBounds(dishes: Dish[]): PriceBounds | null {
  if (dishes.length === 0) return null;
  return PRICE_FILTER_BOUNDS;
}

function clampRange(range: PriceBounds, bounds: PriceBounds): PriceBounds {
  const min = Math.min(Math.max(range.min, bounds.min), bounds.max);
  const max = Math.min(Math.max(range.max, bounds.min), bounds.max);
  if (min > max) return bounds;
  return { min, max };
}

function initialRange(bounds: PriceBounds): PriceBounds {
  return persistedRange ? clampRange(persistedRange, bounds) : bounds;
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
  const boundsMin = bounds?.min;
  const boundsMax = bounds?.max;
  const [range, setRange] = useState<PriceBounds | null>(() =>
    bounds ? initialRange(bounds) : null,
  );
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (boundsMin == null || boundsMax == null) {
      setRange(null);
      return;
    }
    const next = initialRange({ min: boundsMin, max: boundsMax });
    persistedRange = next;
    setRange((prev) =>
      prev && prev.min === next.min && prev.max === next.max ? prev : next,
    );
  }, [boundsMin, boundsMax]);

  const commit = (next: PriceBounds) => {
    persistedRange = next;
    setRange(next);
  };

  const reset = () => {
    if (!bounds) return;
    persistedRange = null;
    setRange(bounds);
  };

  const matchCount = useMemo(() => {
    if (!range) return dishes.length;
    return dishes.filter(
      (dish) => dish.price >= range.min && dish.price <= range.max,
    ).length;
  }, [dishes, range]);

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
      range={range}
      matchCount={matchCount}
      total={dishes.length}
    >
      <div className="pt-14 xl:hidden">
        {filterProps ? (
          <Container className="pt-6 pb-0">
            <PriceFilterControl {...filterProps} />
          </Container>
        ) : null}
        {mobileNav}
      </div>

      <Container className="relative flex flex-col gap-8 pb-12 pt-6 md:pb-16 xl:flex-row xl:items-start xl:gap-10 xl:pb-24 xl:pt-14">
        {decorations}

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
    </PriceFilterProvider>
  );
}

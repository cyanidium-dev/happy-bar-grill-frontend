"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PriceBounds } from "@/components/menu/PriceFilter";

type PriceFilterContextValue = {
  range: PriceBounds | null;
  matchCount: number;
  total: number;
};

const PriceFilterContext = createContext<PriceFilterContextValue | null>(null);

export function PriceFilterProvider({
  range,
  matchCount,
  total,
  children,
}: PriceFilterContextValue & { children: ReactNode }) {
  return (
    <PriceFilterContext.Provider value={{ range, matchCount, total }}>
      {children}
    </PriceFilterContext.Provider>
  );
}

export function PriceFilteredItem({
  price,
  children,
}: {
  price: number;
  children: ReactNode;
}) {
  const ctx = useContext(PriceFilterContext);
  if (ctx?.range && (price < ctx.range.min || price > ctx.range.max)) {
    return null;
  }
  return children;
}

/** Swaps the grid for the empty-filter message when nothing matches. */
export function PriceFilterResults({
  empty,
  children,
}: {
  empty: ReactNode;
  children: ReactNode;
}) {
  const ctx = useContext(PriceFilterContext);
  if (ctx && ctx.total > 0 && ctx.matchCount === 0) return empty;
  return children;
}

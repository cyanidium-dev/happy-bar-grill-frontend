"use client";

import { useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import FilterIcon from "@/components/shared/icons/FilterIcon";
import PriceFilter, { type PriceBounds } from "@/components/menu/PriceFilter";
import { cn } from "@/utils/cn";

type PriceFilterControlProps = {
  bounds: PriceBounds;
  value: PriceBounds;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onReset: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

/**
 * Filter funnel button that reveals the price range. Closing hides the panel
 * but keeps the selected range applied to the catalog.
 */
export default function PriceFilterControl({
  bounds,
  value,
  onMinChange,
  onMaxChange,
  onReset,
  open,
  onOpenChange,
  className,
}: PriceFilterControlProps) {
  const t = useTranslations("Menu.priceFilter");
  const panelId = useId();
  const isFiltered = value.min > bounds.min || value.max < bounds.max;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "relative inline-flex cursor-pointer items-center gap-2 text-16med transition duration-300 ease-in-out focus-visible:outline-none",
          open || isFiltered ? "text-navy" : "text-navy hover:text-red",
        )}
      >
        <span className="relative flex size-6 shrink-0 items-center justify-center">
          <FilterIcon className="size-5" />
          {isFiltered && !open && (
            <span
              aria-hidden
              className="absolute top-0 right-0 size-2 rounded-full bg-red"
            />
          )}
        </span>
        {t("button")}
      </button>

      <div
        id={panelId}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <PriceFilter
            bounds={bounds}
            value={value}
            onMinChange={onMinChange}
            onMaxChange={onMaxChange}
            onReset={onReset}
            onClose={() => onOpenChange(false)}
            className={cn(
              "mt-3 mb-4 origin-top transition duration-300 ease-out",
              open
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0",
            )}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import { PRICE_FILTER_STEP } from "@/constants/menu";
import { cn } from "@/utils/cn";

export type PriceBounds = { min: number; max: number };

type PriceFilterProps = {
  bounds: PriceBounds;
  value: PriceBounds;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onReset: () => void;
  onClose?: () => void;
  id?: string;
  className?: string;
};

function percent(value: number, bounds: PriceBounds) {
  const span = bounds.max - bounds.min;
  if (span <= 0) return 0;
  return ((value - bounds.min) / span) * 100;
}

/**
 * Dual-thumb price range. Two native range inputs share a track; the filled
 * bar between thumbs is a separate div so we can colour it with brand navy.
 */
export default function PriceFilter({
  bounds,
  value,
  onMinChange,
  onMaxChange,
  onReset,
  onClose,
  id,
  className,
}: PriceFilterProps) {
  const t = useTranslations("Menu.priceFilter");
  const tp = useTranslations("Product");
  const labelId = useId();
  const isFiltered = value.min > bounds.min || value.max < bounds.max;
  const span = bounds.max - bounds.min;
  const minZ = value.min > bounds.min + span * 0.5 ? 5 : 3;

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={labelId}
      className={cn(
        "rounded-[20px] bg-navy-dark/7 border border-navy-dark/40 p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p id={labelId} className="text-16med text-navy">
          {t("label")}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-14med text-red transition-colors duration-300 hover:text-red-dark"
            >
              {t("reset")}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-navy transition-colors duration-300 hover:text-red"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mb-3 text-14med text-graphite">
        {value.min}–{value.max} {tp("currency")}
      </p>

      <div className="relative h-6">
        <div
          aria-hidden
          className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-navy/20"
        />
        <div
          aria-hidden
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-navy"
          style={{
            left: `${percent(value.min, bounds)}%`,
            right: `${100 - percent(value.max, bounds)}%`,
          }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={PRICE_FILTER_STEP}
          value={value.min}
          aria-label={t("min")}
          aria-valuetext={`${value.min} ${tp("currency")}`}
          onChange={(event) =>
            onMinChange(Math.min(Number(event.target.value), value.max))
          }
          className="price-range-input absolute inset-0 w-full"
          style={{ zIndex: minZ }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={PRICE_FILTER_STEP}
          value={value.max}
          aria-label={t("max")}
          aria-valuetext={`${value.max} ${tp("currency")}`}
          onChange={(event) =>
            onMaxChange(Math.max(Number(event.target.value), value.min))
          }
          className="price-range-input absolute inset-0 w-full"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="mt-1 flex justify-between text-12med text-grey-dark">
        <span>
          {t("from")} {bounds.min} {tp("currency")}
        </span>
        <span>
          {t("to")} {bounds.max} {tp("currency")}
        </span>
      </div>
    </div>
  );
}

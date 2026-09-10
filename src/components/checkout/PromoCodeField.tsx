"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import TagIcon from "@/components/shared/icons/TagIcon";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import {
  checkPromoCode,
  OrderRequestError,
  type OrderErrorCode,
} from "@/lib/telegram/client";
import type { AppliedPromo, DeliveryType, OrderLineRequest } from "@/types/cart";
import { cn } from "@/utils/cn";

type PromoCodeFieldProps = {
  formToken: string;
  locale: string;
  items: OrderLineRequest[];
  deliveryType: DeliveryType;
  /** Verified discount, or `null` when no code is applied. */
  promo: AppliedPromo | null;
  onChange: (promo: AppliedPromo | null) => void;
};

/**
 * Promo code entry for the order summary.
 *
 * The discount shown here is quoted by the server against live prices, and it
 * is re-quoted whenever the basket or the fulfilment type changes — a code
 * that was worth 10% of a 400₴ basket must not keep claiming that number after
 * the customer removes half the order, and a pickup-only code has to fall away
 * the moment they switch to delivery.
 */
export default function PromoCodeField({
  formToken,
  locale,
  items,
  deliveryType,
  promo,
  onChange,
}: PromoCodeFieldProps) {
  const t = useTranslations("Promo");
  const [value, setValue] = useState("");
  const [error, setError] = useState<OrderErrorCode | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Identifies the priced basket. Re-quoting keys off this rather than the
   * `items` array itself, which is a fresh reference on every render.
   */
  const basketKey =
    items.map((line) => `${line.id}:${line.quantity}`).join(",") +
    `|${deliveryType}`;

  /**
   * `onChange` and the applied code are read by the re-quote effect, not
   * depended on: listing them would re-run the quote every time the parent
   * re-renders or the quote itself lands, which is an infinite loop.
   *
   * The ref is synced in its own effect rather than during render (writing a
   * ref while rendering is not safe under concurrent React). Effects run in
   * declaration order, so this one has always refreshed the ref by the time
   * the re-quote below reads it.
   */
  const latest = useRef({ promo, onChange });
  useEffect(() => {
    latest.current = { promo, onChange };
  });

  useEffect(() => {
    const applied = latest.current.promo;
    if (!applied) return;
    if (items.length === 0) {
      latest.current.onChange(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const result = await checkPromoCode(
          formToken,
          locale,
          applied.code,
          items,
          deliveryType,
        );
        if (cancelled) return;
        if (result.ok) {
          // Only publish a genuine change, or this sets state every re-quote.
          if (result.amount !== applied.amount) {
            latest.current.onChange({ code: result.code, amount: result.amount });
          }
          setError(null);
        } else {
          latest.current.onChange(null);
          setValue(applied.code);
          setError(result.error);
        }
      } catch {
        // Leave the quote in place on a network blip: `/api/orders` is the
        // authority and will reject the order if the code truly no longer fits.
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketKey, formToken, locale]);

  const apply = async () => {
    const code = value.trim();
    if (!code || isChecking) return;
    if (items.length === 0) {
      setError("promoMinOrder");
      return;
    }

    setIsChecking(true);
    setError(null);
    try {
      const result = await checkPromoCode(
        formToken,
        locale,
        code,
        items,
        deliveryType,
      );
      if (result.ok) {
        onChange({ code: result.code, amount: result.amount });
        setValue("");
      } else {
        onChange(null);
        setError(result.error);
      }
    } catch (err) {
      onChange(null);
      setError(err instanceof OrderRequestError ? err.code : "submit");
    } finally {
      setIsChecking(false);
    }
  };

  const remove = () => {
    onChange(null);
    setValue("");
    setError(null);
  };

  if (promo) {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-lg border border-olive/40 bg-olive/10 px-3 py-2.5">
        <TagIcon className="size-4 shrink-0 text-olive" />
        <p className="min-w-0 flex-1 text-14med text-graphite">
          <span className="font-findsans text-14bold uppercase text-navy">
            {promo.code}
          </span>{" "}
          <span className="text-12reg text-grey-dark">{t("applied")}</span>
        </p>
        <button
          type="button"
          onClick={remove}
          aria-label={t("remove")}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-grey-dark transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          <CloseIcon className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <label
        htmlFor="promo-code"
        className="mb-1.5 flex items-center gap-1.5 text-14med text-graphite"
      >
        <TagIcon className="size-4 text-navy" />
        {t("label")}
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          name="promoCode"
          value={value}
          onChange={(event) => {
            setValue(event.target.value.toUpperCase());
            if (error) setError(null);
          }}
          // The field lives inside the checkout form, so Enter would otherwise
          // submit the order instead of applying the code.
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            void apply();
          }}
          placeholder={t("placeholder")}
          maxLength={32}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "promo-code-error" : undefined}
          className={cn(
            "min-w-0 flex-1 rounded-sm border bg-white px-4 py-2.5 text-14reg uppercase text-graphite placeholder-grey outline-none transition duration-300 ease-out focus:border-navy",
            error ? "border-red" : "border-grey-dark",
          )}
        />
        <button
          type="button"
          onClick={() => void apply()}
          disabled={!value.trim() || isChecking}
          className="shrink-0 cursor-pointer rounded-sm border border-navy bg-navy px-4 py-2.5 text-14semi text-white transition-colors duration-300 hover:bg-navy-dark disabled:cursor-not-allowed disabled:border-grey disabled:bg-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          {isChecking ? t("checking") : t("apply")}
        </button>
      </div>
      {error && (
        <p id="promo-code-error" className="mt-2 text-12reg text-red" role="alert">
          {t(`errors.${error}`)}
        </p>
      )}
    </div>
  );
}

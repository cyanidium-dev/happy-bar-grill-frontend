"use client";

import { useState } from "react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Button, { Sheen, buttonStyles } from "@/components/shared/buttons/Button";
import ChevronIcon from "@/components/shared/icons/ChevronIcon";
import ReceiptIcon from "@/components/shared/icons/ReceiptIcon";
import TagIcon from "@/components/shared/icons/TagIcon";
import { useCartHydrated, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import type { PlacedOrder } from "@/types/cart";
import { dishHref } from "@/utils/dishHref";
import { cn } from "@/utils/cn";

function OrderRow({
  order,
  expanded,
  onToggle,
}: {
  order: PlacedOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("Orders");
  const tp = useTranslations("Product");
  const format = useFormatter();
  const repeatOrder = useCartStore((s) => s.repeatOrder);
  const isLocked = useCartStore((s) => s.isLocked);
  const openCart = useUiStore((s) => s.open);

  const itemCount = order.items.reduce((n, it) => n + it.quantity, 0);
  const panelId = `order-${order.orderNumber}`;

  return (
    <li className="overflow-hidden rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-beige/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy/40 sm:px-6"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red/10 text-red">
          <ReceiptIcon className="size-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-findsans text-16bold uppercase text-navy">
              {t("number", { number: order.orderNumber })}
            </span>
            {order.promo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-olive/12 px-2 py-0.5 text-10med uppercase text-olive">
                <TagIcon className="size-3" />
                {order.promo.code}
              </span>
            )}
          </span>
          <span className="mt-1 block text-12reg text-grey-dark">
            {order.createdAt
              ? format.dateTime(new Date(order.createdAt), {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null}
            {order.createdAt ? " · " : null}
            {t("itemCount", { count: itemCount })}
          </span>
        </span>

        <span className="shrink-0 text-right">
          <span className="block font-findsans text-16bold text-navy">
            {order.total} {tp("currency")}
          </span>
        </span>

        {/* The shared chevron points right; rotate it into a disclosure caret. */}
        <ChevronIcon
          className={cn(
            "size-4 shrink-0 text-navy/50 transition-transform duration-300",
            expanded ? "-rotate-90" : "rotate-90",
          )}
        />
      </button>

      {expanded && (
        <div id={panelId} className="border-t border-navy/10 bg-beige/40 px-4 py-4 sm:px-6">
          <ul className="flex flex-col">
            {order.items.map((item) => {
              const href = dishHref(item);
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-navy/8 py-2.5 last:border-b-0"
                >
                  <Link
                    href={href}
                    aria-label={item.name}
                    className="relative size-12 shrink-0 overflow-hidden rounded-tl-lg rounded-br-lg bg-white"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href}
                      className="line-clamp-1 text-14semi text-navy transition-colors duration-300 hover:text-red"
                    >
                      {item.name}
                    </Link>
                    <p className="text-12med text-grey-dark">
                      {item.quantity} × {item.price} {tp("currency")}
                    </p>
                  </div>
                  <span className="shrink-0 text-14semi text-navy">
                    {item.price * item.quantity} {tp("currency")}
                  </span>
                </li>
              );
            })}
          </ul>

          {order.promo && (
            <div className="mt-4 flex flex-col gap-1.5 border-t border-navy/10 pt-3">
              <div className="flex items-center justify-between text-14reg text-graphite">
                <span>{t("subtotal")}</span>
                <span>
                  {order.subtotal} {tp("currency")}
                </span>
              </div>
              <div className="flex items-center justify-between text-14reg text-olive">
                <span>
                  {t("discount")} · {order.promo.code}
                </span>
                <span>
                  &minus;{order.promo.amount} {tp("currency")}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={isLocked}
            onClick={() => {
              repeatOrder(order.orderNumber);
              openCart("cart");
            }}
            className={buttonStyles({
              variant: "primary",
              shape: "leaf",
              size: "sm",
              fullWidth: true,
              className: "mt-4",
            })}
          >
            <Sheen />
            <span className="relative z-[1]">{t("repeat")}</span>
          </button>
        </div>
      )}
    </li>
  );
}

/**
 * Order history, read from the same persisted store the cart uses.
 *
 * There are no accounts on this site, so "history" means "orders placed from
 * this browser" — which is also why it works offline and why it is capped and
 * `noindex`. The one job that matters commercially is the repeat button:
 * re-ordering the usual is the single most common thing a returning customer
 * wants, and it is one tap from here.
 *
 * The newest order is expanded on arrival; the rest stay collapsed so a long
 * history is still scannable.
 */
export default function OrdersView() {
  const t = useTranslations("Orders");
  const hydrated = useCartHydrated();
  const orders = useCartStore((s) => s.orders);
  const clearOrders = useCartStore((s) => s.clearOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (!hydrated) {
    return <Container className="min-h-[40vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  if (orders.length === 0) {
    return (
      <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white px-6 py-14 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-red/10 text-red">
            <ReceiptIcon className="size-8" />
          </span>
          <h1 className="font-findsans text-24bold uppercase text-navy">
            {t("emptyTitle")}
          </h1>
          <p className="text-16reg text-grey-dark">{t("emptyText")}</p>
          <Button href="/menu" variant="primary" shape="leaf">
            {t("toMenu")}
          </Button>
        </div>
      </Container>
    );
  }

  // `expanded === null` means "untouched", so the newest row opens by default.
  const openId = expanded ?? orders[0].orderNumber;

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 md:mb-10">
        <h1 className="font-findsans text-28bold uppercase text-navy lg:text-40bold">
          {t("title")}
        </h1>
        <p className="text-14reg text-grey-dark">{t("localOnly")}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderRow
            key={order.orderNumber}
            order={order}
            expanded={openId === order.orderNumber}
            onToggle={() =>
              setExpanded((current) =>
                (current ?? orders[0].orderNumber) === order.orderNumber
                  ? ""
                  : order.orderNumber,
              )
            }
          />
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        {confirmingClear ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <p className="text-14reg text-graphite">{t("clearConfirm")}</p>
            <button
              type="button"
              onClick={() => {
                clearOrders();
                setConfirmingClear(false);
              }}
              className="cursor-pointer rounded-full bg-red px-4 py-2 text-12semi text-white transition-colors duration-300 hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              {t("clearYes")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingClear(false)}
              className="cursor-pointer rounded-full border border-navy/20 px-4 py-2 text-12semi text-navy transition-colors duration-300 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              {t("clearNo")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingClear(true)}
            className="cursor-pointer text-14med text-grey-dark underline decoration-navy/20 underline-offset-4 transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
          >
            {t("clear")}
          </button>
        )}
      </div>
    </Container>
  );
}

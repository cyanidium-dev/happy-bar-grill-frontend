"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "@/components/shared/container/Container";
import Button from "@/components/shared/buttons/Button";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import { useCartHydrated, useCartStore } from "@/store/cartStore";

/**
 * Post-order screen. Reads the last placed order from the persisted store
 * (survives reloads). Falls back to an empty state if opened directly.
 */
export default function ConfirmationView() {
  const t = useTranslations("Confirmation");
  const tp = useTranslations("Product");
  const hydrated = useCartHydrated();
  const order = useCartStore((s) => s.lastOrder);

  if (!hydrated) {
    return <Container className="min-h-[40vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  if (!order) {
    return (
      <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="flex flex-col items-start gap-6 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-8">
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

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-2xl rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-6 md:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-red/10 text-red">
            <CheckIcon className="size-8" />
          </span>
          <h1 className="mt-5 font-findsans text-28bold uppercase text-navy lg:text-32bold">
            {t("title")}
          </h1>
          <p className="mt-3 text-16reg text-graphite">{t("text")}</p>
          <p className="mt-4 text-16med text-navy">
            {t("orderNumber")}:{" "}
            <span className="font-findsans text-18semi">{order.orderNumber}</span>
          </p>
        </div>

        <ul className="mt-8 flex flex-col gap-3 border-t border-navy/10 pt-6">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-tl-lg rounded-br-lg">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.imageAlt || item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-14semi text-navy">{item.name}</p>
                <p className="text-14med text-grey-dark">
                  {item.quantity} × {item.price} {tp("currency")}
                </p>
              </div>
              <span className="text-14semi text-navy">
                {item.price * item.quantity} {tp("currency")}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-5">
          <span className="text-16med text-graphite">{t("total")}</span>
          <span className="text-24bold text-navy">
            {order.total} {tp("currency")}
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <Button href="/menu" variant="primary" shape="leaf" size="lg">
            {t("toMenu")}
          </Button>
        </div>
      </div>
    </Container>
  );
}

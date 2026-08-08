"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Input from "@/components/shared/forms/Input";
import Button from "@/components/shared/buttons/Button";
import CartItemRow from "@/components/cart/CartItemRow";
import PhoneField from "./PhoneField";
import { sendTelegramMessage } from "@/lib/telegram/client";
import { formatOrderTelegramMessage } from "@/lib/telegram/formatOrder";
import {
  selectCartTotal,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import { generateOrderNumber } from "@/utils/orderNumber";
import { cn } from "@/utils/cn";

type Fields = "name" | "phone" | "address";

/** Recommended (upsell) dishes as server-rendered DishCards, paired with slug. */
export type UpsellCard = { slug: string; node: ReactNode };

export default function CheckoutView({
  upsellCards,
}: {
  upsellCards: UpsellCard[];
}) {
  const t = useTranslations("Checkout");
  const tp = useTranslations("Product");
  const router = useRouter();

  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const placeOrder = useCartStore((s) => s.placeOrder);

  const payments = [t("paymentCash"), t("paymentCard")];

  const [values, setValues] = useState({
    name: "",
    phone: "", // 9 subscriber digits; full number is `+380${phone}`
    address: "",
    payment: payments[0],
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (field !== "payment" && errors[field as Fields]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<Fields, string>> = {};
    if (values.name.trim().length < 2) next.name = t("errors.name");
    if (values.phone.length < 9) next.phone = t("errors.phone");
    if (values.address.trim().length < 4) next.address = t("errors.address");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validate() || isSubmitting) return;

    setSubmitError(false);
    setIsSubmitting(true);

    const customer = {
      name: values.name.trim(),
      phone: `+380${values.phone}`,
      address: values.address.trim(),
      payment: values.payment,
      comment: values.comment.trim() || undefined,
    };
    const orderNumber = generateOrderNumber();

    try {
      await sendTelegramMessage(
        formatOrderTelegramMessage({
          orderNumber,
          customer,
          items,
          total,
        }),
      );
      placeOrder(customer, orderNumber);
      router.push("/confirmation");
    } catch {
      setSubmitError(true);
      setIsSubmitting(false);
    }
  };

  // Avoid an SSR/client mismatch: the store is empty on the server.
  if (!hydrated) {
    return <Container className="min-h-[40vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  const isEmpty = items.length === 0;
  const visibleUpsell = upsellCards
    .filter((card) => !items.some((it) => it.id === card.slug))
    .slice(0, 4);

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <h1 className="mb-8 font-findsans text-28bold uppercase text-navy md:mb-10 lg:text-40bold">
        {t("title")}
      </h1>

      {isEmpty ? (
        <div className="flex flex-col items-start gap-6 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-8">
          <p className="text-16reg text-grey-dark">{t("empty")}</p>
          <Button href="/menu" variant="primary" shape="leaf">
            {t("toMenu")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Mobile order: summary → form → recommended. On desktop the form +
              recommended sit in the left column, the summary on the right. */}
          <div className="order-2 flex min-w-0 flex-1 flex-col gap-8 lg:order-1">
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-6 md:p-8"
            >
              <h2 className="mb-5 text-20semi text-navy">
                {t("contactsTitle")}
              </h2>
              <div className="flex flex-col gap-4">
                <Input
                  label={t("name")}
                  required
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  error={errors.name}
                  autoComplete="name"
                />
                <PhoneField
                  label={t("phone")}
                  required
                  value={values.phone}
                  onChange={(digits) => set("phone", digits)}
                  error={errors.phone}
                />
                <Input
                  label={t("address")}
                  required
                  value={values.address}
                  onChange={(e) => set("address", e.target.value)}
                  error={errors.address}
                  autoComplete="street-address"
                />
              </div>

              <h2 className="mb-4 mt-8 text-20semi text-navy">
                {t("paymentTitle")}
              </h2>
              <div className="flex flex-col gap-3">
                {payments.map((option) => {
                  const active = values.payment === option;
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-full border px-5 py-3.5 text-14reg transition-colors duration-300 md:text-16reg",
                        active
                          ? "border-navy bg-navy/5 text-navy"
                          : "border-navy/15 text-graphite hover:border-navy/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option}
                        checked={active}
                        onChange={() => set("payment", option)}
                        className="size-4 accent-red"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col gap-1.5">
                <label
                  htmlFor="order-comment"
                  className="text-14med text-graphite"
                >
                  {t("comment")}
                </label>
                <textarea
                  id="order-comment"
                  rows={3}
                  value={values.comment}
                  onChange={(e) => set("comment", e.target.value)}
                  placeholder={t("commentPlaceholder")}
                  className="w-full resize-none rounded-sm border border-grey-dark bg-white px-6 py-3 text-14reg text-graphite placeholder-grey outline-none transition duration-300 ease-out focus:border-navy md:text-16reg"
                />
              </div>

              <p className="mt-8 text-14reg text-grey-dark">
                {t.rich("legal", {
                  offer: (chunks) => (
                    <Link
                      href="/offer"
                      className="text-navy underline hover:text-red"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>

              {submitError && (
                <p className="mt-4 text-14reg text-red" role="alert">
                  {t("errors.submit")}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                shape="leaf"
                fullWidth
                className="mt-4"
                isLoading={isSubmitting}
              >
                {t("placeOrder")}
              </Button>
            </form>

            {visibleUpsell.length > 0 && (
              <section>
                <h2 className="mb-6 font-findsans text-24bold uppercase text-navy">
                  {t("upsellTitle")}
                </h2>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                  {visibleUpsell.map((card) => (
                    <li key={card.slug} className="h-full">
                      {card.node}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Order summary */}
          <aside className="order-1 w-full lg:order-2 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:w-[380px] lg:shrink-0">
            <div className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-beige/60 p-4">
              <h2 className="mb-5 text-20semi text-navy">{t("orderTitle")}</h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <CartItemRow item={item} />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-5">
                <span className="text-16med text-graphite">{t("total")}</span>
                <span className="text-20bold text-navy">
                  {total} {tp("currency")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

    </Container>
  );
}

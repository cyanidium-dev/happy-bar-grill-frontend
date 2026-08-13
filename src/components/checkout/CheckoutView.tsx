"use client";

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Input from "@/components/shared/forms/Input";
import Button from "@/components/shared/buttons/Button";
import CartItemRow from "@/components/cart/CartItemRow";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import PhoneField from "./PhoneField";
import TimeSlotSelect from "./TimeSlotSelect";
import { ADDRESS } from "@/constants/contacts";
import type { Locale } from "@/i18n/routing";
import { OrderRequestError, submitOrder } from "@/lib/telegram/client";
import {
  selectCartTotal,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import type { DeliveryType, OrderTimeMode, PaymentMethod } from "@/types/cart";
import { isPersonName } from "@/utils/personName";
import { isUaSubscriberDigits } from "@/utils/phone";
import {
  getAvailableTimeSlots,
  isAvailableTimeSlot,
} from "@/utils/orderTimeSlots";
import { dishSlugOf } from "@/utils/cartLine";
import { cn } from "@/utils/cn";

type Fields = "name" | "phone" | "address" | "scheduled";

/** Recommended (upsell) dishes as server-rendered DishCards, paired with slug. */
export type UpsellCard = { slug: string; node: ReactNode };

export default function CheckoutView({
  upsellCards,
  formToken,
  locale,
}: {
  upsellCards: UpsellCard[];
  formToken: string;
  locale: Locale;
}) {
  const t = useTranslations("Checkout");
  const tp = useTranslations("Product");
  const tSlider = useTranslations("Common.slider");
  const router = useRouter();

  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const placeOrder = useCartStore((s) => s.placeOrder);

  const payments: { value: PaymentMethod; label: string }[] = [
    { value: "cash", label: t("paymentCash") },
    { value: "card", label: t("paymentCard") },
  ];

  const [values, setValues] = useState({
    name: "",
    phone: "", // 9 subscriber digits; full number is `+380${phone}`
    deliveryType: "delivery" as DeliveryType,
    address: "",
    timeMode: "asap" as OrderTimeMode,
    scheduledTime: "",
    payment: "cash" as PaymentMethod,
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitError, setSubmitError] = useState<
    "submit" | "unavailable" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const set = <K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K],
  ) => {
    setValues((v) => {
      if (field === "deliveryType") {
        const nextType = value as DeliveryType;
        if (nextType === "delivery") {
          return {
            ...v,
            deliveryType: nextType,
            timeMode: "asap" as OrderTimeMode,
            scheduledTime: "",
          };
        }
        const slots = getAvailableTimeSlots(nextType);
        return {
          ...v,
          deliveryType: nextType,
          scheduledTime:
            v.scheduledTime && slots.includes(v.scheduledTime)
              ? v.scheduledTime
              : "",
        };
      }
      return { ...v, [field]: value };
    });

    if (field === "deliveryType") {
      setErrors((e) => ({ ...e, address: undefined, scheduled: undefined }));
    }
    if (field === "timeMode" || field === "scheduledTime") {
      setErrors((e) => ({ ...e, scheduled: undefined }));
    }
    if (
      field !== "payment" &&
      field !== "deliveryType" &&
      field !== "timeMode" &&
      errors[field as Fields]
    ) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<Fields, string>> = {};
    if (!isPersonName(values.name)) next.name = t("errors.name");
    if (!isUaSubscriberDigits(values.phone)) next.phone = t("errors.phone");
    if (
      values.deliveryType === "delivery" &&
      values.address.trim().length < 4
    ) {
      next.address = t("errors.address");
    }
    if (values.deliveryType === "pickup" && values.timeMode === "scheduled") {
      if (!values.scheduledTime) {
        next.scheduled = t("errors.scheduled");
      } else if (!isAvailableTimeSlot("pickup", values.scheduledTime)) {
        next.scheduled = t("errors.scheduledClosed");
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!validate()) return;

    const lines = useCartStore
      .getState()
      .items.map(({ id, quantity }) => ({ id, quantity }));
    if (lines.length === 0) return;

    submittingRef.current = true;
    useCartStore.getState().lockCart();
    setSubmitError(null);
    setIsSubmitting(true);

    const customer = {
      name: values.name.trim(),
      phone: `+380${values.phone}`,
      deliveryType: values.deliveryType,
      address:
        values.deliveryType === "delivery" ? values.address.trim() : undefined,
      timeMode:
        values.deliveryType === "pickup" ? values.timeMode : ("asap" as const),
      scheduledAt:
        values.deliveryType === "pickup" && values.timeMode === "scheduled"
          ? values.scheduledTime
          : undefined,
      payment: values.payment,
      comment: values.comment.trim() || undefined,
    };

    try {
      const verified = await submitOrder(formToken, locale, customer, lines);
      placeOrder(customer, verified);
      router.push("/confirmation");
    } catch (error) {
      useCartStore.getState().unlockCart();
      submittingRef.current = false;
      setSubmitError(
        error instanceof OrderRequestError && error.code === "unavailable"
          ? "unavailable"
          : "submit",
      );
      setIsSubmitting(false);
    }
  };

  // Avoid an SSR/client mismatch: the store is empty on the server.
  if (!hydrated) {
    return <Container className="min-h-[40vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  const isEmpty = items.length === 0;
  const visibleUpsell = upsellCards.filter(
    (card) => !items.some((it) => dishSlugOf(it) === card.slug),
  );

  const isDelivery = values.deliveryType === "delivery";
  const isPickup = values.deliveryType === "pickup";
  const isScheduled = isPickup && values.timeMode === "scheduled";
  const timeSlots = getAvailableTimeSlots("pickup");

  const deliveryOptions: { value: DeliveryType; label: string }[] = [
    { value: "delivery", label: t("deliveryOption") },
    { value: "pickup", label: t("pickupOption") },
  ];

  const timeOptions: { value: OrderTimeMode; label: string }[] = [
    { value: "asap", label: t("timeAsap") },
    { value: "scheduled", label: t("timeScheduled") },
  ];

  const radioClass = (active: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-3 rounded-full border px-5 py-3.5 text-14reg transition-colors duration-300 md:text-16reg",
      active
        ? "border-navy bg-navy/5 text-navy"
        : "border-navy/15 text-graphite hover:border-navy/40",
    );

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <h1 className="mb-8 font-findsans text-28bold uppercase text-navy md:mb-10 lg:mb-20 lg:text-40bold">
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
          {/* Mobile order: summary → recommended → form. On desktop the upsell +
              form sit in the left column, the summary on the right. */}
          <div className="order-2 flex min-w-0 flex-1 flex-col gap-8 lg:order-1">
            {visibleUpsell.length > 0 && (
              <section className="relative">
                <h2 className="max-w-[360px] mb-8 font-findsans text-24bold uppercase text-navy">
                  {t("upsellTitle")}
                </h2>
                <SwiperWrapper
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 16 },
                    768: { slidesPerView: 2, spaceBetween: 24 },
                    1024: { slidesPerView: 1, spaceBetween: 24 },
                    1280: { slidesPerView: 2, spaceBetween: 24 },
                  }}
                  buttonsClassName="absolute right-0 top-11 sm:top-9"
                  prevLabel={tSlider("prev")}
                  nextLabel={tSlider("next")}
                  slides={visibleUpsell.map((card) => (
                    <div key={card.slug} className="h-full">
                      {card.node}
                    </div>
                  ))}
                />
              </section>
            )}

            <form
              onSubmit={onSubmit}
              noValidate
              aria-busy={isSubmitting || undefined}
              className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-6 md:p-8"
            >
              <h2 className="mb-5 text-20semi text-navy">
                {t("deliveryTitle")}
              </h2>
              <div className="flex flex-col gap-3">
                {deliveryOptions.map(({ value, label }) => {
                  const active = values.deliveryType === value;
                  return (
                    <label key={value} className={radioClass(active)}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value={value}
                        checked={active}
                        onChange={() => set("deliveryType", value)}
                        className="size-4 accent-navy"
                      />
                      {label}
                    </label>
                  );
                })}
              </div>

              {isDelivery ? (
                <div className="mt-4">
                  <Input
                    label={t("address")}
                    required
                    value={values.address}
                    onChange={(e) => set("address", e.target.value)}
                    error={errors.address}
                    autoComplete="street-address"
                  />
                </div>
              ) : (
                <p className="mt-4 text-14reg text-grey-dark">
                  {t("pickupHint")}: {ADDRESS}
                </p>
              )}

              {isPickup && (
                <>
                  <h2 className="mb-4 mt-8 text-20semi text-navy">
                    {t("timeTitle")}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {timeOptions.map(({ value, label }) => {
                      const active = values.timeMode === value;
                      return (
                        <label key={value} className={radioClass(active)}>
                          <input
                            type="radio"
                            name="timeMode"
                            value={value}
                            checked={active}
                            onChange={() => set("timeMode", value)}
                            className="size-4 accent-navy"
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>

                  {isScheduled && (
                    <div className="mt-4">
                      <TimeSlotSelect
                        label={t("scheduledTime")}
                        placeholder={t("scheduledTimePlaceholder")}
                        required
                        value={values.scheduledTime}
                        options={timeSlots}
                        onChange={(slot) => set("scheduledTime", slot)}
                        error={errors.scheduled}
                        emptyMessage={t("scheduledNoSlots")}
                      />
                    </div>
                  )}
                </>
              )}

              <h2 className="mb-5 mt-8 text-20semi text-navy">
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
              </div>

              <h2 className="mb-4 mt-8 text-20semi text-navy">
                {t("paymentTitle")}
              </h2>
              <div className="flex flex-col gap-3">
                {payments.map(({ value, label }) => {
                  const active = values.payment === value;
                  return (
                    <label key={value} className={radioClass(active)}>
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={active}
                        onChange={() => set("payment", value)}
                        className="size-4 accent-navy"
                      />
                      {label}
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
                  maxLength={500}
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
                  {t(`errors.${submitError}`)}
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
          </div>

          {/* Order summary */}
          <aside className="order-1 w-full lg:order-2 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:w-[380px] lg:shrink-0">
            <div className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-beige/60 p-4">
              <h2 className="mb-5 text-20semi text-navy">{t("orderTitle")}</h2>
              <ul className="flex flex-col overflow-x-clip">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
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

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import Container from "@/components/shared/container/Container";
import Input from "@/components/shared/forms/Input";
import PhoneField from "@/components/checkout/PhoneField";
import AddressMapPicker from "@/components/map/AddressMapPicker";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useProfileHydrated, useProfileStore } from "@/store/profileStore";
import type { DeliveryType, PaymentMethod } from "@/types/cart";
import { isDeliveryAddress } from "@/utils/address";
import { isPersonName } from "@/utils/personName";
import { isUaSubscriberDigits } from "@/utils/phone";
import { cn } from "@/utils/cn";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-5 md:p-7">
      <h2 className="text-20semi text-navy">{title}</h2>
      {description && (
        <p className="mt-1.5 text-14reg text-grey-dark">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Pill selector shared by the fulfilment and payment preferences. */
function Choice<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex flex-1 cursor-pointer items-center gap-3 rounded-full border px-5 py-3.5 text-14reg transition-colors duration-300 md:text-16reg",
              active
                ? "border-navy bg-navy/5 text-navy"
                : "border-navy/15 text-graphite hover:border-navy/40",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="size-4 accent-navy"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

/**
 * Settings — the part of the app that makes the *second* order fast.
 *
 * Everything here is device-local: there are no accounts, so this is a
 * remembered set of checkout defaults plus the switches an installed app is
 * expected to have (language, and a way to throw your own data away). Saving
 * happens on blur rather than behind a "Save" button, because a settings
 * screen you can leave in an unsaved state is a settings screen that silently
 * loses what you typed.
 */
export default function SettingsView() {
  const hydrated = useProfileHydrated();

  /**
   * The form is only mounted once localStorage has landed, so its fields can
   * be seeded straight from `useState` initialisers. Rendering it earlier
   * would mean copying the store into state after the fact, which either
   * fights the user's keystrokes or needs a "have I seeded yet" flag.
   */
  if (!hydrated) {
    return <Container className="min-h-[50vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  return <SettingsForm />;
}

function SettingsForm() {
  const t = useTranslations("Settings");
  const tc = useTranslations("Checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const profile = useProfileStore();
  const update = useProfileStore((s) => s.update);
  const clearProfile = useProfileStore((s) => s.clear);
  const clearOrders = useCartStore((s) => s.clearOrders);
  const clearFavorites = useFavoritesStore((s) => s.clear);

  const [draft, setDraft] = useState({
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});
  const [savedAt, setSavedAt] = useState(0);
  const [confirming, setConfirming] = useState<
    null | "orders" | "favorites" | "all"
  >(null);

  /**
   * "Saved" is a confirmation of the edit that just happened, so it fades
   * back out. Left pinned it stops meaning anything — after the first change
   * it would sit there for the rest of the session regardless of whether the
   * next thing you typed was stored.
   */
  useEffect(() => {
    if (!savedAt) return;
    const timer = window.setTimeout(() => setSavedAt(0), 2200);
    return () => window.clearTimeout(timer);
  }, [savedAt]);

  const flashSaved = () => setSavedAt(Date.now());

  /** Commits one field if it validates, or shows why it did not. */
  const commit = (field: "name" | "phone" | "address") => {
    const value = draft[field].trim();

    // An emptied field is a deliberate "forget this", not an error.
    if (!value) {
      update({ [field]: "" });
      setErrors((e) => ({ ...e, [field]: undefined }));
      flashSaved();
      return;
    }

    const valid =
      field === "name"
        ? isPersonName(value)
        : field === "phone"
          ? isUaSubscriberDigits(value)
          : isDeliveryAddress(value);

    if (!valid) {
      setErrors((e) => ({ ...e, [field]: tc(`errors.${field}`) }));
      return;
    }

    setErrors((e) => ({ ...e, [field]: undefined }));
    update({ [field]: value });
    flashSaved();
  };

  const deliveryOptions: { value: DeliveryType; label: string }[] = [
    { value: "delivery", label: tc("deliveryOption") },
    { value: "pickup", label: tc("pickupOption") },
  ];

  const paymentOptions: { value: PaymentMethod; label: string }[] = [
    { value: "cash", label: tc("paymentCash") },
    { value: "card", label: tc("paymentCard") },
  ];

  const dangerButton =
    "cursor-pointer rounded-full border border-navy/20 px-4 py-2 text-12semi text-navy transition-colors duration-300 hover:border-red hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40";

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 md:mb-10">
        <h1 className="font-findsans text-28bold uppercase text-navy lg:text-40bold">
          {t("title")}
        </h1>
        <p
          aria-live="polite"
          className={cn(
            "inline-flex items-center gap-1.5 text-14med text-olive transition-opacity duration-300",
            savedAt ? "opacity-100" : "opacity-0",
          )}
        >
          <CheckIcon className="size-4" />
          {t("saved")}
        </p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 lg:max-w-3xl">
        <Section title={t("profileTitle")} description={t("profileText")}>
          <div className="flex flex-col gap-6">
            <Input
              label={tc("name")}
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              onBlur={() => commit("name")}
              error={errors.name}
              autoComplete="name"
            />
            {/* `PhoneField` exposes no `onBlur` of its own, but React's blur
                event bubbles, so wrapping it commits on the same gesture as
                every other field here. */}
            <div onBlur={() => commit("phone")}>
              <PhoneField
                label={tc("phone")}
                value={draft.phone}
                onChange={(digits) => setDraft((d) => ({ ...d, phone: digits }))}
                error={errors.phone}
              />
            </div>
          </div>
        </Section>

        <Section title={t("addressTitle")} description={t("addressText")}>
          <Input
            label={tc("address")}
            value={draft.address}
            onChange={(e) =>
              setDraft((d) => ({ ...d, address: e.target.value }))
            }
            onBlur={() => commit("address")}
            error={errors.address}
            autoComplete="street-address"
          />
          <AddressMapPicker
            className="mt-4"
            coords={profile.coords}
            onPick={({ address, coords }) => {
              setDraft((d) => ({ ...d, address }));
              setErrors((e) => ({ ...e, address: undefined }));
              update({ address, coords });
              flashSaved();
            }}
          />

          <h3 className="mb-3 mt-7 text-16semi text-navy">
            {tc("deliveryTitle")}
          </h3>
          <Choice
            name="settings-delivery"
            options={deliveryOptions}
            value={profile.deliveryType}
            onChange={(deliveryType) => {
              update({ deliveryType });
              flashSaved();
            }}
          />

          <h3 className="mb-3 mt-7 text-16semi text-navy">
            {tc("paymentTitle")}
          </h3>
          <Choice
            name="settings-payment"
            options={paymentOptions}
            value={profile.payment}
            onChange={(payment) => {
              update({ payment });
              flashSaved();
            }}
          />
        </Section>

        <Section title={t("languageTitle")} description={t("languageText")}>
          <div className="flex flex-col gap-3 sm:flex-row">
            {routing.locales.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => router.replace(pathname, { locale: option })}
                aria-pressed={option === locale}
                className={cn(
                  "flex-1 cursor-pointer rounded-full border px-5 py-3.5 text-16reg transition-colors duration-300",
                  option === locale
                    ? "border-navy bg-navy/5 text-navy"
                    : "border-navy/15 text-graphite hover:border-navy/40",
                )}
              >
                {t(`language.${option}`)}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t("dataTitle")} description={t("dataText")}>
          {confirming ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="w-full text-14reg text-graphite">
                {t(`confirm.${confirming}`)}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirming === "orders") clearOrders();
                  if (confirming === "favorites") clearFavorites();
                  if (confirming === "all") {
                    clearOrders();
                    clearFavorites();
                    clearProfile();
                    setDraft({ name: "", phone: "", address: "" });
                  }
                  setConfirming(null);
                  flashSaved();
                }}
                className="cursor-pointer rounded-full bg-red px-4 py-2 text-12semi text-white transition-colors duration-300 hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
              >
                {t("confirmYes")}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className={dangerButton}
              >
                {t("confirmNo")}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConfirming("favorites")}
                className={dangerButton}
              >
                {t("clearFavorites")}
              </button>
              <button
                type="button"
                onClick={() => setConfirming("orders")}
                className={dangerButton}
              >
                {t("clearOrders")}
              </button>
              <button
                type="button"
                onClick={() => setConfirming("all")}
                className={dangerButton}
              >
                {t("clearAll")}
              </button>
            </div>
          )}
        </Section>
      </div>
    </Container>
  );
}

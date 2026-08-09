"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/shared/forms/Input";
import Button from "@/components/shared/buttons/Button";
import PhoneField from "@/components/checkout/PhoneField";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import { sendTelegramMessage } from "@/lib/telegram/client";
import { formatContactTelegramMessage } from "@/lib/telegram/formatContact";
import { cn } from "@/utils/cn";

type Field = "name" | "phone" | "message";

/**
 * Contact / feedback form. Sends the message to Telegram via the existing
 * `/api/telegram` endpoint (same infra as checkout). Shows loading, an error
 * on failure, and a success state on send.
 */
export default function ContactForm() {
  const t = useTranslations("ContactsPage");

  const [values, setValues] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<Field, string>> = {};
    if (values.name.trim().length < 2) next.name = t("errors.name");
    if (values.phone.length < 9) next.phone = t("errors.phone");
    if (values.message.trim().length < 5) next.message = t("errors.message");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setSubmitError(false);
    setIsSubmitting(true);
    try {
      await sendTelegramMessage(
        formatContactTelegramMessage({
          name: values.name.trim(),
          phone: `+380${values.phone}`,
          message: values.message.trim(),
        }),
      );
      setSuccess(true);
      setValues({ name: "", phone: "", message: "" });
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-red/10 text-red">
          <CheckIcon className="size-7" />
        </span>
        <h2 className="font-findsans text-24bold uppercase text-navy">
          {t("successTitle")}
        </h2>
        <p className="text-16reg text-graphite">{t("successText")}</p>
        <Button type="button" variant="secondary" onClick={() => setSuccess(false)}>
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white p-6 md:p-8"
    >
      <h2 className="mb-5 text-20semi text-navy">{t("formTitle")}</h2>

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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="text-14med text-graphite">
            {t("message")}
            <span className="ml-0.5 text-red" aria-hidden>
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={t("messagePlaceholder")}
            aria-invalid={errors.message ? true : undefined}
            className={cn(
              "w-full resize-none rounded-sm border bg-white px-6 py-3 text-14reg text-graphite placeholder-grey outline-none transition duration-300 ease-out md:text-16reg",
              errors.message
                ? "border-red focus:border-red"
                : "border-grey-dark focus:border-navy",
            )}
          />
          {errors.message && (
            <p className="text-12med text-red">{errors.message}</p>
          )}
        </div>
      </div>

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
        className="mt-6"
        isLoading={isSubmitting}
      >
        {t("submit")}
      </Button>
    </form>
  );
}

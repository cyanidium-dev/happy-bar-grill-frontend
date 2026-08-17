"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Localized 404. Client component so it can read messages from the provider in
 * the locale layout (route params aren't available while `notFound()` unwinds).
 */
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="text-5xl font-bold tracking-tight">404</p>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-zinc-500">{t("description")}</p>
      <Link href="/" className="mt-2 underline underline-offset-4">
        {t("backHome")}
      </Link>
    </div>
  );
}

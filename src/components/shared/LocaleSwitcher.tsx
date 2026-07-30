"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onChange(nextLocale: string) {
    router.replace(
      // @ts-expect-error -- pathname is a dynamic segment in some routes
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-black/[.08] bg-transparent px-2 py-1 dark:border-white/[.145]"
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {t(cur)}
          </option>
        ))}
      </select>
    </label>
  );
}

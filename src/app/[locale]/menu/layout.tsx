import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/**
 * Shared shell for the menu section. The promo banner is intentionally NOT here:
 * it must appear on the catalog views (`/menu`, `/menu/[category]`) but not on a
 * dish page, and this layout wraps that route too — so each catalog page renders
 * `<MenuBanner />` itself instead.
 */
export default async function MenuLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <>{children}</>;
}

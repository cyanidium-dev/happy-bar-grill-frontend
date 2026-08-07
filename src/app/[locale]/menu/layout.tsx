import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import MenuBanner from "@/components/menu/MenuBanner";
import type { Locale } from "@/i18n/routing";

/**
 * Shared shell for the menu section: the promo banner persists across `/menu`
 * and every `/menu/[category]`, while the category navigation + dishes come
 * from each page (they depend on the active category).
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

  return (
    <>
      <MenuBanner />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

// Body / UI text — geometric, excellent Cyrillic (uk/ru). Bound to --font-sans.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Display / headings / prices — condensed, energetic "grill board" character.
// Bound to --font-display.
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Pre-render the locale shell for every configured locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL("https://happy-bar-grill.vercel.app"),
    title: {
      default: t("site.title"),
      // Page titles render as "<page> | Happy Bar Grill".
      template: `%s | ${t("site.name")}`,
    },
    description: t("site.description"),
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this request's locale.
  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Header lives here later (shared across every page). */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {/* Footer lives here later (shared across every page). */}
      </body>
    </html>
  );
}

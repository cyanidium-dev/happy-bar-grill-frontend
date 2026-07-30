import type { Locale } from "@/i18n/routing";

/** Params present on every localized route. */
export type LocaleParams = { locale: Locale };

/**
 * Props for an App Router page. `TParams` adds dynamic segments on top of the
 * always-present `locale`, e.g. `PageProps<{ slug: string }>`.
 * `params` is a Promise because this Next.js version awaits route params.
 */
export type PageProps<TParams = Record<never, never>> = {
  params: Promise<LocaleParams & TParams>;
};

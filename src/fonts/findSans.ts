import localFont from "next/font/local";

/**
 * FindSans Pro for `font-findsans` (headings / prices).
 * Bold is the only weight on the critical path. Regular is footer-only
 * and is not preloaded. Light/Medium were unused and removed.
 * Files are latin+cyrillic woff2 subsets.
 */
export const findSansPro = localFont({
  src: [
    {
      path: "./FindSansPro/FindSansPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-findsans",
  display: "swap",
  preload: true,
});

export const findSansProRegular = localFont({
  src: [
    {
      path: "./FindSansPro/FindSansPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
});

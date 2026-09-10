import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo/constants";

/**
 * Web app manifest — served at `/manifest.webmanifest`.
 *
 * Copy is Ukrainian (the default locale) because a manifest is a single
 * document with no request context: it is fetched by the browser outside any
 * page navigation, so there is no locale to read. The installed app still
 * opens whatever locale the user last browsed.
 *
 * `id` is pinned to `/` and kept stable forever — it is the install identity.
 * Changing it makes browsers treat the app as a brand new one, so a previously
 * installed icon would stop updating. `start_url` may change freely.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE_NAME} — бар-гриль`,
    short_name: SITE_NAME,
    description:
      "Замовляйте бургери, гриль та напої з доставкою — меню, кошик і історія замовлень завжди під рукою.",
    lang: "uk",
    dir: "ltr",
    // `?source=pwa` marks sessions launched from the home screen so installs
    // can be told apart from browser traffic in analytics.
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    // If `standalone` is unavailable, prefer a minimal browser chrome over a
    // full tab — the bottom nav is the app's primary navigation either way.
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    // Matches the icon background, so the splash screen and the icon are one
    // continuous surface instead of a white flash.
    background_color: "#002755",
    theme_color: "#002755",
    categories: ["food", "shopping", "lifestyle"],
    // Reuse an already-open window instead of stacking new ones when the app
    // is launched again from the home screen.
    launch_handler: { client_mode: "navigate-existing" },
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops icons to its own shape; the maskable art is inset so
      // nothing important is cut off.
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Меню",
        short_name: "Меню",
        description: "Перейти до каталогу страв",
        url: "/menu?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Мої замовлення",
        short_name: "Замовлення",
        description: "Історія замовлень і повтор у один тап",
        url: "/orders?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Улюблене",
        short_name: "Улюблене",
        description: "Збережені страви",
        url: "/favorites?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96", type: "image/png" }],
      },
    ],
  };
}

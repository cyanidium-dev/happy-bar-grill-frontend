"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CATEGORY_PROGRESS_VAR, MENU_SECTION_ATTR } from "@/constants/menu";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

type Spy = {
  /** False on `/menu/[category]`, where each category is its own route. */
  enabled: boolean;
  activeSlug: string | null;
  /** Returns false when no section for that slug exists on this page. */
  scrollTo: (slug: string) => boolean;
};

const MenuScrollSpyContext = createContext<Spy>({
  enabled: false,
  activeSlug: null,
  scrollTo: () => false,
});

export const useMenuScrollSpy = () => useContext(MenuScrollSpyContext);

/**
 * Point the address bar at a category, without a navigation.
 *
 * Called on a chip tap only — never from the scroll. Following the scroll
 * would make the URL mean "you happened to pass this" rather than "you chose
 * this": analytics that auto-track history changes would count one reader
 * browsing the menu as eight page views, and anyone copying the address to
 * share the menu would send whichever category they stopped on.
 *
 * `replaceState` rather than `pushState`, so choosing four categories does not
 * bury the previous page under four back-button presses. The locale prefix is
 * preserved by rebuilding from the current path, since next-intl may or may
 * not include it depending on the routing config.
 */
function syncUrl(slug: string) {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const menuIndex = parts.indexOf("menu");
  if (menuIndex === -1) return;

  const next = `/${[...parts.slice(0, menuIndex + 1), slug].join("/")}`;
  if (next === window.location.pathname) return;

  window.history.replaceState(window.history.state, "", next);
}

/**
 * Tracks which category the reader is currently inside on the full `/menu`
 * page, so the chip strip can follow along, and lets the chips scroll to a
 * category instead of navigating to its route.
 *
 * `/menu/[category]` renders one category per route and never mounts this, so
 * the chips there stay ordinary links.
 */
export default function MenuScrollSpyProvider({
  entrySlug,
  children,
}: {
  /** Category the visitor landed on, or "all". Leads the catalog. */
  entrySlug: string;
  children: ReactNode;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    entrySlug === "all" ? null : entrySlug,
  );

  /**
   * True while a chip-driven scroll is in flight. The spy is muted for its
   * duration: the tween sweeps past every category in between, which would
   * otherwise strobe the highlight through them, and the fill would inherit
   * the old category's progress — reading as full for a moment before
   * snapping back to empty.
   */
  const seeking = useRef(false);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(`[${MENU_SECTION_ATTR}]`);
    if (!sections.length) return;

    // The chip strip is sticky under the header, so "current" means the
    // section crossing the line just below both of them — not the viewport
    // top, which sits behind the chrome.
    const line = () => {
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 0;
      return header + 96;
    };

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: () => `top ${line()}px`,
        end: () => `bottom ${line()}px`,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          if (seeking.current) return;
          // Highlight only. The address bar deliberately does *not* follow the
          // scroll — see `syncUrl`.
          if (!self.isActive) return;
          setActiveSlug(section.getAttribute(MENU_SECTION_ATTR));
        },
        /**
         * How far through the current category the reader is, published as a
         * CSS variable rather than React state: this fires on every scroll
         * tick, and re-rendering the whole chip strip that often would cost
         * far more than the one style write the fill actually needs.
         */
        onUpdate: (self) => {
          if (seeking.current || !self.isActive) return;
          document.documentElement.style.setProperty(
            CATEGORY_PROGRESS_VAR,
            String(self.progress),
          );
        },
      }),
    );

    /**
     * On first load with no active category (full catalog, page top) highlight
     * the first section immediately so the chip strip isn't blank on arrival.
     */
    // On the full catalog, highlight the first category right away so the
    // chip strip is never blank on arrival. ScrollTrigger.update() will then
    // correct it to whatever section is actually on screen.
    setActiveSlug((current) => {
      if (current !== null) return current;
      return sections[0]?.getAttribute(MENU_SECTION_ATTR) ?? null;
    });
    ScrollTrigger.update();

    /**
     * Landing on a category URL puts you at that category. The menu itself
     * keeps one order everywhere — the route decides where you arrive, not how
     * the list is arranged — so this is a jump, not a scroll: animating it
     * would look like the page moving on its own the moment it opened.
     */
    if (entrySlug !== "all") {
      const target = document.querySelector<HTMLElement>(
        `[${MENU_SECTION_ATTR}="${entrySlug}"]`,
      );
      if (target) {
        const header =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-height",
            ),
          ) || 0;
        window.scrollTo({
          top:
            window.scrollY + target.getBoundingClientRect().top - header - 72,
          behavior: "instant" as ScrollBehavior,
        });
        ScrollTrigger.update();
      }
    }

    return () => triggers.forEach((trigger) => trigger.kill());
  });

  const scrollTo = useCallback((slug: string) => {
    const target = document.querySelector<HTMLElement>(
      `[${MENU_SECTION_ATTR}="${slug}"]`,
    );
    if (!target) return false;

    const header =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 0;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Land on the target before the spy speaks again, and start its fill from
    // empty rather than wherever the previous category left it.
    seeking.current = true;
    setActiveSlug(slug);
    syncUrl(slug);
    document.documentElement.style.setProperty(CATEGORY_PROGRESS_VAR, "0");

    gsap.to(window, {
      duration: reduced ? 0 : 0.7,
      ease: "power2.inOut",
      scrollTo: { y: target, offsetY: header + 72 },
      onComplete: () => {
        seeking.current = false;
        ScrollTrigger.update();
      },
    });
    return true;
  }, []);

  const value = useMemo(
    () => ({ enabled: true, activeSlug, scrollTo }),
    [activeSlug, scrollTo],
  );

  return (
    <MenuScrollSpyContext.Provider value={value}>
      {children}
    </MenuScrollSpyContext.Provider>
  );
}

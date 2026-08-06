"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import LocaleSwitcherArrowIcon from "./icons/LocaleSwitcherArrowIcon";
import { cn } from "@/utils/cn";

export default function LocaleSwitcher({ className }: { className?: string }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const locales = routing.locales;
  const currentLocale = useLocale();
  const pathName = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    const hash = window.location.hash;

    const newPath = `${pathName}${hash}`;

    router.replace(newPath, { locale: newLocale });

    setIsOpen(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  return (
    <div
      className={cn("relative ml-auto mt-1 lg:mt-0 lg:mb-[3px]", className)}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-[9px] outline-none text-navy xl:hover:text-red focus-visible:text-red transition duration-300 ease-in-out"
      >
        <span className="text-[16px] lg:text-[14px] xl:text-[16px] font-medium leading-[125%] uppercase text-navy">
          {currentLocale === "uk" ? "UA" : currentLocale}
        </span>
        <LocaleSwitcherArrowIcon
          className={`size-3 xl:size-4 mb-[1px] ${
            isOpen ? "rotate-180" : "rotate-0"
          } transition duration-300 ease-in-out`}
        />
      </button>

      {/* Always mounted so the open/close transition can run on pure CSS
          (no framer-motion): opacity + a small upward slide, matching the
          previous initial/animate/exit (y: -10 → 0) timing. */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          "absolute right-0 mt-1 w-[65px] xl:w-[72px] rounded-[8px] bg-white shadow-md z-50 transition-all duration-300 ease-in-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-[10px] opacity-0",
        )}
      >
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            tabIndex={isOpen ? 0 : -1}
            className={`cursor-pointer w-full flex items-center justify-center px-4 py-2`}
          >
            <span
              className={`uppercase xl:hover:text-red focus-visible:text-red transition duration-300 ease-in-out ${
                currentLocale === locale
                  ? "text-red text-[16px] lg:text-[14px] xl:text-[16px] font-medium"
                  : "text-navy text-[16px] lg:text-[14px] xl:text-[16px] font-medium"
              }`}
            >
              {locale === "uk" ? "UA" : locale}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

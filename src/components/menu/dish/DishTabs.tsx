"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export type DishTab = { id: string; label: string; content: ReactNode };

/**
 * Tabbed sub-menu on the dish page (Description / Delivery / Payment). A WAI-ARIA
 * tablist: one tab is focusable at a time (roving tabindex) and ←/→ move between
 * tabs. Content nodes are rendered by the server and passed in as props.
 */
export default function DishTabs({ tabs }: { tabs: DishTab[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  if (tabs.length === 0) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-x-6 overflow-x-auto border-b border-navy/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`dish-tab-${tab.id}`}
              aria-controls={`dish-panel-${tab.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "relative -mb-px shrink-0 cursor-pointer whitespace-nowrap py-3 text-16semi transition-colors duration-300 focus-visible:outline-none",
                selected ? "text-red" : "text-navy hover:text-red",
              )}
            >
              {tab.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red transition-opacity duration-300",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`dish-panel-${tab.id}`}
          aria-labelledby={`dish-tab-${tab.id}`}
          hidden={i !== active}
          className="pt-5 text-16reg leading-relaxed text-graphite"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

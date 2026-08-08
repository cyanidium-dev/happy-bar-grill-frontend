"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import { blogPortableTextComponents } from "@/components/blog/portableText/portableTextComponents";
import ChevronIcon from "@/components/shared/icons/ChevronIcon";
import type { BlogFaqItem } from "@/types/blog";
import { cn } from "@/utils/cn";

/**
 * FAQ accordion built from `customFaq`. Each answer is Portable Text (it can
 * contain the `faqAnswerButton` CTA), rendered with the shared serializers.
 * The first item starts open.
 */
export default function BlogFaq({
  title,
  items,
}: {
  title: string;
  items: BlogFaqItem[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(items[0]?._key ?? null);

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-findsans text-24bold uppercase text-navy lg:text-28bold">
        {title}
      </h2>

      <ul className="mt-6 flex flex-col gap-3">
        {items.map((item) => {
          const isOpen = openKey === item._key;
          return (
            <li
              key={item._key}
              className="overflow-hidden rounded-tl-xl rounded-br-xl bg-navy"
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : item._key)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item._key}`}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="text-18semi text-white">{item.question}</span>
                <ChevronIcon
                  className={cn(
                    "size-5 shrink-0 text-white transition-transform duration-300",
                    isOpen ? "rotate-90" : "",
                  )}
                />
              </button>

              {/* Smooth expand/collapse via animated grid rows (0fr → 1fr) —
                  dependency-free and animates to the content's natural height. */}
              <div
                id={`faq-panel-${item._key}`}
                role="region"
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "px-5 pb-5",
                      "[&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white",
                      "[&_li]:!text-white [&_p]:!text-white [&_strong]:!text-white",
                      "[&_td]:!text-white [&_th]:!text-white",
                      "[&_a.group]:!text-white",
                    )}
                  >
                    <PortableText
                      value={item.answer}
                      components={blogPortableTextComponents}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

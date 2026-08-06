import { extendTailwindMerge } from "tailwind-merge";

export type ClassValue = string | number | false | null | undefined;

/**
 * Our design tokens name font sizes `<px><weight>` (e.g. `text-32bold`,
 * `text-16reg` — see `globals.css`'s `@theme` block) instead of Tailwind's
 * default `text-sm`/`text-lg` scale. Without this, tailwind-merge doesn't
 * recognize them as font-size utilities and instead treats them as
 * conflicting with `text-<color>` utilities (both share the `text-` prefix),
 * silently dropping whichever one comes first — e.g. `cn("text-32bold
 * text-white")` would strip the size. Registering the naming pattern here
 * teaches tailwind-merge to treat them as their own group, distinct from
 * `text-color`, and to correctly resolve conflicts *within* the scale
 * (e.g. a later `text-20semi` still overrides an earlier `text-16reg`).
 */
const isCustomFontSize = (classPart: string) =>
  /^\d{1,3}(bold|semi|med|reg|light)$/.test(classPart);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isCustomFontSize] }],
    },
  },
});

/**
 * Joins class names and resolves conflicting Tailwind utilities (`twMerge`),
 * so a later class (e.g. a component's `className` prop) reliably overrides
 * an earlier one from the same utility group instead of both landing in the
 * DOM and racing on source order.
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

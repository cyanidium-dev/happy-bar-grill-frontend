export type ClassValue = string | number | false | null | undefined;

/**
 * Joins truthy class names with a space. Intentionally tiny — no Tailwind
 * conflict resolution — so keep conditional classes non-overlapping, or pass
 * overrides last via the component's `className` prop.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

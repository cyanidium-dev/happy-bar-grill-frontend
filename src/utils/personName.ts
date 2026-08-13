export const MAX_PERSON_NAME = 80;

const ALLOWED = /^[\p{L}](?:[\p{L}\s'’ʼ-]*[\p{L}])?$/u;
const REPEATED_SEPARATOR = /[\s'’ʼ-]{2,}/;

/**
 * Person name for checkout / contact forms: 2–80 characters, at least two
 * letters, no digits. Spaces, hyphen and apostrophe are allowed
 * (Анна-Марія, Мар'яна).
 */
export function isPersonName(value: string): boolean {
  const name = value.trim();
  if (name.length < 2 || name.length > MAX_PERSON_NAME) return false;
  if (REPEATED_SEPARATOR.test(name)) return false;
  if (!ALLOWED.test(name)) return false;

  const letters = name.match(/\p{L}/gu);
  return letters != null && letters.length >= 2;
}

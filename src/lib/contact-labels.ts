/**
 * contact-labels.ts — the "how did you find me" options.
 *
 * Split out from lib/contact.ts so the Client Component can import the labels
 * without importing the Zod schema that lives alongside them. lib/contact.ts
 * re-exports these, so the server keeps a single import site.
 */
export const CONTACT_SOURCES = [
  "linkedin",
  "github",
  "referral",
  "search",
  "other",
] as const;

export type ContactSource = (typeof CONTACT_SOURCES)[number];

export const CONTACT_SOURCE_LABELS: Record<ContactSource, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  referral: "Someone referred me",
  search: "Search engine",
  other: "Something else",
};

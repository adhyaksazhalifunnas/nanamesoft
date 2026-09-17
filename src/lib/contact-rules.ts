/**
 * contact-rules.ts — the contact field rules as plain data.
 *
 * Why this file exists: ContactForm is the only Client Component on the site
 * that needs validation, and importing the Zod schema into it pulled all of
 * Zod into the browser bundle — 388 KB raw on /contact, which blew the §5.8
 * budget on its own. Validation rules are the payload here, not the library.
 *
 * The duplication between these rules and ContactRequestSchema is real, so it
 * is made safe rather than tolerated: tests/unit/contact-rules.test.ts asserts
 * that every rule below agrees with the Zod schema on a table of inputs. If
 * one is edited without the other, that test fails.
 *
 * The server remains authoritative (AC-09.4). These rules exist only to give a
 * fast, inline, on-blur experience.
 */

export type FieldKey = "name" | "email" | "organization" | "message";

export type FieldRule = {
  required: boolean;
  min?: number;
  max: number;
  /** Error messages are specific and recoverable, never "Invalid input" (§11.8). */
  messages: { required?: string; min?: string; max: string; format?: string };
  format?: "email";
};

export const CONTACT_RULES: Record<FieldKey, FieldRule> = {
  name: {
    required: true,
    min: 2,
    max: 80,
    messages: {
      required: "Please enter your name.",
      min: "Please enter your name.",
      max: "That name is longer than 80 characters.",
    },
  },
  email: {
    required: true,
    max: 254,
    format: "email",
    messages: {
      required: "Enter a valid email address.",
      format: "Enter a valid email address.",
      max: "That email address is too long.",
    },
  },
  organization: {
    required: false,
    max: 120,
    messages: { max: "Keep this under 120 characters." },
  },
  message: {
    required: true,
    min: 20,
    max: 2000,
    messages: {
      required: "Please write at least 20 characters so I can reply usefully.",
      min: "Please write at least 20 characters so I can reply usefully.",
      max: "Please keep this under 2,000 characters.",
    },
  },
};

/**
 * Deliberately permissive, and deliberately NOT a full RFC 5322 pattern.
 * The client's job is to catch "forgot the @" before a round trip; deciding
 * whether an address is truly valid is the server's job, and over-strict
 * client patterns reject real addresses.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message, or undefined when the value passes. */
export function validateField(key: FieldKey, rawValue: string): string | undefined {
  const rule = CONTACT_RULES[key];
  const value = rawValue.trim();

  if (value === "") {
    return rule.required ? rule.messages.required : undefined;
  }
  if (rule.min !== undefined && value.length < rule.min) {
    return rule.messages.min;
  }
  if (value.length > rule.max) {
    return rule.messages.max;
  }
  if (rule.format === "email" && !EMAIL_PATTERN.test(value)) {
    return rule.messages.format;
  }
  return undefined;
}

export const FIELD_KEYS: FieldKey[] = ["name", "email", "organization", "message"];

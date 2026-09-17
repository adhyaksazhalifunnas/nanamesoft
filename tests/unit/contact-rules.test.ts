/**
 * The client form validates with hand-written rules so that Zod stays out of
 * the browser bundle (see src/lib/contact-rules.ts for why). That duplication
 * is only safe if the two implementations agree, so this test drives both over
 * the same table of inputs and asserts they reach the same verdict.
 *
 * If someone changes one and not the other, this fails.
 */
import { describe, expect, it } from "vitest";

import { validateField, type FieldKey } from "@/lib/contact-rules";
import { ContactRequestSchema } from "@/lib/contact";

/** Runs one field through the Zod schema in isolation. */
function zodVerdict(key: FieldKey, value: string): boolean {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "A message that is comfortably longer than twenty characters.",
    _hp: "",
    _t: Date.now() - 10_000,
  };

  // `organization` is optional: an empty string means "not provided", which is
  // how the form serialises it, so drop the key rather than sending "".
  const candidate: Record<string, unknown> =
    key === "organization" && value.trim() === "" ? base : { ...base, [key]: value };

  return ContactRequestSchema.safeParse(candidate).success;
}

const CASES: Array<{ key: FieldKey; value: string; label: string }> = [
  // name
  { key: "name", value: "", label: "empty name" },
  { key: "name", value: "A", label: "one-character name" },
  { key: "name", value: "Jo", label: "two-character name" },
  { key: "name", value: "Adhyaksa Zhalifunnas", label: "ordinary name" },
  { key: "name", value: "x".repeat(80), label: "name at the 80-char limit" },
  { key: "name", value: "x".repeat(81), label: "name over the limit" },

  // email
  { key: "email", value: "", label: "empty email" },
  { key: "email", value: "not-an-email", label: "missing @" },
  { key: "email", value: "missing@domain", label: "missing TLD" },
  { key: "email", value: "priya@examplecorp.com", label: "valid email" },
  { key: "email", value: "a+tag@sub.example.co.uk", label: "plus tag and subdomain" },

  // organization (optional)
  { key: "organization", value: "", label: "empty organisation" },
  { key: "organization", value: "Example Corp", label: "ordinary organisation" },
  { key: "organization", value: "x".repeat(120), label: "organisation at the limit" },
  { key: "organization", value: "x".repeat(121), label: "organisation over the limit" },

  // message
  { key: "message", value: "", label: "empty message" },
  { key: "message", value: "too short", label: "message under 20 chars" },
  { key: "message", value: "x".repeat(20), label: "message at exactly 20 chars" },
  { key: "message", value: "x".repeat(2000), label: "message at the 2,000 limit" },
  { key: "message", value: "x".repeat(2001), label: "message over the limit" },
];

describe("contact validation parity", () => {
  it.each(CASES)("agrees on $label", ({ key, value }) => {
    const clientAccepts = validateField(key, value) === undefined;
    expect(clientAccepts).toBe(zodVerdict(key, value));
  });
});

describe("contact rule messages", () => {
  it("never returns a generic message", () => {
    for (const { key, value } of CASES) {
      const message = validateField(key, value);
      if (!message) continue;
      // §11.8: "Enter a valid email address" — never "Invalid input".
      expect(message.toLowerCase()).not.toMatch(/invalid input|required field|error/);
      expect(message.length).toBeGreaterThan(10);
    }
  });

  it("trims before measuring, so whitespace is not a valid message", () => {
    expect(validateField("message", " ".repeat(40))).toBeDefined();
  });
});

/**
 * contact.ts — the contact payload schema, shared by the form and the route.
 *
 * Deliberately NOT in schemas.ts: everything there is build-time content, and
 * this is the one shape that crosses the network. Keeping them apart means the
 * client bundle never pulls in the project/experience/education schemas just to
 * validate a message box.
 *
 * The client validates for a fast, inline experience. The server validates
 * because the client cannot be trusted (AC-09.4).
 */
import { z } from "zod";

export { CONTACT_SOURCES, CONTACT_SOURCE_LABELS } from "./contact-labels";
import { CONTACT_SOURCES } from "./contact-labels";

/**
 * Error messages are written to be recoverable and specific (§11.8):
 * "Enter a valid email address", never "Invalid input".
 */
export const ContactRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is longer than 80 characters."),
  email: z.email("Enter a valid email address.").max(254),
  organization: z.string().trim().max(120, "Keep this under 120 characters.").optional(),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so I can reply usefully.")
    .max(2000, "Please keep this under 2,000 characters."),
  source: z.enum(CONTACT_SOURCES).optional(),

  /** Honeypot. Must be empty; any value means a bot filled a hidden field. */
  _hp: z.string().max(0).optional().default(""),
  /** Epoch ms when the form was rendered. now - _t < 2000 means a bot. */
  _t: z.number().int().nonnegative(),

  turnstileToken: z.string().optional(),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;

export type ContactResponse =
  | { ok: true; message: string }
  | {
      ok: false;
      error: "VALIDATION_FAILED";
      fields: Record<string, string>;
    }
  | {
      ok: false;
      error: "VERIFICATION_FAILED" | "SEND_FAILED";
      message: string;
    }
  | {
      ok: false;
      error: "RATE_LIMITED";
      retryAfter: number;
      message: string;
    };

/** A human cannot read, think and type a 20-character message in under 2s. */
export const MIN_FILL_MS = 2000;

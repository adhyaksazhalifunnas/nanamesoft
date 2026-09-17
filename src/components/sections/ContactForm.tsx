"use client"; // form state, on-blur validation, async submit — US-09

/**
 * ContactForm — US-09.
 *
 * AC-09.4  Validation is inline, on blur, non-blocking, and announced via
 *          aria-live. The server is authoritative; this is only a courtesy.
 * AC-09.5  Success states the expected response time AND the direct address.
 * AC-09.6  Failure never destroys the typed message, and always offers a
 *          mailto: fallback pre-filled with what was already written.
 * AC-09.7  Honeypot + minimum fill time + (optional) Turnstile + server-side
 *          rate limit. A legitimate visitor never sees a puzzle.
 *
 * The form works as a plain POST target for nothing — it requires JS. That is
 * acceptable here and only here, because AC-09.1 guarantees a second route
 * (the visible mailto:) that needs no JavaScript at all.
 */
import { useEffect, useRef, useState } from "react";

import {
  FIELD_KEYS,
  validateField as validate,
  type FieldKey,
} from "@/lib/contact-rules";
// Types only — `import type` is erased at compile time, so importing from
// lib/contact here does NOT pull Zod into the client bundle.
import type { ContactResponse } from "@/lib/contact";
import { CONTACT_SOURCES, CONTACT_SOURCE_LABELS } from "@/lib/contact-labels";

type Status = "idle" | "submitting" | "success" | "error";

type Fields = {
  name: string;
  email: string;
  organization: string;
  message: string;
  source: string;
};

const EMPTY: Fields = { name: "", email: "", organization: "", message: "", source: "" };

export function ContactForm({ email }: { email: string }) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formMessage, setFormMessage] = useState("");

  /** Set once on mount; the server rejects anything submitted within 2s of it. */
  const renderedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  function validateField(key: FieldKey, value: string) {
    setErrors((prev) => ({ ...prev, [key]: validate(key, value) }));
  }

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear an error as soon as the visitor starts fixing it — re-validating on
    // every keystroke would scold them mid-word.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFormMessage("");

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      ...(fields.organization.trim() ? { organization: fields.organization.trim() } : {}),
      message: fields.message.trim(),
      ...(fields.source ? { source: fields.source } : {}),
      _hp: honeypot.current?.value ?? "",
      _t: renderedAt.current,
    };

    const next: Partial<Record<FieldKey, string>> = {};
    for (const key of FIELD_KEYS) {
      const error = validate(key, fields[key]);
      if (error) next[key] = error;
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus("error");
      setFormMessage("Please fix the fields marked below.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ContactResponse;

      if (data.ok) {
        setStatus("success");
        setFormMessage(data.message);
        setFields(EMPTY); // only cleared on a confirmed send
        return;
      }

      setStatus("error");
      if (data.error === "VALIDATION_FAILED") {
        setErrors(data.fields as Partial<Record<keyof Fields, string>>);
        setFormMessage("Please fix the fields marked below.");
      } else {
        setFormMessage(data.message);
      }
    } catch {
      setStatus("error");
      setFormMessage(
        `That request could not be sent — you may be offline. Your message is still here, and you can email it to ${email} instead.`,
      );
    }
  }

  // AC-09.6: the fallback carries what has already been typed, so a failure
  // costs the visitor a click rather than their whole message.
  const mailtoFallback = `mailto:${email}?subject=${encodeURIComponent(
    `Portfolio contact — ${fields.name || "hello"}`,
  )}&body=${encodeURIComponent(fields.message)}`;

  if (status === "success") {
    return (
      <output className="border-accent block border p-[var(--space-6)]">
        <p className="font-display text-md">{formMessage}</p>
        <p className="text-ink-muted mt-[var(--space-3)] text-sm">
          If you do not hear back, email me directly at{" "}
          <a
            href={`mailto:${email}`}
            className="text-accent underline underline-offset-4"
          >
            {email}
          </a>
          .
        </p>
      </output>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[var(--measure)]">
      {/* Honeypot. Hidden from sight AND from assistive technology, and excluded
          from the tab order, so no real visitor can reach it by any route. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Company website</label>
        <input
          ref={honeypot}
          id="company-website"
          name="company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="space-y-[var(--space-5)]">
        <Field
          id="name"
          label="Name"
          required
          value={fields.name}
          error={errors.name}
          autoComplete="name"
          onChange={(v) => update("name", v)}
          onBlur={() => validateField("name", fields.name)}
        />

        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={fields.email}
          error={errors.email}
          autoComplete="email"
          onChange={(v) => update("email", v)}
          onBlur={() => validateField("email", fields.email)}
        />

        <Field
          id="organization"
          label="Organisation"
          optional
          value={fields.organization}
          error={errors.organization}
          autoComplete="organization"
          onChange={(v) => update("organization", v)}
          onBlur={() => validateField("organization", fields.organization)}
        />

        <div>
          <label htmlFor="source" className="block text-sm font-medium">
            How did you find me?{" "}
            <span className="text-ink-subtle font-normal">(optional)</span>
          </label>
          <select
            id="source"
            value={fields.source}
            onChange={(e) => update("source", e.target.value)}
            className="border-rule bg-ground mt-[var(--space-2)] min-h-11 w-full border px-[var(--space-3)] text-base"
          >
            <option value="">Prefer not to say</option>
            {CONTACT_SOURCES.map((s) => (
              <option key={s} value={s}>
                {CONTACT_SOURCE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <Field
          id="message"
          label="Message"
          required
          multiline
          value={fields.message}
          error={errors.message}
          hint={`${fields.message.trim().length} of 2,000 characters`}
          onChange={(v) => update("message", v)}
          onBlur={() => validateField("message", fields.message)}
        />
      </div>

      {/* AC-09.4: status is announced without stealing focus. */}
      {/* <output> carries an implicit status role and a polite live region,
          which assistive technology supports more consistently than a <p> with
          role="status" bolted on. */}
      <output
        className={`mt-[var(--space-5)] block text-sm ${status === "error" ? "text-accent" : "text-ink-muted"}`}
      >
        {formMessage}
      </output>

      <div className="mt-[var(--space-5)] flex flex-wrap items-center gap-[var(--space-4)]">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-ink text-ground inline-flex min-h-11 items-center px-[var(--space-6)] text-sm font-medium transition-opacity duration-[var(--dur-fast)] hover:opacity-85 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        {status === "error" ? (
          <a
            href={mailtoFallback}
            className="text-accent text-sm underline underline-offset-4"
          >
            Send this by email instead
          </a>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  id: keyof Fields;
  label: string;
  value: string;
  error?: string | undefined;
  hint?: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function Field({
  id,
  label,
  value,
  error,
  hint,
  type = "text",
  required,
  optional,
  multiline,
  autoComplete,
  onChange,
  onBlur,
}: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  const shared = {
    id,
    name: id,
    value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onBlur,
    className: `mt-[var(--space-2)] w-full border bg-ground px-[var(--space-3)] py-[var(--space-2)] text-base ${
      error ? "border-accent" : "border-rule"
    }`,
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}{" "}
        {optional ? (
          <span className="text-ink-subtle font-normal">(optional)</span>
        ) : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={6} className={`${shared.className} min-h-32`} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={`${shared.className} min-h-11`}
        />
      )}

      {hint ? (
        <p id={hintId} className="tabular text-ink-subtle mt-[var(--space-1)] text-xs">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-accent mt-[var(--space-1)] text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}

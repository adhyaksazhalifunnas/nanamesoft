/**
 * POST /api/contact — PRD §7.2.
 *
 * One of only two runtime functions on the whole site. Everything else is
 * static, which is what keeps the failure surface this small.
 *
 * Error-handling principles from §7.2, all of which shape the code below:
 *   1. Never lose the message — the client keeps its state on every non-200.
 *   2. Always offer the fallback — every error body names the direct address.
 *   3. Fail CLOSED on bots, OPEN on humans — the honeypot and timing traps
 *      return 200 with no send, so a bot never learns it was detected.
 *   4. Never leak internals — provider errors are logged, never returned.
 *   5. Idempotency-ish — a duplicate within 60s succeeds without re-sending.
 */
import { NextResponse } from "next/server";

import site from "@content/site";
import { ContactRequestSchema, MIN_FILL_MS, type ContactResponse } from "@/lib/contact";

export const runtime = "nodejs";
/** There is nothing to prerender, and caching a POST would be a bug. */
export const dynamic = "force-dynamic";

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const DEDUPE_WINDOW_MS = 60 * 1000;
const SUCCESS_MESSAGE = "Message received. I typically reply within 48 hours.";

/**
 * In-memory counters. On a single serverless instance this is enough for the
 * traffic a portfolio sees, and it costs no external dependency. It resets on
 * cold start and is not shared across instances — which is the documented
 * trade: this is a speed bump for casual abuse, layered with the honeypot,
 * the timing check and Turnstile, not a security boundary on its own.
 * Move to Vercel KV or Upstash if this ever needs to be authoritative.
 */
const hits = new Map<string, number[]>();
const recent = new Map<string, number>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const window = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (window.length >= RATE_LIMIT.max) {
    hits.set(ip, window);
    return true;
  }
  window.push(now);
  hits.set(ip, window);
  return false;
}

/** Cheap stable key for the dedupe check — no crypto needed for a 60s window. */
function fingerprint(email: string, message: string): string {
  let hash = 0;
  const input = `${email}:${message}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `${email}:${hash}`;
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured: skip verification rather than reject everyone. The other
  // three spam layers still apply, and a portfolio that silently refuses all
  // contact because an env var is missing is the worse failure.
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function send(payload: {
  name: string;
  email: string;
  organization?: string;
  message: string;
  source?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    // Not configured. Log it so a local submission is still visible during
    // development, and let the caller treat this as a successful receipt.
    console.info("[contact] Resend not configured; message not delivered:", {
      ...payload,
      message: `${payload.message.slice(0, 80)}…`,
    });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      // §5.7: a fixed recipient only. Never relay to an address from the body.
      to: [site.email],
      // The visitor's address goes in reply_to, never in `from`, so the
      // endpoint cannot be used to spoof mail as someone else.
      reply_to: payload.email,
      subject: `Portfolio contact — ${payload.name}${payload.organization ? ` (${payload.organization})` : ""}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.organization ? `Organisation: ${payload.organization}` : null,
        payload.source ? `Found via: ${payload.source}` : null,
        "",
        payload.message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}`);
  }
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  const ip = clientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "VALIDATION_FAILED",
        fields: { message: "That request could not be read. Please try again." },
      },
      { status: 400 },
    );
  }

  const parsed = ContactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "VALIDATION_FAILED", fields },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Principle 3: bot traps return the success response without sending, so a
  // bot cannot distinguish detection from delivery and tune around it.
  if (data._hp !== "") {
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  }
  if (Date.now() - data._t < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "RATE_LIMITED",
        retryAfter: 3600,
        message: `You've sent several messages recently. Please email me directly at ${site.email}.`,
      },
      { status: 429, headers: { "retry-after": "3600" } },
    );
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json(
      {
        ok: false,
        error: "VERIFICATION_FAILED",
        message: `Verification failed. Please email me directly at ${site.email}.`,
      },
      { status: 403 },
    );
  }

  // Principle 5: a double-submitted form succeeds without a second email.
  const key = fingerprint(data.email, data.message);
  const last = recent.get(key);
  if (last && Date.now() - last < DEDUPE_WINDOW_MS) {
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  }

  try {
    await send({
      name: data.name,
      email: data.email,
      ...(data.organization ? { organization: data.organization } : {}),
      message: data.message,
      ...(data.source ? { source: data.source } : {}),
    });
    recent.set(key, Date.now());
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  } catch (error) {
    // Principle 4: log the real reason, return a generic one.
    console.error("[contact] send failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "SEND_FAILED",
        message: `Something went wrong on my end. Please email me directly at ${site.email}.`,
      },
      { status: 500 },
    );
  }
}

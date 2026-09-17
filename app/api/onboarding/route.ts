import { NextRequest, NextResponse } from "next/server";
import { onboardingSchema, extractFieldErrors } from "@/lib/validation";
import { sendOnboardingEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generic message — never leak internals to the client. */
const GENERIC_ERROR =
  "Something went wrong while sending your information. Your answers have not been lost. Please try again.";

export async function POST(request: NextRequest) {
  // Basic rate limiting: max 5 submissions per 10 minutes per IP.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`onboarding:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many attempts from your connection. Please wait ${limit.retryAfterSeconds} seconds and try again.`,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  // Honeypot — silently accept bot submissions without sending email.
  const honeypot =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).company_website_field
      : undefined;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    console.warn("[onboarding] Honeypot triggered — likely spam, dropping.");
    return NextResponse.json({ ok: true });
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    console.warn(
      "[onboarding] Validation failed:",
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
    );
    return NextResponse.json(
      {
        ok: false,
        error: "Some answers need attention. Please review the highlighted fields.",
        fieldErrors: extractFieldErrors(parsed.error),
      },
      { status: 422 }
    );
  }

  try {
    await sendOnboardingEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log the technical detail server-side only.
    console.error("[onboarding] Submission failed:", err);
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 500 });
  }
}

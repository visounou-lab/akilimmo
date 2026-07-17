import { NextResponse } from "next/server";

/**
 * Application intake endpoint.
 *
 * This batch acknowledges the submission and returns a reference number so the
 * public flow is end-to-end functional. Persistence (Application table),
 * transactional e-mail (Resend/Postmark), secure document upload, audit log and
 * anti-abuse rate limiting are added in the "Formulaire" / "Admin" batches.
 *
 * Security note: this endpoint must never accept or store banking passwords,
 * PINs or 2FA codes — the form does not collect them.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Minimal server-side validation mirroring the client rules.
  const email = String(body.email ?? "");
  const consentPrivacy = body.consentPrivacy === true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consentPrivacy) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const reference = generateReference();

  // Placeholder for real handling (DB insert, e-mail, audit) — see batch plan.
  console.info("[antrag] received", {
    reference,
    locale: body.locale,
    productType: body.productType,
    amount: body.amount,
    term: body.term,
  });

  return NextResponse.json({ reference }, { status: 201 });
}

function generateReference(): string {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SF-${y}-${rand}`;
}

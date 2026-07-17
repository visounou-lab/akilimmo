import { NextResponse } from "next/server";

/**
 * Contact endpoint. Acknowledges the message in this batch; wiring to the
 * transactional e-mail provider and anti-spam controls follows in a later batch.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = String(body.email ?? "");
  const name = String(body.name ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  console.info("[kontakt] received", { locale: body.locale, name });
  return NextResponse.json({ ok: true }, { status: 201 });
}

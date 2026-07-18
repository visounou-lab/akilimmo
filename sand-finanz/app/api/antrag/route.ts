import { NextResponse } from "next/server";
import type { Country, Currency, ProductType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

/**
 * Application intake endpoint. Persists the customer, application and financial
 * profile, then returns a reference number. Transactional e-mail and secure
 * document upload are added in later batches.
 *
 * Security: never accepts banking passwords, PINs or 2FA codes — the form does
 * not collect them.
 */

const PRODUCTS: ProductType[] = ["personal", "auto", "renovation", "business", "study", "energy"];
const COUNTRIES: Country[] = ["DE", "PL", "SE", "CZ", "GB", "CH", "LI"];
const CURRENCY_BY_COUNTRY: Record<Country, Currency> = { DE: "EUR", PL: "PLN", SE: "SEK", CZ: "CZK", GB: "GBP", CH: "CHF", LI: "CHF" };

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const consentPrivacy = body.consentPrivacy === true;
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const amount = Number(body.amount);
  const termMonths = Number(body.term);
  const productType = String(body.productType ?? "") as ProductType;
  const country = (COUNTRIES.includes(String(body.country ?? "") as Country) ? body.country : "DE") as Country;

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !consentPrivacy ||
    !firstName ||
    !lastName ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0 ||
    !PRODUCTS.includes(productType)
  ) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const now = new Date();
  const reference = generateReference(now);
  const locale = typeof body.locale === "string" ? body.locale : "de";

  try {
    await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          salutation: str(body.salutation),
          firstName,
          lastName,
          birthDate: str(body.birthDate),
          nationality: str(body.nationality),
          email,
          phone: str(body.phone),
          address: str(body.address),
          locale,
          consentPrivacyAt: now,
          consentContactAt: body.consentContact === true ? now : null,
          consentMarketingAt: body.consentMarketing === true ? now : null,
        },
      });

      await tx.application.create({
        data: {
          reference,
          customerId: customer.id,
          country,
          productType,
          currency: CURRENCY_BY_COUNTRY[country],
          amount,
          termMonths,
          purpose: str(body.purpose),
          status: "SUBMITTED",
          financialProfile: {
            create: {
              employment: str(body.employment),
              income: numOrNull(body.income),
              expenses: numOrNull(body.expenses),
              housing: str(body.housing),
              existingLoans: str(body.existingLoans),
            },
          },
        },
      });
    });

    await writeAudit({ action: "application.submitted", entity: "Application", entityId: reference, metadata: { productType, amount, termMonths } });
    return NextResponse.json({ reference }, { status: 201 });
  } catch (err) {
    console.error("[antrag] persistence failed", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

function str(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s || null;
}
function numOrNull(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) && v !== "" && v != null ? n : null;
}
function generateReference(now: Date): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SF-${now.getFullYear()}-${rand}`;
}

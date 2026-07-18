import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { PLACEHOLDER_CATALOG } from "@/lib/credit-engine/catalog";
import { writeAudit } from "@/lib/audit";

/**
 * One-time bootstrap: seeds the credit product versions and creates the first
 * super-admin — without a CLI. Guarded and self-disabling:
 *   • Disabled unless ADMIN_BOOTSTRAP_TOKEN is set.
 *   • Requires ?token=<ADMIN_BOOTSTRAP_TOKEN> (constant-time compared).
 *   • Refuses once any SUPER_ADMIN already exists.
 * After first use, unset ADMIN_BOOTSTRAP_TOKEN.
 *
 * Usage: open  /api/admin/bootstrap?token=YOUR_TOKEN
 */
export async function GET(request: Request) {
  const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "bootstrap_disabled" }, { status: 404 });
  }
  const provided = new URL(request.url).searchParams.get("token") ?? "";
  if (!constantTimeEqual(provided, expected)) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (existingAdmin) {
    return NextResponse.json({ error: "already_bootstrapped" }, { status: 409 });
  }

  // Seed credit product versions if none exist.
  const productCount = await prisma.creditProductVersion.count();
  if (productCount === 0) {
    for (const v of PLACEHOLDER_CATALOG) {
      await prisma.creditProductVersion.create({
        data: {
          key: v.id,
          version: 1,
          country: v.country,
          productType: v.productType,
          currency: v.currency,
          minAmount: v.minAmount,
          maxAmount: v.maxAmount,
          minTerm: v.minTerm,
          maxTerm: v.maxTerm,
          nominalRate: v.nominalRate,
          roundingUnit: v.rounding.unit,
          roundingMode: v.rounding.mode,
          activeFrom: v.activeFrom,
          disclaimerKey: v.disclaimerKey,
          status: "PUBLISHED",
        },
      });
    }
  }

  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@sand-finanz.local").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const admin = await prisma.user.create({
    data: {
      email,
      name: "Super Admin",
      passwordHash: await hashPassword(password),
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      mfaEnabled: false,
    },
  });
  await writeAudit({ actorId: admin.id, action: "admin.bootstrapped", entity: "User", entityId: admin.id });

  return NextResponse.json({
    ok: true,
    email,
    products: PLACEHOLDER_CATALOG.length,
    next: "Melden Sie sich unter /admin/login an und richten Sie die 2FA ein. Danach ADMIN_BOOTSTRAP_TOKEN entfernen.",
  });
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

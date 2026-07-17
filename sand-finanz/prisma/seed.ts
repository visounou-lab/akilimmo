import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Credit product versions — PLACEHOLDER example values (mirror
 * lib/credit-engine/catalog.ts). NOT real SAND FINANZ offers; to be replaced by
 * compliance-validated figures via the admin before production.
 */
const CREDIT_VERSIONS = [
  { key: "de-personal", country: "DE", productType: "personal", currency: "EUR", minAmount: 2000, maxAmount: 50000, minTerm: 12, maxTerm: 84, nominalRate: 0.069 },
  { key: "de-auto", country: "DE", productType: "auto", currency: "EUR", minAmount: 3000, maxAmount: 80000, minTerm: 12, maxTerm: 96, nominalRate: 0.049 },
  { key: "de-renovation", country: "DE", productType: "renovation", currency: "EUR", minAmount: 5000, maxAmount: 100000, minTerm: 24, maxTerm: 120, nominalRate: 0.059 },
] as const;

async function main() {
  // --- Credit product versions ---
  for (const v of CREDIT_VERSIONS) {
    await prisma.creditProductVersion.upsert({
      where: { key_version: { key: v.key, version: 1 } },
      update: {},
      create: {
        key: v.key,
        version: 1,
        country: v.country as never,
        productType: v.productType as never,
        currency: v.currency as never,
        minAmount: v.minAmount,
        maxAmount: v.maxAmount,
        minTerm: v.minTerm,
        maxTerm: v.maxTerm,
        nominalRate: v.nominalRate,
        roundingUnit: 0.01,
        roundingMode: "nearest",
        activeFrom: "2026-01-01",
        disclaimerKey: "calculator.disclaimer",
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${CREDIT_VERSIONS.length} credit product versions.`);

  // --- Initial super-admin ---
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@sand-finanz.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name: "Super Admin",
        passwordHash: await bcrypt.hash(password, 12),
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        mfaEnabled: false, // forced to enrol TOTP on first login
      },
    });
    console.log(`Created super-admin: ${email}`);
    if (!process.env.SEED_ADMIN_PASSWORD) {
      console.log(`  Default password: ${password}  (set SEED_ADMIN_PASSWORD to override; change it after first login)`);
    }
  } else {
    console.log(`Super-admin already exists: ${email}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

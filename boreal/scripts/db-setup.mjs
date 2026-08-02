// =============================================================================
// db-setup — exécuté au build (« node scripts/db-setup.mjs && next build »).
//   - Si DATABASE_URL est absent (aperçu / local sans base) : on ignore.
//   - Sinon : `prisma db push` puis seed idempotent (produits, réglages société,
//     compte admin via ADMIN_EMAIL + ADMIN_SEED_PASSWORD).
// Idempotent : ré-exécutable sans effet de bord.
// =============================================================================
import { execSync } from "node:child_process";
import { randomBytes, scryptSync } from "node:crypto";

if (!process.env.DATABASE_URL) {
  console.log(
    "[db-setup] DATABASE_URL absent — étape ignorée (mode aperçu).",
  );
  process.exit(0);
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

const PRODUCTS = [
  { key: "personal", minAmount: 1000, maxAmount: 50000, minMonths: 6, maxMonths: 84, annualRate: 3, sortOrder: 1 },
  { key: "auto", minAmount: 5000, maxAmount: 125000, minMonths: 12, maxMonths: 96, annualRate: 3.5, sortOrder: 2 },
  { key: "renovation", minAmount: 2000, maxAmount: 100000, minMonths: 12, maxMonths: 120, annualRate: 3.9, sortOrder: 3 },
  { key: "consolidation", minAmount: 5000, maxAmount: 75000, minMonths: 12, maxMonths: 96, annualRate: 4.5, sortOrder: 4 },
  { key: "business", minAmount: 10000, maxAmount: 500000, minMonths: 12, maxMonths: 120, annualRate: 4.9, sortOrder: 5 },
  { key: "project", minAmount: 5000, maxAmount: 250000, minMonths: 12, maxMonths: 120, annualRate: 4.5, sortOrder: 6 },
];

async function main() {
  console.log("[db-setup] prisma db push…");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
  });

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // Produits de crédit (upsert par clé)
    for (const p of PRODUCTS) {
      await prisma.creditProduct.upsert({
        where: { key: p.key },
        update: {
          minAmount: p.minAmount,
          maxAmount: p.maxAmount,
          minMonths: p.minMonths,
          maxMonths: p.maxMonths,
          annualRate: p.annualRate,
          sortOrder: p.sortOrder,
        },
        create: p,
      });
    }
    console.log(`[db-setup] ${PRODUCTS.length} produits de crédit assurés.`);

    // Réglages société — singleton vide (placeholders saisis par l'admin)
    await prisma.companySettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
    console.log("[db-setup] réglages société (singleton) assurés.");

    // Compte admin initial
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD;
    if (email && password) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email,
            name: "Administrateur",
            role: "SUPER_ADMIN",
            passwordHash: hashPassword(password),
            active: true,
          },
        });
        console.log(`[db-setup] compte admin créé : ${email}`);
      } else {
        console.log(`[db-setup] compte admin déjà présent : ${email}`);
      }
    } else {
      console.log(
        "[db-setup] ADMIN_EMAIL / ADMIN_SEED_PASSWORD absents — compte admin non créé.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log("[db-setup] terminé.");
}

main().catch((error) => {
  console.error("[db-setup] échec :", error);
  process.exit(1);
});

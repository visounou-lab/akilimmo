import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

const EMAIL    = "owner-test@akilimmo.com";
const PASSWORD = "OwnerTest2026!";
const NAME     = "Propriétaire Test";
const ROLE     = "OWNER";

// Frejus biens IDs (TETA + Tedji Akogbato)
const FREJUS_BIEN_IDS = [
  "cmo1rsj3g000104l1l0yx4bvj",
  "cmo1rpwiw000004l12eqmsqfm",
];

// Check if user already exists
const [existing] = await sql`SELECT id FROM "User" WHERE email = ${EMAIL}`;
let userId;

if (existing) {
  console.log(`User already exists: ${existing.id}`);
  userId = existing.id;
} else {
  const hash = await bcrypt.hash(PASSWORD, 12);
  const id   = `ctest-owner-${Date.now()}`;

  await sql`
    INSERT INTO "User" (id, name, email, password, role, status, "isVerified", "createdAt", "updatedAt")
    VALUES (
      ${id},
      ${NAME},
      ${EMAIL},
      ${hash},
      ${ROLE},
      'active',
      true,
      NOW(),
      NOW()
    )
  `;
  userId = id;
  console.log(`✓ User created: ${userId}`);
}

// Associate Frejus biens to this test user
for (const bienId of FREJUS_BIEN_IDS) {
  const [bien] = await sql`SELECT id, title, "ownerId" FROM "Property" WHERE id = ${bienId}`;
  if (!bien) {
    console.log(`  ⚠ Bien ${bienId} not found`);
    continue;
  }
  await sql`UPDATE "Property" SET "ownerId" = ${userId}, "updatedAt" = NOW() WHERE id = ${bienId}`;
  console.log(`✓ Bien "${bien.title}" → ownerId = ${userId}`);
}

// Confirm
const [user] = await sql`SELECT id, name, email, role, status FROM "User" WHERE id = ${userId}`;
const biens  = await sql`SELECT id, title, slug FROM "Property" WHERE "ownerId" = ${userId}`;

console.log("\n=== Compte créé / mis à jour ===");
console.log(user);
console.log("\n=== Biens associés ===");
biens.forEach(b => console.log(` · ${b.title}  (${b.slug})`));
console.log(`\nURL login : /login`);
console.log(`Email    : ${EMAIL}`);
console.log(`Password : ${PASSWORD}`);

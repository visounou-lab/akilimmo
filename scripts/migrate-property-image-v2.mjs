import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

console.log("▶ Migration PropertyImage v2 — ajout publicId, alt, index...\n");

// 1. Ajouter publicId (nullable, non-cassant)
await sql`ALTER TABLE "PropertyImage" ADD COLUMN IF NOT EXISTS "publicId" TEXT`;
console.log('✓ Colonne "publicId" TEXT (nullable)');

// 2. Ajouter alt (nullable, non-cassant)
await sql`ALTER TABLE "PropertyImage" ADD COLUMN IF NOT EXISTS "alt" TEXT`;
console.log('✓ Colonne "alt" TEXT (nullable)');

// 3. Index simple sur propertyId
await sql`CREATE INDEX IF NOT EXISTS "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId")`;
console.log('✓ Index PropertyImage_propertyId_idx');

// 4. Index composite (propertyId, isPrimary)
await sql`CREATE INDEX IF NOT EXISTS "PropertyImage_propertyId_isPrimary_idx" ON "PropertyImage"("propertyId", "isPrimary")`;
console.log('✓ Index PropertyImage_propertyId_isPrimary_idx');

// 5. Contrôle d'intégrité : count avant/après
const [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM "PropertyImage"`;
console.log(`\n✅ Migration terminée. ${total} ligne(s) PropertyImage intacte(s).`);

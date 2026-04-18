import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

console.log("▶ Backfill PropertyImage depuis imageUrl...\n");

// Biens qui ont un imageUrl mais aucune PropertyImage associée
const properties = await sql`
  SELECT p.id, p.title, p."imageUrl"
  FROM "Property" p
  LEFT JOIN "PropertyImage" pi ON pi."propertyId" = p.id
  WHERE p."imageUrl" IS NOT NULL
  GROUP BY p.id, p.title, p."imageUrl"
  HAVING COUNT(pi.id) = 0
`;

if (properties.length === 0) {
  console.log("ℹ️  Aucun bien à migrer (tous ont déjà des PropertyImage ou pas d'imageUrl).");
  process.exit(0);
}

let count = 0;
for (const p of properties) {
  await sql`
    INSERT INTO "PropertyImage" ("id", "propertyId", "url", "publicId", "alt", "isPrimary", "order", "createdAt")
    VALUES (
      ${"c" + Math.random().toString(36).slice(2, 26)},
      ${p.id},
      ${p.imageUrl},
      ${null},
      ${p.title},
      ${true},
      ${0},
      NOW()
    )
  `;
  console.log(`✓ ${p.title} → PropertyImage principale créée`);
  count++;
}

console.log(`\n✅ ${count} PropertyImage(s) migrée(s).`);

// Contrôle : vérifier qu'aucun bien avec imageUrl n'est resté sans PropertyImage
const [{ remaining }] = await sql`
  SELECT COUNT(*)::int AS remaining
  FROM "Property" p
  LEFT JOIN "PropertyImage" pi ON pi."propertyId" = p.id
  WHERE p."imageUrl" IS NOT NULL
  GROUP BY p.id
  HAVING COUNT(pi.id) = 0
`;
if (remaining === 0) {
  console.log("✓ Contrôle OK : tous les biens avec imageUrl ont au moins une PropertyImage.");
} else {
  console.warn(`⚠️  ${remaining} bien(s) avec imageUrl encore sans PropertyImage.`);
}

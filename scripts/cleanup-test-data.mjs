import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

// 1. Supprime les biens dont le titre contient "Villa moderne"
const deletedProperties = await sql`
  DELETE FROM "Property"
  WHERE title ILIKE '%Villa moderne%'
  RETURNING id, title
`;

if (deletedProperties.length === 0) {
  console.log("ℹ️  Aucun bien 'Villa moderne' trouvé.");
} else {
  for (const p of deletedProperties) {
    console.log(`✓ Bien supprimé : "${p.title}" (${p.id})`);
  }
}

// 2. Supprime le User info@akilimmo.com avec role OWNER uniquement
const targetEmail = "info@akilimmo.com";

const user = await sql`
  SELECT id, email, name, role FROM "User"
  WHERE email = ${targetEmail}
  LIMIT 1
`;

if (user.length === 0) {
  console.log(`ℹ️  Aucun utilisateur trouvé avec l'email ${targetEmail}.`);
} else {
  const u = user[0];
  if (u.role !== "OWNER") {
    console.log(`⚠️  Utilisateur ${targetEmail} a le rôle "${u.role}" — suppression annulée (rôle attendu : OWNER).`);
  } else {
    // Supprimer les dépendances liées (sessions, accounts) avant l'utilisateur
    await sql`DELETE FROM "Session" WHERE "userId" = ${u.id}`;
    await sql`DELETE FROM "Account" WHERE "userId" = ${u.id}`;
    const deleted = await sql`
      DELETE FROM "User"
      WHERE id = ${u.id} AND email = ${targetEmail} AND role = 'OWNER'
      RETURNING id, email, name, role
    `;
    if (deleted.length > 0) {
      console.log(`✓ Utilisateur supprimé : ${deleted[0].email} (${deleted[0].name}, rôle: ${deleted[0].role})`);
    }
  }
}

console.log("\n✅ Nettoyage terminé.");

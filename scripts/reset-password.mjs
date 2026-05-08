import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

const email    = "info@akilimmo.com";
const password = "Test1234!";

const hashed = await bcrypt.hash(password, 12);

const rows = await sql`
  UPDATE "User"
  SET password = ${hashed}
  WHERE email = ${email}
  RETURNING id, email, name, role
`;

if (rows.length === 0) {
  console.error("Erreur : aucun utilisateur trouvé avec l'email", email);
  process.exit(1);
}

const user = rows[0];
console.log("✓ Mot de passe mis à jour pour :", user.email);
console.log("  ID   :", user.id);
console.log("  Nom  :", user.name);
console.log("  Rôle :", user.role);

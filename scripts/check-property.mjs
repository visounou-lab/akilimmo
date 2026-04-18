import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

const [target] = await sql`
  SELECT id, title, slug, status, "publishStatus"
  FROM "Property"
  WHERE id = 'cmo1ruxlh00004l5pm2phxg3'
`;

console.log("\n=== Bien ciblé ===");
console.log(target ?? "NOT FOUND");

const all = await sql`
  SELECT id, slug, status, "publishStatus"
  FROM "Property"
  ORDER BY "createdAt" DESC
  LIMIT 10
`;

console.log("\n=== 10 derniers biens (slug + publishStatus) ===");
all.forEach((r) => console.log(r));

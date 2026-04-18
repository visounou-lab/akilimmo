import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

// Fix all known double-city slugs
const fixes = [
  {
    id: 'cmo1ruxlh000004l5pm2phxg3',
    oldSlug: 'appartement-meuble-3-chambres-cite-arconville-abomey-calavi-abomey-calavi',
    newSlug: 'appartement-meuble-3-chambres-cite-arconville-abomey-calavi',
  },
  {
    id: 'cmo1rsj3g000104l1l0yx4bvj',
    oldSlug: 'appartement-meuble-teta-2-chambres-akogbato-cotonou-cotonou',
    newSlug: 'appartement-meuble-teta-2-chambres-akogbato-cotonou',
  },
  {
    id: 'cmo1rpwiw000004l12eqmsqfm',
    oldSlug: 'appartement-meuble-tedji-akogbato-cotonou-cotonou',
    newSlug: 'appartement-meuble-tedji-akogbato-cotonou',
  },
];

for (const { id, oldSlug, newSlug } of fixes) {
  const result = await sql`
    UPDATE "Property"
    SET slug = ${newSlug}
    WHERE id = ${id} AND slug = ${oldSlug}
  `;
  console.log(`${oldSlug} → ${newSlug}`);
}

const all = await sql`
  SELECT id, title, slug, status
  FROM "Property"
  ORDER BY "createdAt" DESC
  LIMIT 10
`;
console.log("\n=== Slugs finaux ===");
all.forEach((r) => console.log(`/biens/${r.slug}  [${r.status}]`));
